from rest_framework import serializers
from masters.models import State, Article
from .models import Order, OrderParty, ShippingAddress

class StateSerializer(serializers.ModelSerializer):
    class Meta:
        model = State
        fields = '__all__'

class ArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Article
        fields = '__all__'

class OrderPartySerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderParty
        fields = ['id', 'party_type', 'name', 'relation_name', 'address', 'city', 'state', 'pincode', 'identity_number']

class ShippingAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingAddress
        fields = ['receiver_name', 'contact_number', 'address_line', 'pincode', 'city', 'state']

class OrderSerializer(serializers.ModelSerializer):
    parties = OrderPartySerializer(many=True)
    shipping_address = ShippingAddressSerializer(required=False)
    state_details = StateSerializer(source='state', read_only=True)
    article_details = ArticleSerializer(source='article', read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'service_type', 'status', 'delivery_type',
            'delivery_email', 'delivery_mobile',
            'state', 'state_details', 'article', 'article_details',
            'document_reason', 'consideration_price',
            'stamp_amount', 'service_fee', 'shipping_fee', 'total_amount',
            'parties', 'shipping_address', 'created_at'
        ]
        read_only_fields = ['order_number', 'status', 'total_amount', 'user', 'vendor']

    def validate(self, data):
        delivery_type = data.get('delivery_type', Order.DeliveryType.DIGITAL)
        
        # Digital Delivery Validation
        if delivery_type in [Order.DeliveryType.DIGITAL, Order.DeliveryType.BOTH]:
            if not data.get('delivery_email'):
                raise serializers.ValidationError({"delivery_email": "Required for Digital/Both delivery."})
            if not data.get('delivery_mobile'):
                raise serializers.ValidationError({"delivery_mobile": "Required for Digital/Both delivery."})
        
        # Physical Delivery Validation
        if delivery_type in [Order.DeliveryType.PHYSICAL, Order.DeliveryType.BOTH]:
            if not self.initial_data.get('shipping_address'):
                raise serializers.ValidationError({"shipping_address": "Required for Physical/Both delivery."})
                
        return data

    def create(self, validated_data):
        parties_data = validated_data.pop('parties')
        shipping_data = validated_data.pop('shipping_address', None)
        
        # Calculate fees (Basic logic for now)
        # TODO: Move to a calculation service
        validated_data['service_fee'] = 50  # Example fixed fee
        if validated_data.get('delivery_type') in [Order.DeliveryType.PHYSICAL, Order.DeliveryType.BOTH]:
            validated_data['shipping_fee'] = 100
        else:
            validated_data['shipping_fee'] = 0
            
        # Basic Stamp Duty Calc (Just passing through for now, typically user inputs or calc logic)
        # Assuming frontend sends stamp_amount or we calc from consideration_price * article.rate
        # For MVP, let's trust the input or set defaults. 
        # Ideally, we should recalculate here.
        
        validated_data['total_amount'] = (
            validated_data.get('stamp_amount', 0) + 
            validated_data['service_fee'] + 
            validated_data['shipping_fee']
        )
        
        order = Order.objects.create(**validated_data)

        for party in parties_data:
            OrderParty.objects.create(order=order, **party)
            
        if shipping_data and validated_data.get('delivery_type') != Order.DeliveryType.DIGITAL:
            ShippingAddress.objects.create(order=order, **shipping_data)
            
        return order

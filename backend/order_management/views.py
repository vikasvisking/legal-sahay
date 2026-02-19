from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from masters.models import State, Article
from .models import Order
from .serializers import StateSerializer, ArticleSerializer, OrderSerializer

class StateViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = State.objects.filter(is_enabled=True)
    serializer_class = StateSerializer
    permission_classes = [permissions.AllowAny]

class ArticleViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    permission_classes = [permissions.AllowAny]

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Users see their own orders
        return Order.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['post'])
    def calculate_fees(self, request):
        """
        Helper endpoint to calculate stamp duty and fees before order creation.
        """
        amount = request.data.get('consideration_price', 0)
        article_id = request.data.get('article_id')
        state_id = request.data.get('state_id')
        delivery_type = request.data.get('delivery_type', 'DIGITAL')
        
        # TODO: Implement actual state-wise logic
        stamp_duty = 100 # Dummy
        service_fee = 50
        shipping_fee = 100 if delivery_type != 'DIGITAL' else 0
        
        return Response({
            'stamp_duty': stamp_duty,
            'service_fee': service_fee,
            'shipping_fee': shipping_fee,
            'total': stamp_duty + service_fee + shipping_fee
        })

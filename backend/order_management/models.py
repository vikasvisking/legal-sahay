from django.db import models
from django.conf import settings
from masters.models import State, Article
import uuid

class ServiceType(models.TextChoices):
    ESTAMP = 'ESTAMP', 'E-Stamp'
    DOCUMENT = 'DOCUMENT', 'Legal Document'
    COMBO = 'COMBO', 'Document + E-Stamp'

class OrderStatus(models.TextChoices):
    DRAFT = 'DRAFT', 'Draft'
    PENDING = 'PENDING', 'Pending Payment'
    PROCESSING = 'PROCESSING', 'Processing'
    COMPLETED = 'COMPLETED', 'Completed'
    FAILED = 'FAILED', 'Failed'
    CANCELLED = 'CANCELLED', 'Cancelled'

class DeliveryType(models.TextChoices):
    DIGITAL = 'DIGITAL', 'Digital Only'
    PHYSICAL = 'PHYSICAL', 'Physical Delivery'
    BOTH = 'BOTH', 'Both'

class Order(models.Model):

    order_number = models.CharField(max_length=50, unique=True, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='placed_orders')
    vendor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_orders')
    
    service_type = models.CharField(max_length=20, choices=ServiceType.choices)
    state = models.ForeignKey(State, on_delete=models.SET_NULL, null=True)
    article = models.ForeignKey(Article, on_delete=models.SET_NULL, null=True, blank=True)
    
    document_reason = models.TextField(blank=True, help_text="Purpose of the document")
    consideration_price = models.DecimalField(max_digits=15, decimal_places=2, default=0, help_text="Consideration Value")
    
    stamp_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    service_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    shipping_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    status = models.CharField(max_length=20, choices=OrderStatus.choices, default=OrderStatus.DRAFT)
    delivery_type = models.CharField(max_length=20, choices=DeliveryType.choices, default=DeliveryType.DIGITAL)
    
    # Digital Delivery Details
    delivery_email = models.EmailField(blank=True, null=True, help_text="Email for digital delivery")
    delivery_mobile = models.CharField(max_length=15, blank=True, null=True, help_text="Mobile for digital delivery")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.order_number:
            self.order_number = f"ORD-{uuid.uuid4().hex[:8].upper()}"
        super().save(*args, **kwargs)

    def __str__(self):
        return self.order_number

class OrderParty(models.Model):
    class PartyType(models.TextChoices):
        FIRST_PARTY = 'FIRST_PARTY', 'First Party'
        SECOND_PARTY = 'SECOND_PARTY', 'Second Party'

    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='parties')
    party_type = models.CharField(max_length=20, choices=PartyType.choices)
    name = models.CharField(max_length=200)
    relation_name = models.CharField(max_length=200, help_text="Father/Husband Name", null=True, blank=True)
    
    # Address Details
    address = models.TextField()
    city = models.CharField(max_length=100, default='', blank=True)
    state = models.CharField(max_length=100, default='', blank=True)
    pincode = models.CharField(max_length=10, default='', blank=True)
    identity_number = models.CharField(max_length=50, blank=True, help_text="PAN/Aadhaar")

    def __str__(self):
        return f"{self.name} ({self.party_type})"

class ShippingAddress(models.Model):
    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name='shipping_address')
    receiver_name = models.CharField(max_length=200)
    contact_number = models.CharField(max_length=20)
    address_line = models.TextField()
    pincode = models.CharField(max_length=10)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    
    provider = models.CharField(max_length=100, blank=True)
    tracking_number = models.CharField(max_length=100, blank=True)
    dispatched_at = models.DateTimeField(null=True, blank=True)
    delivered_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Ship to {self.receiver_name}"

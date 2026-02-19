from django.db import models
from order_management.models import Order

class EStamp(models.Model):
    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name='estamp_result')
    certificate_number = models.CharField(max_length=100, unique=True)
    grn_number = models.CharField(max_length=100, blank=True, help_text="Govt. Receipt Number")
    issued_date = models.DateTimeField()
    
    file = models.FileField(upload_to='estamps/certificates/')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.certificate_number

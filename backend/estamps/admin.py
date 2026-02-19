from django.contrib import admin
from .models import EStamp

@admin.register(EStamp)
class EStampAdmin(admin.ModelAdmin):
    list_display = ('certificate_number', 'order', 'issued_date')
    search_fields = ('certificate_number', 'order__order_number', 'grn_number')
    date_hierarchy = 'issued_date'

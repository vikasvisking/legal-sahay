from django.contrib import admin
from .models import Order, OrderParty, ShippingAddress

class OrderPartyInline(admin.TabularInline):
    model = OrderParty
    extra = 0

class ShippingAddressInline(admin.StackedInline):
    model = ShippingAddress
    extra = 0

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('order_number', 'user', 'service_type', 'status', 'total_amount', 'created_at')
    list_filter = ('status', 'service_type', 'delivery_type', 'state')
    search_fields = ('order_number', 'user__email', 'user__mobile')
    inlines = [OrderPartyInline, ShippingAddressInline]
    readonly_fields = ('order_number', 'created_at', 'updated_at')

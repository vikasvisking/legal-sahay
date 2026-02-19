from rest_framework import viewsets, permissions, serializers
from .models import EStamp
from order_management.models import Order

class EStampSerializer(serializers.ModelSerializer):
    class Meta:
        model = EStamp
        fields = '__all__'

class EStampViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Read-only view for users to download their certificates.
    Creation happens via Vendor/Admin actions (separate endpoint or admin panel).
    """
    serializer_class = EStampSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return EStamp.objects.filter(order__user=self.request.user)

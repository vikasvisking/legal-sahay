from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EStampViewSet

router = DefaultRouter()
router.register(r'certificates', EStampViewSet, basename='estamp')

urlpatterns = [
    path('', include(router.urls)),
]

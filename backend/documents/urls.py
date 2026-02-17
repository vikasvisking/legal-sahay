from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DocumentCategoryViewSet, DocumentTypeViewSet, TemplateViewSet

router = DefaultRouter()
router.register(r'categories', DocumentCategoryViewSet)
router.register(r'types', DocumentTypeViewSet)
router.register(r'templates', TemplateViewSet)

urlpatterns = [
    path('', include(router.urls)),
]

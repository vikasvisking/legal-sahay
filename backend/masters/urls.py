from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import StateViewSet, ArticleViewSet

router = DefaultRouter()
router.register(r'states', StateViewSet, basename='state')
router.register(r'articles', ArticleViewSet, basename='article')

urlpatterns = [
    path('', include(router.urls)),
]

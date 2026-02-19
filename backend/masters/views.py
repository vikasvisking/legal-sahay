from rest_framework import viewsets, permissions
from .models import State, Article
from .serializers import StateSerializer, ArticleSerializer
from django.db.models import Q

class StateViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = State.objects.filter(is_enabled=True)
    serializer_class = StateSerializer
    permission_classes = [permissions.AllowAny]

from drf_spectacular.utils import extend_schema, OpenApiParameter

class ArticleViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ArticleSerializer
    permission_classes = [permissions.AllowAny]

    @extend_schema(
        parameters=[
            OpenApiParameter(name='state_id', description='Filter by State ID', required=False, type=int),
        ],
        description="List all articles. Optionally filter by state_id to see articles available in that specific state (including global ones)."
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    def get_queryset(self):
        queryset = Article.objects.all()
        state_id = self.request.query_params.get('state_id')
        
        if state_id:
            # Return articles that are for All States OR linked to the specific state
            queryset = queryset.filter(Q(is_all_states=True) | Q(states__id=state_id)).distinct()
            
        return queryset

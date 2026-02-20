from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import DocumentCategory, DocumentType, Template, UserDocument
from .serializers import DocumentCategorySerializer, DocumentTypeSerializer, TemplateSerializer, UserDocumentSerializer
from services.gemini import GeminiService

class DocumentCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = DocumentCategory.objects.all()
    serializer_class = DocumentCategorySerializer

class DocumentTypeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = DocumentType.objects.all()
    serializer_class = DocumentTypeSerializer
    filterset_fields = ['category']

class TemplateViewSet(viewsets.ModelViewSet):
    queryset = Template.objects.all()
    serializer_class = TemplateSerializer
    
    @action(detail=False, methods=['post'], url_path='generate')
    def generate_or_fetch(self, request):
        """
        Fetch existing template or Generate new one using AI if not found.
        """
        doc_type_id = request.data.get('document_type_id')
        state = request.data.get('state')
        
        if not doc_type_id or not state:
            return Response({'error': 'document_type_id and state are required'}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            doc_type = DocumentType.objects.get(id=doc_type_id)
        except DocumentType.DoesNotExist:
            return Response({'error': 'Invalid Document Type'}, status=status.HTTP_404_NOT_FOUND)

        # 1. Check DB for Verified or Pending template
        template = Template.objects.filter(
            document_type=doc_type, 
            state__iexact=state,
            is_active=True
        ).first()

        if template:
            return Response(TemplateSerializer(template).data)

        # 2. Not Found? Trigger AI Generation
        ai_service = GeminiService()
        generated_data = ai_service.generate_template(doc_type.name, state)
        print(generated_data, 'generated_data')
        
        if not generated_data:
            return Response({'error': 'Failed to generate template. Please try again.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # 3. Save as Pending Review
        new_template = Template.objects.create(
            document_type=doc_type,
            state=state,
            content_html=generated_data.get('html_content', ''),
            form_schema=generated_data.get('form_schema', []),
            status=Template.Status.PENDING_REVIEW,
            is_active=True # Allow immediate use as per requirement
        )

        return Response(TemplateSerializer(new_template).data, status=status.HTTP_201_CREATED)

from rest_framework import serializers
from .models import DocumentCategory, DocumentType, Template

class DocumentCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = DocumentCategory
        fields = '__all__'

class DocumentTypeSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    
    class Meta:
        model = DocumentType
        fields = ['id', 'name', 'slug', 'description', 'category', 'category_name']

class TemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Template
        fields = ['id', 'document_type', 'state', 'content_html', 'form_schema', 'status', 'is_active']

from .models import UserDocument

class UserDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserDocument
        fields = '__all__'


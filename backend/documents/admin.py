from django.contrib import admin
from simple_history.admin import SimpleHistoryAdmin
from .models import DocumentCategory, DocumentType, Template, UserDocument, Prompt

@admin.register(DocumentCategory)
class DocumentCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'icon')
    prepopulated_fields = {'slug': ('name',)}

@admin.register(DocumentType)
class DocumentTypeAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'slug')
    list_filter = ('category',)
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Template)
class TemplateAdmin(admin.ModelAdmin):
    list_display = ('document_type', 'state', 'status', 'is_active', 'updated_at')
    list_filter = ('status', 'is_active', 'state', 'document_type')
    search_fields = ('document_type__name', 'state')

@admin.register(UserDocument)
class UserDocumentAdmin(admin.ModelAdmin):
    list_display = ('user', 'template', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('user__phone_number', 'user__full_name')

@admin.register(Prompt)
class PromptAdmin(SimpleHistoryAdmin):
    list_display = ('prompt_type', 'description', 'is_active')
    list_filter = ('prompt_type', 'is_active')

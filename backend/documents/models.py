from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _
from simple_history.models import HistoricalRecords

class DocumentCategory(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True, blank=True)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, blank=True, help_text="Lucide icon name")

    def __str__(self):
        return self.name

class DocumentType(models.Model):
    category = models.ForeignKey(DocumentCategory, on_delete=models.CASCADE, related_name='document_types')
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=100, unique=True, blank=True)
    description = models.TextField(blank=True)
    
    def __str__(self):
        return self.name

class Template(models.Model):
    class Status(models.TextChoices):
        VERIFIED = 'VERIFIED', _('Verified')
        PENDING_REVIEW = 'PENDING_REVIEW', _('Pending Review')
        REJECTED = 'REJECTED', _('Rejected')

    document_type = models.ForeignKey(DocumentType, on_delete=models.CASCADE, related_name='templates')
    state = models.CharField(max_length=100, help_text="State Name or 'All India'")
    
    # The actual legal content with placeholders like {{landlord_name}}
    # HTML format for easy printing/PDF generation
    content_html = models.TextField(help_text="HTML content with {{variables}}")
    
    # JSON Schema to dynamically render the form on Frontend
    # Structure: [{"key": "landlord_name", "label": "Name", "type": "text", "placeholder": "..."}]
    form_schema = models.JSONField(default=list, help_text="List of form fields definition")
    
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING_REVIEW)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('document_type', 'state')

    def __str__(self):
        return f"{self.document_type.name} - {self.state} ({self.status})"

class UserDocument(models.Model):
    class Status(models.TextChoices):
        DRAFT = 'DRAFT', _('Draft')
        PAID = 'PAID', _('Paid')
        PROCESSING = 'PROCESSING', _('Processing')
        COMPLETED = 'COMPLETED', _('Completed')
        DELIVERED = 'DELIVERED', _('Delivered')

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='documents')
    template = models.ForeignKey(Template, on_delete=models.SET_NULL, null=True)
    
    # Actual data filled by the user matching the form_schema
    form_data = models.JSONField(default=dict)
    
    generated_file = models.FileField(upload_to='documents/generated/', blank=True, null=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.DRAFT)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user} - {self.template} - {self.status}"

class PromptType(models.TextChoices):
    GENERATE_DOCUMENT = 'GENERATE_DOCUMENT', _('Generate Document')
    SUMMARIZE_LEGAL = 'SUMMARIZE_LEGAL', _('Summarize Legal Text')

class Prompt(models.Model):
    prompt_type = models.CharField(max_length=50, choices=PromptType.choices, unique=True)
    description = models.CharField(max_length=255)
    
    # Prompt Components - Merged act_as into input_format as requested
    input_format = models.TextField(help_text="Instructions on input context and persona")
    output_format = models.TextField(help_text="Instructions on expected output format (JSON/HTML)")
    
    is_active = models.BooleanField(default=True)
    history = HistoricalRecords()

    def construct_prompt(self, **kwargs):
        return f"{self.input_format}\n{self.output_format}".format(**kwargs)

    def __str__(self):
        return self.get_prompt_type_display()

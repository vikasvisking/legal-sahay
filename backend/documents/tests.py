from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from .models import DocumentCategory, DocumentType, Template, Prompt, PromptType
from unittest.mock import patch

User = get_user_model()

class DocumentServiceTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(phone_number='+919876543210')
        self.client.force_authenticate(user=self.user)
        
        self.category = DocumentCategory.objects.create(name="Business", slug="business")
        self.doc_type = DocumentType.objects.create(name="Partnership Deed", slug="partnership-deed", category=self.category)

    def test_prompt_versioning(self):
        """Test that prompts are versioned using simple_history"""
        prompt = Prompt.objects.create(
            prompt_type=PromptType.GENERATE_DOCUMENT,
            description="Initial Prompt",
            input_format="Input...",
            output_format="Output..."
        )
        
        # Initial State
        self.assertEqual(prompt.history.count(), 1)
        
        # Update
        prompt.input_format = "Updated Input..."
        prompt.save()
        
        # Check History
        self.assertEqual(prompt.history.count(), 2)
        self.assertEqual(prompt.history.first().input_format, "Updated Input...")
        self.assertEqual(prompt.history.last().input_format, "Input...")

    @patch('documents.gemini_service.GeminiService.generate_template')
    def test_generate_ai_template(self, mock_generate):
        """Test triggering AI generation when template is missing"""
        # Create a Prompt to ensure DB path is taken (though logic mocked)
        Prompt.objects.create(
            prompt_type=PromptType.GENERATE_DOCUMENT,
            description="Test Prompt",
            input_format="Act as Legal Expert...",
            output_format="Return JSON..."
        )

        # Mock AI response
        mock_generate.return_value = {
            "html_content": "<h1>AI Generated</h1>",
            "form_schema": [{"key": "ai_field"}]
        }
        
        data = {
            'document_type_id': self.doc_type.id,
            'state': 'Bihar'
        }
        response = self.client.post('/api/documents/templates/generate/', data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['status'], "PENDING_REVIEW")

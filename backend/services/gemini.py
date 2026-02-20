import os
import json
from google import genai
from google.genai import types
from django.conf import settings
from documents.models import Prompt, PromptType

class GeminiService:
    def __init__(self):
        # Use Django settings to get the key
        self.api_key = getattr(settings, "GEMINI_API_KEY", None)
        if not self.api_key:
            print("Warning: GEMINI_API_KEY not found in settings.")
        else:
            # Configure the client with the API key
             try:
                self.client = genai.Client(api_key=self.api_key)
             except Exception as e:
                print(f"Error configuring Gemini client: {e}")

    def generate_template(self, document_type, state):
        """
        Generates a legal document template (HTML + JSON Schema) using Gemini.
        Uses the active 'GENERATE_DOCUMENT' prompt from DB if available.
        """
        if not self.api_key:
            return None

        # Fetch Active Prompt from DB
        try:
            prompt_obj = Prompt.objects.get(
                prompt_type=PromptType.GENERATE_DOCUMENT, 
                is_active=True
            )
            # Use specific system_instruction if available, else fallback (empty string)
            system_instruction = prompt_obj.system_instruction
            
            # Construct User Prompt (Inputs + Output Format)
            # We treat input_format + output_format as the "User Message"
            user_content = prompt_obj.construct_prompt(document_type=document_type, state=state)
            
            print("System Instruction:", system_instruction)
            print("User Content:", user_content)

        except Prompt.DoesNotExist:
            print("Warning: Active prompt for GENERATE_DOCUMENT not found. Using fallback.")
            # Fallback
            system_instruction = "You are an expert lawyer for Indian Law. Prioritize accuracy."
            user_content = f"Create a '{document_type}' template for '{state}'. Return JSON with html_content and form_schema."

        try:
            # Configure the model
            config = types.GenerateContentConfig(
                system_instruction=system_instruction,
                temperature=0.0,
                response_mime_type="application/json"
            )

            response = self.client.models.generate_content(
                model='gemini-2.0-flash', 
                contents=user_content,
                config=config
            )
            
            result_text = response.text
            print("AI Response:", result_text)
            
            return json.loads(result_text)
            
        except Exception as e:
            print(f"Gemini Generation Error: {e}")
            return None

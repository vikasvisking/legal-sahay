import os
import json
import google.genai as genai
from django.conf import settings
from .models import Prompt, PromptType

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
            final_prompt = prompt_obj.construct_prompt(document_type=document_type, state=state)
            print(final_prompt, 'final_prompt')
        except Prompt.DoesNotExist:
            print("Warning: Active prompt for GENERATE_DOCUMENT not found. Using fallback.")
            # Fallback (Hardcoded for safety/bootstrap)
            final_prompt = f"""
            Act as a Legal Expert for Indian Law.
            Create a '{document_type}' template specifically for the state of '{state}'.
            
            Output a JSON object with exactly two keys:
            1. "html_content": A print-ready HTML string (A4 size styled) of the legal document. 
               - Use placeholders for dynamic data in the format {{{{variable_name}}}}.
               - Include CSS for clean printing (font-size 12pt, margins etc).
               - Do not use markdown backticks or 'html' tags outside the string.
            
            2. "form_schema": A list of JSON objects defining the form fields for the placeholders.
               - Each object must have: "key" (matches variable_name), "label", "type" (text, date, number, textarea), "placeholder".
               
            Ensure the legal content is accurate for {state}, India.
            """

        try:
            response = self.client.models.generate_content(
                model='gemini-2.0-flash', 
                contents=final_prompt
            )
            result_text = response.text
            print(result_text, 'result_text')
            
            # Clean up potential markdown formatting from AI
            if result_text.strip().startswith("```json"):
                result_text = result_text.replace("```json", "").replace("```", "")
            
            return json.loads(result_text)
            
        except Exception as e:
            print(f"Gemini Generation Error: {e}")
            return None

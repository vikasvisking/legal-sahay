import json
import base64
from google import genai
from google.genai import types
from django.conf import settings

from documents.models import Prompt, PromptType

class VerificationService:
    def __init__(self):
        self.api_key = getattr(settings, "GEMINI_API_KEY", None)
        if not self.api_key:
            print("Warning: GEMINI_API_KEY not found in settings.")
        else:
             try:
                self.client = genai.Client(api_key=self.api_key)
             except Exception as e:
                print(f"Error configuring Gemini client: {e}")

    def verify_document_data(self, file_content, expected_data: dict, mime_type="application/pdf"):
        """
        Verifies E-Stamp details against expected data using DB Prompt.
        """
        if not self.api_key:
            return None

        expected_json = json.dumps(expected_data, indent=2)

        try:
            prompt_obj = Prompt.objects.get(
                prompt_type=PromptType.VERIFY_DOCUMENT,
                is_active=True
            )
            system_instruction = prompt_obj.system_instruction
            user_content = prompt_obj.construct_prompt(expected_json=expected_json)
        except Prompt.DoesNotExist:
            print("Warning: VERIFY_DOCUMENT prompt not found. Using fallback.")
            system_instruction = "You are a Legal Document Verification Agent."
            user_content = f"Check if this EXPECTED DATA matches the document:\n{expected_json}\nReturn JSON with is_correct, differences, certificate_number, grn_number."

        try:
            response = self.client.models.generate_content(
                model='gemini-2.0-flash',
                contents=[
                    types.Part.from_bytes(data=file_content, mime_type=mime_type),
                    user_content
                ],
                config=types.GenerateContentConfig(
                    system_instruction=system_instruction,
                    response_mime_type="application/json",
                    temperature=0.0
                )
            )

            result_text = response.text
            if result_text.startswith("```json"):
                result_text = result_text.replace("```json", "").replace("```", "")
            
            return json.loads(result_text)

        except Exception as e:
            print(f"Verification Error: {e}")
            return None

import os
import django
import sys

# Setup Django Environment
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from documents.models import Prompt, PromptType

def seed_prompts():
    print("Seeding Prompts with System Instructions...")
    
    # 1. System Instruction (Persona & Constraints)
    system_instruction = """
    You are an expert lawyer with over 20 years of experience in Indian Law and the Constitution.
    Your task is to generate legal documents such as rent agreements, affidavits, sales agreements, etc.
    Prioritize accuracy, legal compliance, and clarity.
    If you do not know the answer, state that you cannot fulfill the request due to lack of information.
    Always response in valid JSON format.
    """

    # 2. Input Format (Context & Dynamic Variables)
    input_format = """
    **Request Details:**
    - **Document Type**: {document_type}
    - **State**: {state}


    **Contextual Instructions:**
    - Provide a comprehensive template compliant with the laws of the specified state.
    - Include relevant clauses, terms, and conditions typical for this document in Indian law.
    - Ensure the document is clear, concise, and free of unnecessary jargon.
    - Include a disclaimer regarding the need for professional legal advice.
    """

    # 3. Output Format (Schema Definition)
    # Even though we enforce JSON mode, providing the schema helps the model understand the expected structure.
    output_format = """
    **Required Output Schema (JSON):**
    {
        "html_content": "A print-ready HTML string (A4 size styled) of the legal document. use placeholders like {{{{variable_name}}}}. Include CSS for clean printing (font-size 12pt, margins etc). Do NOT use markdown backticks or 'html' tags outside the string.",
        "form_schema": [
            {
                "key": "variable_name",
                "label": "Human Readable Label",
                "type": "text | date | number | textarea",
                "placeholder": "Example value"
            }
        ]
    }
    """

    description = "Standard Document Generation Prompt (Indian Law) - v2 System Instruct"

    # Update or Create
    prompt, created = Prompt.objects.update_or_create(
        prompt_type=PromptType.GENERATE_DOCUMENT,
        defaults={
            'description': description,
            'system_instruction': system_instruction,
            'input_format': input_format,
            'output_format': output_format,
            'is_active': True
        }
    )
    
    action = "Created" if created else "Updated"
    print(f"{action} prompt: {prompt}")

if __name__ == "__main__":
    seed_prompts()

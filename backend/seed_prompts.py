import os
import django
import sys

# Setup Django Environment
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from documents.models import Prompt, PromptType

def seed_prompts():
    print("Seeding Prompts...")
    
    # Prompt Content from User's input (Untitled-1)
    input_fmt = """
    You are an expert lawyer with over 20 years of experience in Indian Law and the Constitution.
    Your task is to regenerate legal documents such as rent agreements, affidavits, sales agreements, etc based on the provided JSON input.
    You will utilize your extensive knowledge and perform web searches to ensure the information is accurate and up-to-date.

    **Instructions:** 

    1.**Dynamic Inputs used in prompt:**
        - **Document Type**: {document_type}
        - **State**: {state}

    2.**Contextual Information:**
        - You will provide a comprehensive template for the specified document type that is compliant with the laws of the specified state.
        - Include relevant clauses, terms, and conditions that are typical for the specified document type in the context of Indian law.

    3.**Web Search:**
        - If only needed, Conduct a web search to gather the latest legal requirements and best practices related to the specified document type and state.
        - Incorporate any recent amendments or legal precedents that may affect the document.

    4.**Quality Assurance:** 
        - Ensure that the generated document is clear, concise, and free of legal jargon when possible, making it accessible for clients.
        - Include disclaimers regarding the necessity of consulting a lawyer for personalized legal advice.
    """

    output_fmt = """
    **Output Format:** 
      Output a JSON object with exactly two keys:
        1. "html_content": A print-ready HTML string (A4 size styled) of the legal document. 
            - Use placeholders for dynamic data in the format {{{{variable_name}}}}.
            - Include CSS for clean printing (font-size 12pt, margins etc).
            - Do not use markdown backticks or 'html' tags outside the string.
            - Ensure the HTML structure follows standard legal document formatting (Title, Parties, Clauses, Signatures).
        
        2. "form_schema": A list of JSON objects defining the form fields for the placeholders.
            - Each object must have: "key" (matches variable_name), "label", "type" (text, date, number, textarea), "placeholder".
    """

    description = "Standard Document Generation Prompt (Indian Law)"

    prompt, created = Prompt.objects.update_or_create(
        prompt_type=PromptType.GENERATE_DOCUMENT,
        defaults={
            'description': description,
            'input_format': input_fmt,
            'output_format': output_fmt,
            'is_active': True
        }
    )
    
    if created:
        print(f"Created new prompt: {prompt}")
    else:
        print(f"Updated existing prompt: {prompt}")

if __name__ == "__main__":
    seed_prompts()

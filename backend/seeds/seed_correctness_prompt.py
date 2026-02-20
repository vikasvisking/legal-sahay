import os
import sys
import django

# Add the backend directory to the sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from documents.models import Prompt, PromptType

def seed_verification_prompt():
    print("Seeding Correctness Verification Prompt...")

    prompt, created = Prompt.objects.get_or_create(
        prompt_type=PromptType.VERIFY_DOCUMENT,
        defaults={
            'description': 'Validates E-Stamp/Document fields against user input (Correctness Detection)',
            'system_instruction': 'You are a meticulous Legal Document Verification Agent. Your strict priority is absolute accuracy when comparing provided expected JSON data against the content visibly written or printed in the provided image/PDF document. You must return exactly the requested raw JSON format, with no markdown wrappers.',
            'input_format': '''I am providing you with an E-Stamp / Legal Document (image/PDF) and the following EXPECTED DATA entered by a user:
        
{expected_json}

Your task is to check if these expected details match what is actually written/printed in the document.''',
            'output_format': '''Return ONLY a raw JSON object with exactly this structure:
{
    "is_correct": true/false,
    "differences": {
        "field_name": "Explanation of difference (e.g., Expected X but found Y in document)"
    },
    "certificate_number": "Extract the Certificate No / E-Stamp No if present, else null",
    "grn_number": "Extract the GRN No / Unique Doc No if present, else null"
}

Rules:
1. "is_correct" should be true only if ALL provided fields substantially match the document's content.
2. If "is_correct" is false, populate the "differences" object with the specific fields that failed validation.
3. If "is_correct" is true, "differences" can be empty.
4. ALWAYS try to extract "certificate_number" and "grn_number" from the document, regardless of validation success.
5. Return ONLY valid JSON. Absolutely NO markdown block formatting (` ```json `).''',
            'is_active': True
        }
    )

    if created:
        print(f"Created VERIFY_DOCUMENT prompt.")
    else:
        # Update existing to ensure it has the latest formulation
        prompt.description = 'Validates E-Stamp/Document fields against user input (Correctness Detection)'
        prompt.system_instruction = 'You are a meticulous Legal Document Verification Agent. Your strict priority is absolute accuracy when comparing provided expected JSON data against the content visibly written or printed in the provided image/PDF document. You must return exactly the requested raw JSON format, with no markdown wrappers.'
        prompt.input_format = '''I am providing you with an E-Stamp / Legal Document (image/PDF) and the following EXPECTED DATA entered by a user:
        
{expected_json}

Your task is to check if these expected details match what is actually written/printed in the document.'''
        prompt.output_format = '''Return ONLY a raw JSON object with exactly this structure:
{
    "is_correct": true/false,
    "differences": {
        "field_name": "Explanation of difference (e.g., Expected X but found Y in document)"
    },
    "certificate_number": "Extract the Certificate No / E-Stamp No if present, else null",
    "grn_number": "Extract the GRN No / Unique Doc No if present, else null"
}

Rules:
1. "is_correct" should be true only if ALL provided fields substantially match the document's content.
2. If "is_correct" is false, populate the "differences" object with the specific fields that failed validation.
3. If "is_correct" is true, "differences" can be empty.
4. ALWAYS try to extract "certificate_number" and "grn_number" from the document, regardless of validation success.
5. Return ONLY valid JSON. Absolutely NO markdown block formatting (` ```json `).'''
        prompt.is_active = True
        prompt.save()
        print(f"Updated VERIFY_DOCUMENT prompt.")

if __name__ == '__main__':
    seed_verification_prompt()

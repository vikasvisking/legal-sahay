import os
import django
import sys

# Setup Django Environment
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model
from documents.models import DocumentCategory, DocumentType

User = get_user_model()

def seed_data():
    print("Seeding Initial Data...")

    # 1. Create Superuser
    phone = "+919999999999"
    password = "adminpassword"
    if not User.objects.filter(phone_number=phone).exists():
        User.objects.create_superuser(phone_number=phone, password=password, full_name="Super Admin")
        print(f"Superuser created -> Phone: {phone}, Password: {password}")
    else:
        print(f"Superuser already exists ({phone})")

    # 2. Create Categories & Types
    data = {
        "Real Estate": ["Rent Agreement", "Lease Deed", "Sale Deed"],
        "Affidavits": ["General Affidavit", "Name Change Affidavit", "Gap Year Affidavit"],
        "Business": ["Partnership Deed", "Non-Disclosure Agreement (NDA)", "Service Agreement"],
        "Personal": ["Will", "Power of Attorney"]
    }

    for cat_name, types in data.items():
        category, created = DocumentCategory.objects.get_or_create(
            name=cat_name, 
            defaults={'slug': cat_name.lower().replace(" ", "-"), 'icon': 'file-text'}
        )
        if created:
            print(f"Created Category: {cat_name}")
        
        for type_name in types:
            dt, t_created = DocumentType.objects.get_or_create(
                name=type_name,
                category=category,
                defaults={'slug': type_name.lower().replace(" ", "-")}
            )
            if t_created:
                print(f"  - Created Type: {type_name}")

    print("Seeding Complete!")

if __name__ == "__main__":
    seed_data()

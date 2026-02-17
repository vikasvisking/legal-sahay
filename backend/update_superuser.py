import os
import django
import sys

# Setup Django Environment
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model
User = get_user_model()

def update_admin():
    try:
        # Create or Get the user with phone_number='admin'
        u, created = User.objects.get_or_create(phone_number='admin')
        u.set_password('admin123')
        u.is_staff = True
        u.is_superuser = True
        u.role = 'ADMIN' # ensure role is ADMIN
        u.save()
        match = "Created" if created else "Updated"
        print(f"Successfully {match} superuser 'admin' with password 'admin123'")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    update_admin()

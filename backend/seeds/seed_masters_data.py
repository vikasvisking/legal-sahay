import os
import django

# Setup Django Environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from masters.models import State, Article

def seed_states():
    states_data = [
        {"state_name": "ANDAMAN AND NICOBAR", "state_code": "AN", "enabled": True, "portal": "SHCIL"},
        {"state_name": "ANDHRA PRADESH", "state_code": "AP", "enabled": True, "portal": "EGRAM"},
        {"state_name": "ARUNACHAL PRADESH", "state_code": "AR", "enabled": True, "portal": "SHCIL"},
        {"state_name": "ASSAM", "state_code": "AS", "enabled": True, "portal": "SHCIL"},
        {"state_name": "BIHAR", "state_code": "BR", "enabled": True, "portal": "EGRAM"},
        {"state_name": "CHANDIGARH", "state_code": "CH", "enabled": True, "portal": "SHCIL"},
        {"state_name": "CHHATTISGARH", "state_code": "CT", "enabled": True, "portal": "SHCIL"},
        {"state_name": "DADRA AND NAGAR HAVELI AND DAMAN AND DIU", "state_code": "DN", "enabled": True, "portal": "EGRAM"},
        {"state_name": "DELHI", "state_code": "DL", "enabled": True, "portal": "SHCIL"},
        {"state_name": "GOA", "state_code": "GA", "enabled": True, "portal": "EGRAM"},
        {"state_name": "GUJARAT", "state_code": "GJ", "enabled": True, "portal": "SHCIL"},
        {"state_name": "HARYANA", "state_code": "HR", "enabled": True, "portal": "EGRAM"},
        {"state_name": "HIMACHAL PRADESH", "state_code": "HP", "enabled": True, "portal": "SHCIL"},
        {"state_name": "JAMMU AND KASHMIR", "state_code": "JK", "enabled": True, "portal": "SHCIL"},
        {"state_name": "JHARKHAND", "state_code": "JH", "enabled": True, "portal": "EGRAM"},
        {"state_name": "KARNATAKA", "state_code": "KA", "enabled": True, "portal": "SHCIL"},
        {"state_name": "KERALA", "state_code": "KL", "enabled": True, "portal": "EGRAM"},
        {"state_name": "LADAKH", "state_code": "LA", "enabled": True, "portal": "SHCIL"},
        {"state_name": "LAKSHADWEEP", "state_code": "LD", "enabled": True, "portal": "EGRAM"},
        {"state_name": "MADHYA PRADESH", "state_code": "MP", "enabled": True, "portal": "EGRAM"},
        {"state_name": "MAHARASHTRA", "state_code": "MH", "enabled": True, "portal": "EGRAM"},
        {"state_name": "MANIPUR", "state_code": "MN", "enabled": True, "portal": "SHCIL"},
        {"state_name": "MEGHALAYA", "state_code": "ML", "enabled": True, "portal": "SHCIL"},
        {"state_name": "MIZORAM", "state_code": "MZ", "enabled": True, "portal": "EGRAM"},
        {"state_name": "NAGALAND", "state_code": "NL", "enabled": True, "portal": "EGRAM"},
        {"state_name": "ODISHA", "state_code": "OR", "enabled": True, "portal": "SHCIL"},
        {"state_name": "PUDUCHERRY", "state_code": "PY", "enabled": True, "portal": "SHCIL"},
        {"state_name": "PUNJAB", "state_code": "PB", "enabled": True, "portal": "SHCIL"},
        {"state_name": "RAJASTHAN", "state_code": "RJ", "enabled": True, "portal": "EGRAM"},
        {"state_name": "SIKKIM", "state_code": "SK", "enabled": True, "portal": "EGRAM"},
        {"state_name": "TAMIL NADU", "state_code": "TN", "enabled": True, "portal": "EGRAM"},
        {"state_name": "TELANGANA", "state_code": "TG", "enabled": True, "portal": "EGRAM"},
        {"state_name": "TRIPURA", "state_code": "TR", "enabled": True, "portal": "SHCIL"},
        {"state_name": "UTTAR PRADESH", "state_code": "UP", "enabled": True, "portal": "EGRAM"},
        {"state_name": "UTTARAKHAND", "state_code": "UT", "enabled": True, "portal": "SHCIL"},
        {"state_name": "WEST BENGAL", "state_code": "WB", "enabled": True, "portal": "EGRAM"}
    ]

    print(f"Seeding {len(states_data)} states...")
    for data in states_data:
        state, created = State.objects.update_or_create(
            code=data['state_code'],
            defaults={
                'name': data['state_name'],
                'is_enabled': data['enabled'],
                'portal_type': data['portal']
            }
        )
        status = "Created" if created else "Updated"
        print(f"[{status}] {state.name} ({state.code})")

def seed_articles():
    articles_data = [
        {
            "code": "ARTICLE_4",
            "title": "Affidavit",
            "description": "A written statement confirmed by oath or affirmation, used as evidence in court or for administrative changes (e.g., name change, address proof).",
            "stamp_for": "NON_REGISTER",  # Maps to 'NO REGISTER' input, ensuring Model choice match
            "states": ["AN", "AR", "AS", "CH", "CT", "DL", "GJ", "HP", "JK", "KA", "MN", "ML", "OR", "PY", "PB", "TR", "LA", "UT", "HR"]
        },
        {
            "code": "ARTICLE_35",
            "title": "Rent Agreement (Residential)",
            "description": "A contract between a landlord and tenant. Agreements for 11 months usually do not require registration, while those above 11 months must be registered.",
            "stamp_for": "NON_REGISTER",
            "states": ["HR", "DL", "KA", "MH", "PB", "GJ"]
        },
        {
            "code": "ARTICLE_23",
            "title": "Conveyance / Sale Deed",
            "description": "An instrument by which the ownership of property is transferred from a seller to a buyer. Always requires mandatory registration.",
            "stamp_for": "REGISTER",
            "states": ["HR", "UP", "BR", "MH", "DL", "TN", "KA"]
        },
        {
            "code": "ARTICLE_5",
            "title": "Agreement to Sell",
            "description": "An agreement outlining the terms and conditions of a future sale of property.",
            "stamp_for": "REGISTER",
            "states": ["HR", "UP", "DL", "MH"]
        },
        {
            "code": "ARTICLE_34",
            "title": "Indemnity Bond",
            "description": "A contract where one party promises to save the other from loss caused to them by the conduct of the promisor or any other person.",
            "stamp_for": "NON_REGISTER",
            "states": ["AN", "AS", "CH", "DL", "GJ", "HR", "KA", "PB"]
        },
        {
            "code": "ARTICLE_48",
            "title": "Power of Attorney (General)",
            "description": "An instrument empowering a specified person to act for and in the name of the person executing it. Registration is generally recommended.",
            "stamp_for": "REGISTER",
            "states": ["DL", "HR", "UP", "PB", "RJ"]
        }
    ]

    print(f"\nSeeding {len(articles_data)} articles...")
    for data in articles_data:
        # Map user input 'NO REGISTER' -> 'NON_REGISTER' if needed, mostly handled by strict string matching or manual fix above
        # The user provided 'NO REGISTER' but model choices might be 'NON_REGISTER'. Checking model:
        # StampFor.NON_REGISTER = 'NON_REGISTER', 'Non-Registerable'
        # StampFor.REGISTER = 'REGISTER', 'Registerable'
        
        stamp_val = "NON_REGISTER" if data['stamp_for'] == "NO REGISTER" else "REGISTER"

        article, created = Article.objects.update_or_create(
            code=data['code'],
            defaults={
                'title': data['title'],
                'description': data['description'],
                'stamp_for': stamp_val,
                'is_all_states': False # Defaulting to false as they have specific lists
            }
        )
        
        # Link States
        state_codes = data.get('states', [])
        states = State.objects.filter(code__in=state_codes)
        article.states.set(states)
        
        status = "Created" if created else "Updated"
        print(f"[{status}] {article.title} - Linked to {states.count()} states")

if __name__ == "__main__":
    seed_states()
    seed_articles()
    print("\n✅ Master Data Seeding Completed!")

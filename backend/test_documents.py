import requests
import sys

base_url = "http://127.0.0.1:8000/api"

# Ensure we have a token (Quick login)
def get_token():
    print("Attempting to get token...")
    try:
        # First send OTP
        requests.post(f"{base_url}/auth/send-otp", json={"phone_number": "+919876543210"})
        
        # Then verify
        auth_resp = requests.post(f"{base_url}/auth/verify-otp", json={"phone_number": "+919876543210", "otp": "123456"})
        
        if auth_resp.status_code == 200:
            return auth_resp.json()['tokens']['access']
        else:
            print(f"Auth Failed: {auth_resp.status_code} - {auth_resp.text}")
            return None
    except Exception as e:
        print(f"Connection Error: {e}")
        return None

def test_template_flow():
    token = get_token()
    if not token:
        print("Failed to get token")
        return

    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    print("1. Fetching Categories...")
    resp = requests.get(f"{base_url}/documents/categories/", headers=headers)
    print(f"Categories Status: {resp.status_code}")
    print(f"Categories: {resp.json()}")

    print("\n2. Testing Generate (Expected Fail)...")
    resp = requests.post(
        f"{base_url}/documents/templates/generate/", 
        json={"document_type_id": 999, "state": "Mars"},
        headers=headers
    )
    print(f"Generate Status: {resp.status_code}") 
    print(f"Response: {resp.json()}")

if __name__ == "__main__":
    test_template_flow()

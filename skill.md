---
name: legal_sahay_workflow
description: Standard workflows for developing on the Legal Sahay project
---

# Legal Sahay Development Skills

This skill provides shortcuts and standard procedures for working on the Legal Sahay codebase.

## 1. Backend Development

### Run Development Server
```bash
cd backend
python manage.py runserver
```

### Database Management
**Make Migrations** (Create new migration files based on model changes):
```bash
cd backend
python manage.py makemigrations
```

**Apply Migrations** (Apply changes to the database):
```bash
cd backend
python manage.py migrate
```

### Creating a New App
When adding a new feature module:
1. Create the app:
   ```bash
   cd backend
   python manage.py startapp <app_name>
   ```
2. Register in `backend/config/settings.py` under `INSTALLED_APPS`.
3. Create `urls.py` in the new app and include it in `backend/config/urls.py`.

## 2. API Testing
- Use **Postman** or **curl** to test endpoints at `http://127.0.0.1:8000/api/`.
- Ensure headers include `Content-Type: application/json`.

## 3. Environment Setup
- Activate virtual environment (if using standard venv):
  - Windows: `backend\venv\Scripts\activate`
  - Linux/Mac: `source backend/venv/bin/activate`

# Legal Sahay - Project Context

## Project Overview
**Legal Sahay** is a platform designed to connect users with legal professionals (vendors), facilitating consultations, document services, and legal aid.

## Tech Stack
### Backend
- **Framework**: Django 6.0.2
- **Language**: Python
- **API**: Django Rest Framework (DRF)
- **Database**: SQLite (Development), PostgreSQL (Production - Planned)
- **Authentication**: Django Session Auth (Current), JWT (Planned for Next.js integration)

### Frontend (Planned)
- **Framework**: Next.js
- **Styling**: Tailwind CSS
- **API Integration**: Axios / Fetch via REST API

## Directory Structure
- `backend/`: Django project root
  - `config/`: Project main configuration (`settings.py`, `urls.py`)
  - `users/`: User management and authentication (Custom User model)
  - `orders/`: Order processing logic
  - `documents/`: Document management
  - `services/`: Service catalog
  - `payments/`: Payment processing
  - `consultations/`: Consultation scheduling and management
  - `venv/`: Python virtual environment

## Configuration Highlights
- **Base Directory**: `d:/legalSahay`
- **Backend Root**: `d:/legalSahay/backend`
- **API Prefix**: `/api/` (Currently only `users` app is guarded)
- **CORS**: Configured for `localhost:3000` (Frontend)

## Development workflow
- **Run Server**: `python manage.py runserver`
- **Database**: Standard Django migrations
- **Dependencies**: Managed via pip (no `requirements.txt` found in root yet, ensure `django` and `djangorestframework` are installed).

# 🌍 Environment Setup Guide

## Windows Setup Instructions

### Step 1: Backend Environment Setup

#### Navigate to Backend Directory
```bash
cd c:\Users\aluno\Downloads\BAW\3.Implementacao\BAW_back
```

#### Create Virtual Environment
```bash
python -m venv venv
```

#### Activate Virtual Environment
```bash
venv\Scripts\activate
```

You should see `(venv)` at the beginning of your terminal prompt.

#### Install Dependencies
```bash
pip install -r requirements.txt
```

This will install:
- Django 5.2.9
- Django REST Framework 3.16.1
- django-cors-headers 4.9.0
- djangorestframework-simplejwt 5.3.2
- django-filter 24.1
- pillow 10.2.0
- python-decouple 3.8

#### Initialize Database
```bash
python manage.py migrate
```

#### Create Superuser (Admin Account)
```bash
python manage.py createsuperuser
```

Follow the prompts to create an admin account. Example:
```
Username: admin
Email: admin@example.com
Password: (enter secure password)
```

#### Start Backend Server
```bash
python manage.py runserver
```

The backend will be available at `http://localhost:8000`

**Keep this terminal running!** Open a new terminal for frontend setup.

---

### Step 2: Frontend Environment Setup

#### Open New Terminal/Command Prompt

#### Navigate to Frontend Directory
```bash
cd c:\Users\aluno\Downloads\BAW\3.Implementacao\BAW-frontend
```

#### Install Node Dependencies
```bash
npm install
```

This will install all React and build dependencies.

#### Start Frontend Development Server
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

---

## 🧪 Verify Installation

### Backend Verification
Open your browser and visit:
- `http://localhost:8000/` - Backend running
- `http://localhost:8000/admin/` - Admin panel (login with superuser credentials)
- `http://localhost:8000/api/` - API root

### Frontend Verification
Open your browser and visit:
- `http://localhost:3000/` - Frontend should show BAW home page

---

## 🔌 Testing API Endpoints

### Using Windows CMD/PowerShell

#### Test Authentication Endpoint
```bash
curl -X POST http://localhost:8000/api/auth/register/ `
  -H "Content-Type: application/json" `
  -d "{\"username\":\"testuser\",\"email\":\"test@example.com\",\"password\":\"testpass123\",\"password_confirm\":\"testpass123\",\"user_type\":\"buyer\",\"country\":\"USA\"}"
```

#### Test Product Endpoint
```bash
curl -X GET http://localhost:8000/api/products/ `
  -H "Content-Type: application/json"
```

### Using Postman (Recommended)
1. Download [Postman](https://www.postman.com/downloads/)
2. Create new requests:
   - **POST** `http://localhost:8000/api/auth/register/`
   - **GET** `http://localhost:8000/api/products/`
   - **POST** `http://localhost:8000/api/auth/login/`

---

## 📝 Environment Variables

### Backend (.env file in BAW_back/)
Create a `.env` file in `BAW_back` directory:

```
DEBUG=True
SECRET_KEY=your-secret-key-here
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=sqlite:///db.sqlite3
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

Then update `settings.py` to use these:
```python
from decouple import config
DEBUG = config('DEBUG', default=True, cast=bool)
SECRET_KEY = config('SECRET_KEY', default='django-insecure-...')
```

### Frontend (.env file in BAW-frontend/)
Create a `.env` file in `BAW-frontend` directory:

```
VITE_API_BASE_URL=http://localhost:8000/api
```

---

## 🐛 Troubleshooting

### Python/pip Issues
```bash
# Check Python version (should be 3.8+)
python --version

# Update pip
python -m pip install --upgrade pip

# Check if venv is activated
where python  # Should show path in your project folder
```

### Node/npm Issues
```bash
# Check Node version (should be 16+)
node --version
npm --version

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -r node_modules
npm install
```

### Port Already in Use
```bash
# Change Django port
python manage.py runserver 8001

# Change React port
npm run dev -- --port 3001
```

### Migration Errors
```bash
# Reset database (⚠️ WARNING: Deletes all data)
python manage.py flush

# Recreate migrations
python manage.py makemigrations
python manage.py migrate
```

### CORS Errors
Make sure in `BAW_back/BAW_back/settings.py`:
```python
CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
]
```

---

## 🚀 Running Everything

### Terminal 1 - Backend
```bash
cd BAW_back
venv\Scripts\activate
python manage.py runserver
```

### Terminal 2 - Frontend
```bash
cd BAW-frontend
npm run dev
```

### Terminal 3 - Optional (for other tasks)
```bash
# Create test data
cd BAW_back
venv\Scripts\activate
python manage.py shell
# Then in the shell:
# from users.models import User
# from stores.models import Store
# from products.models import Product
```

---

## 📋 Complete Setup Checklist

- [ ] Python 3.8+ installed
- [ ] Node.js 16+ installed
- [ ] Virtual environment created
- [ ] Dependencies installed (pip and npm)
- [ ] Database migrated
- [ ] Superuser created
- [ ] Backend server running on :8000
- [ ] Frontend server running on :3000
- [ ] Can access `http://localhost:3000`
- [ ] Can access `http://localhost:8000/admin`
- [ ] Can register new user
- [ ] Can login
- [ ] Can view products

---

## 🎯 Next: Testing the Platform

Once both servers are running:

1. **Visit Frontend:** `http://localhost:3000`
2. **Register a new account**
3. **Login with your credentials**
4. **Visit Admin Panel:** `http://localhost:8000/admin`
5. **Create sample products**
6. **Add to cart**
7. **View API responses** in browser developer tools (Network tab)

---

## 💾 Important Files to Remember

- `BAW_back/BAW_back/settings.py` - Django configuration
- `BAW_back/BAW_back/urls.py` - URL routing
- `BAW_back/requirements.txt` - Python dependencies
- `BAW-frontend/package.json` - Node dependencies
- `BAW-frontend/vite.config.js` - Vite configuration
- `BAW-frontend/src/services/api.js` - API client

---

## ✅ You're Ready!

Once all checkboxes are checked, you're ready to start developing. Head over to `QUICK_START.md` for the next steps!

---

**Need Help?**
- Check Django logs in terminal
- Check React console (F12 in browser)
- Check Network tab for API responses
- Review API error messages

**Good Luck! 🚀**

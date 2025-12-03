# Quick Start Guide - BAW Project

## What Was Created

I've set up a complete React + Django marketplace platform with all the core features from your MVP specification. Here's what you have:

### ✅ Backend (Django)
- **User Management** - Registration, login, authentication with JWT
- **Stores** - Seller store creation and management
- **Products** - Product listing, creation, search, and reviews
- **Orders** - Order management with status tracking
- **Payments** - Payment processing framework (PayPal, Card, MTN, Cash)
- **Carts & Wishlist** - Shopping cart and wishlist functionality
- **Admin Dashboard** - Complete Django admin interface

### ✅ Frontend (React)
- **Vite** - Fast build tool and dev server
- **Redux** - State management for auth and cart
- **Routing** - React Router for navigation
- **API Services** - Axios integration with error handling
- **Pages** - Home, Login, Register, Cart, Checkout, Seller Dashboard
- **Components** - Navigation, Footer, and reusable UI elements

## 🚀 Quick Start

### Step 1: Install Backend Dependencies
```bash
cd BAW_back
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Mac/Linux
pip install -r requirements.txt
```

### Step 2: Initialize Database
```bash
python manage.py migrate
python manage.py createsuperuser
```

### Step 3: Start Backend Server
```bash
python manage.py runserver
```
Backend runs at: http://localhost:8000

### Step 4: Install Frontend Dependencies
```bash
cd BAW-frontend
npm install
```

### Step 5: Start Frontend Server
```bash
npm run dev
```
Frontend runs at: http://localhost:3000

## 📋 Project Structure

```
3.Implementacao/
├── BAW_back/                 # Django Backend
│   ├── users/                # User authentication
│   ├── products/             # Product management
│   ├── stores/               # Store management
│   ├── orders/               # Order management
│   ├── payments/             # Payment processing
│   ├── carts/                # Shopping cart & wishlist
│   └── requirements.txt
│
├── BAW-frontend/             # React Frontend
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Page components
│   │   ├── services/         # API integration
│   │   ├── store/            # Redux state management
│   │   └── App.jsx
│   └── package.json
│
├── SETUP_GUIDE.md            # Detailed setup documentation
└── setup.bat                 # Automated setup script

```

## 🔑 Key Features

### For Buyers
- Register and login
- Browse products by category
- Add to cart and checkout
- Track orders
- Leave reviews

### For Sellers
- Create and manage store
- Upload products
- Track inventory
- View orders
- Monitor sales

### For Admin
- Manage users
- Approve sellers
- Track orders and payments
- View analytics

## 🛠️ Available APIs

### Authentication
```
POST   /api/auth/register/
POST   /api/auth/login/
POST   /api/auth/logout/
GET    /api/auth/me/
```

### Products
```
GET    /api/products/              # List all
POST   /api/products/              # Create (seller)
GET    /api/products/{id}/         # Get details
PUT    /api/products/{id}/         # Update (seller)
GET    /api/products/my_products/  # My products (seller)
POST   /api/products/{id}/add_review/
```

### Orders
```
GET    /api/orders/                # My orders
POST   /api/orders/                # Create order
GET    /api/orders/{id}/           # Order details
PATCH  /api/orders/{id}/update_status/
```

### Cart
```
GET    /api/cart/                  # Get cart
POST   /api/cart/add/              # Add item
PATCH  /api/cart/{item_id}/        # Update quantity
DELETE /api/cart/{item_id}/        # Remove item
```

## 🔐 Testing the API

### 1. Create a test user via registration
```bash
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "securepass123",
    "password_confirm": "securepass123",
    "user_type": "buyer",
    "country": "USA"
  }'
```

### 2. Login and get token
```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "securepass123"
  }'
```

### 3. Access protected endpoints with token
```bash
curl -X GET http://localhost:8000/api/auth/me/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 📝 Next Steps

### Immediate Tasks
1. ✅ Run migrations: `python manage.py migrate`
2. ✅ Create superuser: `python manage.py createsuperuser`
3. ✅ Start both servers
4. ✅ Test registration and login

### Short Term
1. Enhance React pages with styling (Tailwind CSS, Material-UI, etc.)
2. Add image upload functionality
3. Implement search and filters
4. Add product image gallery
5. Complete payment integration (PayPal, Stripe)

### Medium Term
1. Add real-time chat between buyers and sellers
2. Email notifications
3. SMS alerts
4. Analytics dashboard
5. Mobile responsiveness

### Long Term
1. Deploy to production (Vercel, Netlify for frontend; Heroku, AWS for backend)
2. Add analytics and reporting
3. Implement advanced search
4. Add multilingual support
5. Create mobile app (React Native)

## 🐛 Troubleshooting

### Issue: CORS errors
**Solution:** Check CORS_ALLOWED_ORIGINS in settings.py

### Issue: Port already in use
**Solution:** 
```bash
# Django on different port
python manage.py runserver 8001

# React on different port
npm run dev -- --port 3001
```

### Issue: Database errors
**Solution:**
```bash
python manage.py migrate
# or reset database
python manage.py flush
```

## 📚 Resources

- [Django Documentation](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [React Documentation](https://react.dev/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Vite Documentation](https://vitejs.dev/)

## 💡 Tips

1. Use Django admin (`/admin`) to test and manage data
2. Use Postman or Insomnia to test APIs
3. Check browser console for frontend errors
4. Check Django logs for backend errors
5. Use Redux DevTools to debug state management

## 🎉 You're Ready!

Your marketplace platform is ready to develop. Start with the backend and frontend servers running, then enhance the UI components and add the features you need.

Happy coding!

# BAW - Buy and Sell Around the World

A full-stack marketplace platform built with React and Django that enables sellers to list products and buyers to browse and purchase items globally.

## 🚀 Project Structure

```
BAW/
├── BAW-frontend/          # React frontend (Vite)
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── store/         # Redux state management
│   │   └── styles/        # Global styles
│   ├── package.json
│   └── vite.config.js
│
└── BAW_back/              # Django backend
    ├── users/             # User authentication & profiles
    ├── stores/            # Store management
    ├── products/          # Product listing & management
    ├── orders/            # Order management
    ├── payments/          # Payment processing
    ├── carts/             # Shopping cart & wishlist
    ├── manage.py
    └── requirements.txt
```

## ✨ Core Features

### For Buyers
- ✅ User registration and login
- ✅ Browse stores and products
- ✅ Search and filter products by category
- ✅ Add to cart and checkout
- ✅ Track orders
- ✅ Add products to wishlist
- ✅ Leave product reviews and ratings

### For Sellers
- ✅ Store creation and management
- ✅ Product upload with descriptions and images
- ✅ Inventory management
- ✅ View and manage orders
- ✅ Track sales and ratings
- ✅ Mobile-friendly dashboard

### Admin Dashboard
- ✅ Manage all orders
- ✅ Approve/reject seller accounts
- ✅ Monitor payments
- ✅ User management

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Fast build tool
- **React Router DOM** - Navigation
- **Redux Toolkit** - State management
- **Axios** - HTTP client
- **Framer Motion** - Animations
- **React Hot Toast** - Notifications

### Backend
- **Django 5.2** - Web framework
- **Django REST Framework** - REST API
- **Django CORS Headers** - CORS support
- **JWT Authentication** - Secure authentication
- **SQLite/PostgreSQL** - Database

## 📋 Prerequisites

- Node.js 16+ and npm
- Python 3.8+
- Virtual environment (venv)

## 🏁 Getting Started

### Backend Setup

1. **Navigate to the backend directory:**
```bash
cd BAW_back
```

2. **Create and activate a virtual environment:**
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

3. **Install dependencies:**
```bash
pip install -r requirements.txt
```

4. **Run migrations:**
```bash
python manage.py migrate
```

5. **Create a superuser:**
```bash
python manage.py createsuperuser
```

6. **Start the development server:**
```bash
python manage.py runserver
```

The backend will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to the frontend directory:**
```bash
cd BAW-frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start the development server:**
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/logout/` - User logout
- `GET /api/auth/me/` - Get current user

### Products Endpoints
- `GET /api/products/` - List all products
- `GET /api/products/{id}/` - Get product details
- `POST /api/products/` - Create product (seller only)
- `PUT /api/products/{id}/` - Update product (seller only)
- `DELETE /api/products/{id}/` - Delete product (seller only)
- `GET /api/products/my_products/` - Get seller's products
- `POST /api/products/{id}/add_review/` - Add product review

### Stores Endpoints
- `GET /api/stores/` - List all stores
- `GET /api/stores/{id}/` - Get store details
- `GET /api/stores/my_store/` - Get current user's store
- `POST /api/stores/create_store/` - Create a new store
- `PUT /api/stores/{id}/` - Update store

### Orders Endpoints
- `GET /api/orders/` - List user's orders
- `POST /api/orders/` - Create new order
- `GET /api/orders/{id}/` - Get order details
- `PATCH /api/orders/{id}/update_status/` - Update order status

### Cart Endpoints
- `GET /api/cart/` - Get cart items
- `POST /api/cart/add/` - Add item to cart
- `PATCH /api/cart/{item_id}/` - Update cart item quantity
- `DELETE /api/cart/{item_id}/` - Remove item from cart

### Wishlist Endpoints
- `GET /api/wishlist/` - Get wishlist items
- `POST /api/wishlist/add_to_wishlist/` - Add to wishlist
- `DELETE /api/wishlist/{item_id}/` - Remove from wishlist

### Payments Endpoints
- `POST /api/payments/initialize/` - Initialize payment
- `GET /api/payments/{id}/verify/` - Verify payment status

## 🔒 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_access_token>
```

## 🎨 Available Categories

- Fashion
- Beauty
- Crafts
- Food
- Electronics
- Home Decor
- Accessories
- Other

## 📱 Payment Methods

- PayPal
- Credit/Debit Card
- MTN Mobile Money
- Cash on Delivery

## 🚀 Next Steps

1. **Implement React Components:**
   - Homepage with hero section and featured products
   - Product pages with image gallery
   - Shopping cart and checkout flow
   - Seller dashboard
   - User profile pages

2. **Add Payment Integration:**
   - PayPal integration
   - Stripe/Card payments
   - Mobile money integration

3. **Enhance Features:**
   - Real-time chat between buyers and sellers
   - Email notifications
   - SMS alerts
   - Analytics dashboard
   - Advanced search with filters

4. **Deployment:**
   - Deploy React to Vercel/Netlify
   - Deploy Django to Heroku/Railway/AWS
   - Set up CI/CD pipeline

## 📝 Environment Variables

Create a `.env` file in the frontend root:

```
REACT_APP_API_URL=http://localhost:8000/api
```

## 🐛 Troubleshooting

### CORS Issues
- Ensure CORS headers are configured in Django settings
- Check that frontend URL is in ALLOWED_ORIGINS

### Port Already in Use
- Django: `python manage.py runserver 8001`
- React: `npm run dev -- --port 3001`

### Database Issues
- Reset database: `python manage.py flush`
- Recreate migrations: `python manage.py makemigrations && python manage.py migrate`

## 📄 License

This project is open source and available under the MIT License.

## 👥 Support

For issues and questions, please open an issue on GitHub.

---

**Happy coding! 🎉**

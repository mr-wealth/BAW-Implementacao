# 🔗 Frontend-Backend Connection Diagram

## The Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    REACT FRONTEND (Port 3000)                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Browser at http://localhost:3000                           │ │
│  │                                                            │ │
│  │  Components → Services → Axios HTTP Requests              │ │
│  └────────────────────────────────────────────────────────────┘ │
│                          ↓ ↑                                     │
│                    HTTP/JSON API                                │
│                  (REST Endpoints)                               │
│                          ↓ ↑                                     │
└─────────────────────────────────────────────────────────────────┘
                          
┌─────────────────────────────────────────────────────────────────┐
│                 DJANGO BACKEND (Port 8000)                      │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Server at http://localhost:8000/api                       │ │
│  │                                                            │ │
│  │  URLs → Views → Serializers → Models ↔ Database          │ │
│  │                                                            │ │
│  │  Returns JSON Responses                                   │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## ✨ Key Connection Points

### 1️⃣ **Frontend Makes Request (React → Django)**

**File:** `BAW-frontend/src/services/api.js`

```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
                                                      ↑
                                            This points to Django!

const api = axios.create({
  baseURL: API_BASE_URL,  // Sets base to Django API
  headers: {
    'Content-Type': 'application/json',
  },
});
```

**Example: Login Flow**
```javascript
// React calls this:
export const authService = {
  login: (email, password) => 
    api.post('/auth/login/', { email, password })
    // Actual URL: http://localhost:8000/api/auth/login/
    // Request: POST with JSON body
}
```

### 2️⃣ **Django Routes the Request**

**File:** `BAW_back/BAW_back/urls.py`

```python
urlpatterns = [
    path('api/auth/', include('users.urls')),          # ← Routes /api/auth/
    path('api/products/', include('products.urls')),   # ← Routes /api/products/
    path('api/orders/', include('orders.urls')),       # ← Routes /api/orders/
    path('api/stores/', include('stores.urls')),       # ← Routes /api/stores/
    path('api/payments/', include('payments.urls')),   # ← Routes /api/payments/
    path('api/', include('carts.urls')),               # ← Routes /api/cart/
]
```

### 3️⃣ **Django App Handles Request**

**File:** `BAW_back/users/urls.py`

```python
urlpatterns = [
    path('auth/register/', views.register, name='register'),  # POST
    path('auth/login/', views.login, name='login'),           # POST ← React calls this!
    path('auth/me/', views.get_current_user, name='current-user'),
]
```

### 4️⃣ **Django View Processes & Returns Response**

**File:** `BAW_back/users/views.py`

```python
@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    # Receives JSON from React
    serializer = UserLoginSerializer(data=request.data)
    
    if serializer.is_valid():
        user = serializer.validated_data['user']
        refresh = RefreshToken.for_user(user)
        
        # Sends JSON back to React
        return Response({
            'user': UserSerializer(user).data,
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        }, status=status.HTTP_200_OK)
```

### 5️⃣ **React Receives Response**

**File:** `BAW-frontend/src/pages/LoginPage.jsx`

```javascript
const handleLogin = async (e) => {
  e.preventDefault()
  try {
    const response = await authService.login(email, password)
    // response.data contains:
    // {
    //   user: { id, username, email, ... },
    //   access: "eyJ0eXAiOiJKV1QiLCJhbGc...",
    //   refresh: "eyJ0eXAiOiJKV1QiLCJhbGc..."
    // }
    
    dispatch(loginSuccess(response.data))  // Save to Redux
    navigate('/')                          // Redirect
  } catch (err) {
    setError('Invalid credentials')
  }
}
```

---

## 🔄 Real-World Flow Example: User Login

### Step 1: User Fills Form & Submits
```
React Component (LoginPage.jsx)
↓
User enters email & password
↓
Clicks "Login" button
↓
handleLogin() function called
```

### Step 2: React Makes HTTP Request
```
api.post('/auth/login/', { email, password })
↓
Axios creates HTTP POST request to:
http://localhost:8000/api/auth/login/
↓
Headers included:
{
  'Content-Type': 'application/json',
  'Authorization': 'Bearer {existing_token}' (if logged in)
}
↓
Body sent as JSON:
{
  "email": "user@example.com",
  "password": "securepass123"
}
```

### Step 3: Django Receives Request
```
Django HTTP Server (http://localhost:8000/)
↓
Middleware processes CORS headers
↓
Router matches: POST /api/auth/login/
↓
users/urls.py route found
↓
users/views.py login() function called
↓
request.data contains:
{
  "email": "user@example.com",
  "password": "securepass123"
}
```

### Step 4: Django Processes & Sends Response
```
login() view:
1. Validates data with UserLoginSerializer
2. Authenticates user with email/password
3. Generates JWT tokens (access + refresh)
4. Returns JSON response:

{
  "user": {
    "id": 1,
    "username": "john",
    "email": "user@example.com",
    "user_type": "buyer"
  },
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
↓
HTTP 200 OK
```

### Step 5: React Processes Response
```
Response received:
{
  "user": { ... },
  "access": "...",
  "refresh": "..."
}
↓
dispatch(loginSuccess(response.data))
↓
Redux authSlice updates:
- Saves user to state
- Saves access token to localStorage
- Saves access token to authSlice
↓
navigate('/')
↓
User sees homepage
```

---

## 🔐 Authentication Token Flow

### Getting the Token
```
React → POST /api/auth/login/ → Django
                ↓
              Returns access token
                ↓
React stores in localStorage:
localStorage.setItem('access_token', token)
```

### Using the Token (Authenticated Requests)
```javascript
// In api.js - Interceptor adds token to ALL requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;  // ← Added here
  }
  return config;
});

// Every request now includes:
// Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

### Django Verifies Token
```python
@api_view(['GET'])
@permission_classes([IsAuthenticated])  # ← Requires valid token
def get_current_user(request):
    # Django middleware automatically validates the token
    # If valid: request.user = authenticated user
    # If invalid: returns 401 Unauthorized
    return Response(UserSerializer(request.user).data)
```

---

## 🌐 API Communication Points

### All Frontend-Backend Connections:

```
┌─────────────────────────────────┬──────────────────────────┐
│ React Action                    │ Django Endpoint          │
├─────────────────────────────────┼──────────────────────────┤
│ Register User                   │ POST /api/auth/register/ │
│ Login                           │ POST /api/auth/login/    │
│ Get Current User                │ GET /api/auth/me/        │
│ List Products                   │ GET /api/products/       │
│ Get Product Details             │ GET /api/products/{id}/  │
│ Create Product (seller)         │ POST /api/products/      │
│ Search Products                 │ GET /api/products/search/│
│ Get Stores                      │ GET /api/stores/         │
│ Create Store (seller)           │ POST /api/stores/        │
│ Get My Store                    │ GET /api/stores/my-store/│
│ Add to Cart                     │ POST /api/cart/add/      │
│ Get Cart                        │ GET /api/cart/           │
│ Update Cart Item                │ PATCH /api/cart/{id}/    │
│ Remove from Cart                │ DELETE /api/cart/{id}/   │
│ Create Order                    │ POST /api/orders/        │
│ Get My Orders                   │ GET /api/orders/         │
│ Get Order Details               │ GET /api/orders/{id}/    │
│ Update Order Status             │ PATCH /api/orders/{id}/  │
│ Initialize Payment              │ POST /api/payments/      │
│ Verify Payment                  │ GET /api/payments/{id}/  │
│ Add Wishlist Item               │ POST /api/wishlist/      │
│ Get Wishlist                    │ GET /api/wishlist/       │
│ Add Product Review              │ POST /api/products/{id}/review/│
└─────────────────────────────────┴──────────────────────────┘
```

---

## 🛠️ How CORS Works (The Bridge)

**Problem:** React (port 3000) cannot directly talk to Django (port 8000) due to browser's Same-Origin Policy

**Solution:** CORS (Cross-Origin Resource Sharing)

**File:** `BAW_back/BAW_back/settings.py`

```python
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # ← This handles CORS
    # ... other middleware
]

CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',   # ← Allow React frontend
    'http://127.0.0.1:3000',
    'http://localhost:8000',
]

CORS_ALLOW_CREDENTIALS = True  # ← Allow sending auth headers
```

**What Happens:**
```
1. React makes request to Django:8000
2. Browser checks: "Is origin localhost:3000 allowed?"
3. Django middleware (corsheaders) checks settings
4. Returns CORS headers:
   Access-Control-Allow-Origin: http://localhost:3000
5. Browser sees approval → Request allowed
```

---

## 📝 Code Examples: Full Communication

### Example 1: Getting Products

**React Component**
```javascript
import { productService } from '../services/api'
import { useEffect, useState } from 'react'

export function ProductList() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    // Makes GET request to Django
    productService.getAll()
      .then(response => {
        setProducts(response.data.results)
      })
      .catch(error => console.error(error))
  }, [])

  return (
    <div>
      {products.map(product => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <p>${product.price}</p>
        </div>
      ))}
    </div>
  )
}
```

**Django API**
```python
# products/urls.py
urlpatterns = [
    path('', ProductViewSet.as_view({'get': 'list'})),
]

# products/views.py
class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductSerializer
    
    def list(self, request):
        # Receives: GET /api/products/
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        
        # Returns JSON:
        return Response({
            'results': serializer.data
        })
```

**Network Request (DevTools → Network Tab)**
```
Request:
GET http://localhost:8000/api/products/
Headers: Accept: application/json

Response:
{
  "results": [
    {
      "id": 1,
      "name": "Product 1",
      "price": "29.99",
      "store": 1,
      ...
    }
  ]
}
```

---

## 🎯 Key Takeaways

✅ **React NEVER calls Django directly** - Uses HTTP REST API  
✅ **Django NEVER calls React** - Only returns JSON responses  
✅ **Connection is purely HTTP** - REST API over HTTP protocol  
✅ **Frontend and Backend are separate** - Can be deployed on different servers  
✅ **Communication is JSON** - All data sent/received as JSON  
✅ **Authentication via JWT** - Tokens stored in localStorage  
✅ **CORS allows cross-origin** - Django must allow React origin  

---

## 🚀 Visual Summary

```
┌─────────────┐                    ┌──────────────┐
│   React     │    HTTP REST       │   Django     │
│  Frontend   │◄──────────────────►│   Backend    │
│ :3000       │    JSON/API        │   :8000      │
└─────────────┘                    └──────────────┘

          ↓                              ↓
      Components                    Database
      Services                      Models
      Redux                         Serializers
                                    Views
```

**Django and React are completely separate applications communicating via HTTP!**

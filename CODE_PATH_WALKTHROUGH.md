# 🔗 Detailed Code Path Walkthrough

## Where React Calls Django - Specific Code Locations

---

## 📍 Location 1: API Service Layer (THE BRIDGE)

### File: `BAW-frontend/src/services/api.js`

This is where React sends HTTP requests to Django:

```javascript
// ← Line 1-4: CREATE AXIOS INSTANCE
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
                                                      └─ POINTS TO DJANGO!

// ← Lines 6-11: CONFIGURE HTTP CLIENT
const api = axios.create({
  baseURL: API_BASE_URL,  // All requests use this base URL
  headers: {
    'Content-Type': 'application/json',  // Tell server we send JSON
  },
});

// ← Lines 14-20: ADD AUTHENTICATION TOKEN TO EVERY REQUEST
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;  // JWT token
  }
  return config;
});

// ← Lines 23-31: AUTH SERVICE - Calls Django auth endpoints
export const authService = {
  register: (userData) => api.post('/auth/register/', userData),
  // POST to: http://localhost:8000/api/auth/register/
  
  login: (email, password) => api.post('/auth/login/', { email, password }),
  // POST to: http://localhost:8000/api/auth/login/
  
  logout: () => api.post('/auth/logout/'),
  // POST to: http://localhost:8000/api/auth/logout/
};

// ← Lines 34-41: PRODUCT SERVICE - Calls Django product endpoints
export const productService = {
  getAll: (params) => api.get('/products/', { params }),
  // GET to: http://localhost:8000/api/products/
  
  getById: (id) => api.get(`/products/${id}/`),
  // GET to: http://localhost:8000/api/products/123/
  
  create: (data) => api.post('/products/', data),
  // POST to: http://localhost:8000/api/products/
};

// ... similar for stores, orders, payments, carts
```

---

## 📍 Location 2: React Component Using API

### File: `BAW-frontend/src/pages/LoginPage.jsx`

This is where React CALLS the API service:

```javascript
import React, { useState } from 'react'
import { authService } from '../services/api'  // ← IMPORT THE API
import { useDispatch } from 'react-redux'
import { loginSuccess } from '../store/authSlice'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  // ← THIS FUNCTION MAKES THE API CALL
  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      // ← REACT CALLS DJANGO HERE
      const response = await authService.login(email, password)
      // This triggers:
      // axios.post('http://localhost:8000/api/auth/login/', 
      //            { email, password })
      
      // ← RECEIVE RESPONSE FROM DJANGO
      // response.data = {
      //   user: { id: 1, username: "john", ... },
      //   access: "eyJ0eXAi...",  ← JWT token
      //   refresh: "eyJ0eXAi..."
      // }
      
      dispatch(loginSuccess(response.data))  // Save to Redux
      navigate('/')  // Redirect to home
      
    } catch (err) {
      // ← IF DJANGO RETURNS ERROR
      setError('Invalid credentials')
    }
  }
  
  return (
    <form onSubmit={handleLogin}>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" value={password} 
             onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Login</button>  ← CLICK TRIGGERS handleLogin()
    </form>
  )
}
```

---

## 📍 Location 3: Django Receives Request

### File: `BAW_back/BAW_back/urls.py`

This is where Django ROUTES the incoming request:

```python
from django.urls import path, include

urlpatterns = [
    # ← WHEN React POSTs to /api/auth/login/
    # Django matches this pattern:
    path('api/auth/', include('users.urls')),
    
    # Then Django looks inside users/urls.py
    # to find the specific endpoint
    
    path('api/products/', include('products.urls')),
    path('api/orders/', include('orders.urls')),
    # ... etc
]
```

### File: `BAW_back/users/urls.py`

More specific routing:

```python
from django.urls import path
from . import views

urlpatterns = [
    # ← WHEN React POSTs to /api/auth/login/
    # The path above matched /api/auth/
    # Now this pattern matches /login/
    path('login/', views.login, name='login'),
    
    # So the full request goes to views.login()
    
    path('register/', views.register, name='register'),
    path('logout/', views.logout, name='logout'),
]
```

---

## 📍 Location 4: Django View Processes Request

### File: `BAW_back/users/views.py`

This is where Django PROCESSES the request and RESPONDS:

```python
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

@api_view(['POST'])  # ← Only accepts POST requests
@permission_classes([AllowAny])  # ← Anyone can call this
def login(request):
    # ← RECEIVE REQUEST FROM REACT
    # request.data contains:
    # { "email": "user@example.com", "password": "securepass123" }
    
    # ← VALIDATE DATA
    serializer = UserLoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        
        # ← CREATE JWT TOKENS
        refresh = RefreshToken.for_user(user)
        
        # ← SEND RESPONSE BACK TO REACT
        return Response({
            'user': UserSerializer(user).data,
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        }, status=status.HTTP_200_OK)
    
    # If validation fails, return error:
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
```

**What happens:**
1. Django receives JSON from React
2. Validates it with UserLoginSerializer
3. Authenticates user (checks email & password)
4. Creates JWT tokens
5. Returns JSON with tokens to React

---

## 📍 Location 5: React Receives & Processes Response

Back in `LoginPage.jsx`:

```javascript
const handleLogin = async (e) => {
  try {
    // ← Django sends this response:
    // {
    //   user: { id: 1, username: "john", email: "john@example.com" },
    //   access: "eyJ0eXAiOiJKV1QiLCJhbGc...",
    //   refresh: "eyJ0eXAiOiJKV1QiLCJhbGc..."
    // }
    
    const response = await authService.login(email, password)
    
    // ← SAVE TOKEN TO LOCAL STORAGE
    // (done inside loginSuccess in Redux)
    dispatch(loginSuccess(response.data))
    // This saves:
    // localStorage.access_token = "eyJ0eXAi..."
    
    // ← UPDATE UI - redirect to home
    navigate('/')
    
  } catch (err) {
    // Django returned an error
    setError('Invalid credentials')
  }
}
```

---

## 🔄 Full Request-Response Cycle Diagram

```
1. USER INTERACTION (React)
   ↓
   User clicks "Login" button
   
2. REACT COMPONENT (LoginPage.jsx)
   ↓
   handleLogin() function triggered
   
3. API CALL (services/api.js)
   ↓
   authService.login(email, password)
   ↓
   axios.post('http://localhost:8000/api/auth/login/', {...})
   
4. NETWORK
   ↓
   HTTP POST Request sent over internet
   Headers: Content-Type: application/json
   Body: {"email": "...", "password": "..."}
   
5. DJANGO SERVER RECEIVES (urls.py → views.py)
   ↓
   Django routes request to users/views.py login()
   
6. DJANGO PROCESSES (views.py)
   ↓
   - Deserialize JSON
   - Validate data
   - Authenticate user
   - Generate tokens
   
7. DJANGO RESPONDS (views.py)
   ↓
   return Response({...}, status=200)
   ↓
   HTTP 200 OK
   Headers: Content-Type: application/json
   Body: {"user": {...}, "access": "...", "refresh": "..."}
   
8. NETWORK
   ↓
   HTTP Response sent back to React
   
9. REACT RECEIVES (LoginPage.jsx)
   ↓
   const response = await authService.login(...)
   
10. REACT PROCESSES (Redux + localStorage)
    ↓
    dispatch(loginSuccess(response.data))
    localStorage.access_token = token
    
11. REACT UPDATES UI
    ↓
    navigate('/') - Redirect to home page
    
12. USER SEES RESULT
    ↓
    Homepage loads with user logged in
```

---

## 🔐 Token Flow in Detail

### 1. React Gets Token from Django
```javascript
// LoginPage.jsx
const response = await authService.login(email, password)
// response.data.access = "eyJ0eXAiOiJKV1QiLCJhbGc..."

dispatch(loginSuccess(response.data))
// This action in Redux:
```

### 2. Redux Saves Token
```javascript
// store/authSlice.js
loginSuccess: (state, action) => {
  state.user = action.payload.user
  state.token = action.payload.access
  localStorage.setItem('access_token', action.payload.access)  // ← Saved here
  state.isAuthenticated = true
}
```

### 3. Axios Adds Token to Every Request
```javascript
// services/api.js
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')  // ← Retrieved here
  if (token) {
    config.headers.Authorization = `Bearer ${token}`  // ← Added to header
  }
  return config
})

// Every subsequent request now includes:
// Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

### 4. Django Validates Token
```python
# users/views.py
@api_view(['GET'])
@permission_classes([IsAuthenticated])  # ← Requires valid token
def get_current_user(request):
    # Django middleware validates the Authorization header
    # If valid: request.user = the authenticated user
    # If invalid: returns 401 Unauthorized
    
    return Response(UserSerializer(request.user).data)
```

---

## 📦 Data Flow: Add to Cart Example

### React Component (pages/CartPage.jsx)
```javascript
import { useDispatch } from 'react-redux'
import { addToCart } from '../store/cartSlice'

function ProductCard({ product }) {
  const dispatch = useDispatch()
  
  const handleAddToCart = () => {
    // ← REACT UPDATES LOCAL STATE (Redux)
    dispatch(addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1
    }))
    // Cart is updated immediately in browser
    
    // ← ALSO CALL DJANGO (optional - for persistence)
    // cartService.addToCart(product.id, 1)
  }
  
  return <button onClick={handleAddToCart}>Add to Cart</button>
}
```

### If Persisting to Django (cartService.addToCart())
```javascript
// services/api.js
export const cartService = {
  addToCart: (productId, quantity) => 
    api.post('/cart/add/', { 
      product_id: productId, 
      quantity: quantity 
    })
    // POST to: http://localhost:8000/api/cart/add/
}
```

### Django Receives & Saves (carts/views.py)
```python
class CartViewSet(viewsets.ViewSet):
    @action(detail=False, methods=['POST'])
    def add(self, request):
        # Receives from React
        product_id = request.data.get('product_id')
        quantity = request.data.get('quantity')
        
        # Save to database
        cart_item, created = CartItem.objects.get_or_create(
            user=request.user,
            product_id=product_id,
            defaults={'quantity': quantity}
        )
        
        # Send back to React
        return Response(CartItemSerializer(cart_item).data, 
                       status=status.HTTP_201_CREATED)
```

---

## 🎯 Key Connection Points Summary

| Component | File | Role | Calls |
|-----------|------|------|-------|
| **API Service** | `src/services/api.js` | Creates HTTP client | Django endpoints |
| **React Component** | `src/pages/*.jsx` | Calls API service | `authService.login()` |
| **Django URL Router** | `BAW_back/urls.py` | Routes requests | App-specific views |
| **App URL Router** | `BAW_back/{app}/urls.py` | Routes to views | View functions |
| **Django View** | `BAW_back/{app}/views.py` | Processes request | Database queries |
| **Response** | HTTP JSON | Returns data | React receives |

---

## 🌐 Network Inspector View

When you open **Browser DevTools → Network Tab**, you'll see:

```
Request:
  POST /api/auth/login/ HTTP/1.1
  Host: localhost:8000
  Content-Type: application/json
  
  {
    "email": "user@example.com",
    "password": "securepass123"
  }

Response:
  HTTP/1.1 200 OK
  Content-Type: application/json
  
  {
    "user": {
      "id": 1,
      "username": "user",
      "email": "user@example.com"
    },
    "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
  }
```

---

## ✅ Quick Reference

**React makes request:**
```javascript
import { authService } from '../services/api'
authService.login(email, password)
```

**Django receives it:**
```python
@api_view(['POST'])
def login(request):
    # request.data has the JSON
```

**Django sends response:**
```python
return Response({'user': {...}, 'access': '...'})
```

**React processes response:**
```javascript
const response = await authService.login(...)
dispatch(loginSuccess(response.data))
```

**That's the entire connection!** 🔗

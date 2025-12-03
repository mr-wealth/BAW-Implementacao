# 📡 Actual HTTP Messages - Backend & Frontend Communication

## Real HTTP Requests & Responses

### ✨ What Actually Happens on the Network

When you open **Browser DevTools → Network Tab**, here's exactly what you'll see:

---

## 🔐 Example 1: User Login

### React Sends This HTTP Request:

```http
POST /api/auth/login/ HTTP/1.1
Host: localhost:8000
Content-Type: application/json
Content-Length: 65
Connection: keep-alive

{
  "email": "user@example.com",
  "password": "securepass123"
}
```

**Location in React Code:**
```javascript
// BAW-frontend/src/pages/LoginPage.jsx
const response = await authService.login(email, password)
// This creates the above HTTP request
```

### Django Sends Back This HTTP Response:

```http
HTTP/1.1 200 OK
Content-Type: application/json
Access-Control-Allow-Origin: http://localhost:3000
Content-Length: 356
Connection: keep-alive

{
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "user_type": "buyer",
    "phone_number": "+1234567890",
    "country": "USA",
    "is_verified": false,
    "created_at": "2024-12-02T10:30:00Z"
  },
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzMzMTU2NjAwLCJpYXQiOjE3MzMxNTI3MDAsImp0aSI6ImE1YzQzMjE4M2U0YjQyZThiOTBkNGY3ZmM1YWFiMjk0IiwidXNlcl9pZCI6MX0.KWgPqc1q8e3k2p4v7x9j5l8m1n4r7t0w3y6z8a1b4c",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTczMzIzODcwMCwiaWF0IjoxNzMzMTUyNzAwLCJqdGkiOiI5YzY5MzcxNWU4ZTU0ZjFmYTBkMGJlZjU2YjE0YzUxNSIsInVzZXJfaWQiOjF9.7p2k4m6o8q1s3u5w7y9a1b3c5d7e9f1g3h5i7j9k1l"
}
```

**Location in Django Code:**
```python
# BAW_back/users/views.py
@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    serializer = UserLoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        }, status=status.HTTP_200_OK)  # Returns above response
```

### React Processes Response:

```javascript
// BAW-frontend/src/pages/LoginPage.jsx
const response = await authService.login(email, password)

// response.data now contains:
// {
//   user: { id: 1, username: "john_doe", ... },
//   access: "eyJ0eXAi...",
//   refresh: "eyJ0eXAi..."
// }

dispatch(loginSuccess(response.data))
// Saves token to localStorage:
// localStorage.access_token = "eyJ0eXAi..."
```

---

## 📦 Example 2: Get Products List

### React Sends This HTTP Request:

```http
GET /api/products/ HTTP/1.1
Host: localhost:8000
Accept: application/json
Connection: keep-alive
```

**Location in React Code:**
```javascript
// BAW-frontend/src/services/api.js
export const productService = {
  getAll: (params) => api.get('/products/', { params })
}

// Used in BAW-frontend/src/pages/HomePage.jsx
productService.getAll().then(response => {
  setProducts(response.data.results)
})
```

### Django Sends Back This HTTP Response:

```http
HTTP/1.1 200 OK
Content-Type: application/json
Access-Control-Allow-Origin: http://localhost:3000
Content-Length: 1250
Connection: keep-alive

{
  "count": 2,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "store": 1,
      "store_name": "TechStore",
      "name": "Laptop Computer",
      "description": "High performance laptop",
      "price": "999.99",
      "category": "electronics",
      "stock_quantity": 5,
      "image": "/media/products/laptop.jpg",
      "additional_images": [],
      "rating": 4.5,
      "total_sales": 12,
      "is_active": true,
      "reviews": [],
      "created_at": "2024-12-02T09:00:00Z",
      "updated_at": "2024-12-02T10:00:00Z"
    },
    {
      "id": 2,
      "store": 1,
      "store_name": "TechStore",
      "name": "USB-C Cable",
      "description": "Durable USB-C charging cable",
      "price": "19.99",
      "category": "accessories",
      "stock_quantity": 50,
      "image": "/media/products/cable.jpg",
      "additional_images": [],
      "rating": 4.8,
      "total_sales": 156,
      "is_active": true,
      "reviews": [],
      "created_at": "2024-12-02T09:15:00Z",
      "updated_at": "2024-12-02T10:15:00Z"
    }
  ]
}
```

**Location in Django Code:**
```python
# BAW_back/products/views.py
class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductSerializer
    
    # GET /api/products/ automatically calls this:
    def list(self, request):
        queryset = self.get_queryset()
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
```

---

## 🛒 Example 3: Add Product (Authenticated Request)

### React Sends This HTTP Request:

```http
POST /api/products/ HTTP/1.1
Host: localhost:8000
Content-Type: application/json
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
Content-Length: 420
Connection: keep-alive

{
  "name": "Wireless Mouse",
  "description": "Ergonomic wireless mouse with USB receiver",
  "price": "34.99",
  "category": "accessories",
  "stock_quantity": 100,
  "image": "file://upload",
  "is_active": true
}
```

**Notice:** Authorization header with Bearer token

**Location in React Code:**
```javascript
// BAW-frontend/src/services/api.js
// Interceptor adds token automatically:
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`  // ← Added here
  }
  return config
})

// Then in component:
productService.create(productData)
```

### Django Sends Back This HTTP Response:

```http
HTTP/1.1 201 Created
Content-Type: application/json
Access-Control-Allow-Origin: http://localhost:3000
Content-Length: 580
Connection: keep-alive

{
  "id": 3,
  "store": 1,
  "store_name": "TechStore",
  "name": "Wireless Mouse",
  "description": "Ergonomic wireless mouse with USB receiver",
  "price": "34.99",
  "category": "accessories",
  "stock_quantity": 100,
  "image": "/media/products/mouse.jpg",
  "additional_images": [],
  "rating": 0.0,
  "total_sales": 0,
  "is_active": true,
  "reviews": [],
  "created_at": "2024-12-02T11:30:00Z",
  "updated_at": "2024-12-02T11:30:00Z"
}
```

**Location in Django Code:**
```python
# BAW_back/products/views.py
def perform_create(self, serializer):
    try:
        store = self.request.user.store  # Gets authenticated user's store
        serializer.save(store=store)  # Saves with store ID
        return Response(ProductSerializer(serializer.instance).data,
                       status=status.HTTP_201_CREATED)
    except:
        return Response({'error': 'User does not have a store'})
```

---

## ❌ Example 4: Authentication Error

### React Sends This HTTP Request:

```http
POST /api/auth/login/ HTTP/1.1
Host: localhost:8000
Content-Type: application/json
Content-Length: 65
Connection: keep-alive

{
  "email": "user@example.com",
  "password": "wrongpassword"
}
```

### Django Sends Back This HTTP Response (Error):

```http
HTTP/1.1 400 Bad Request
Content-Type: application/json
Access-Control-Allow-Origin: http://localhost:3000
Content-Length: 50
Connection: keep-alive

{
  "error": "Invalid credentials"
}
```

**Location in Django Code:**
```python
# BAW_back/users/views.py
@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    serializer = UserLoginSerializer(data=request.data)
    if serializer.is_valid():
        # ... success case
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
```

### React Handles Error:

```javascript
// BAW-frontend/src/pages/LoginPage.jsx
const handleLogin = async (e) => {
  try {
    const response = await authService.login(email, password)
  } catch (err) {
    // Django returned an error
    setError('Invalid credentials')  // Shows error message
  }
}
```

---

## 🔓 Example 5: Protected Endpoint (Missing Token)

### React Sends This Request (No Token):

```http
GET /api/auth/me/ HTTP/1.1
Host: localhost:8000
Accept: application/json
Connection: keep-alive
```

### Django Sends Back This Response (Unauthorized):

```http
HTTP/1.1 401 Unauthorized
Content-Type: application/json
Access-Control-Allow-Origin: http://localhost:3000
Content-Length: 50
Connection: keep-alive
WWW-Authenticate: Bearer

{
  "detail": "Authentication credentials were not provided."
}
```

**Location in Django Code:**
```python
# BAW_back/users/views.py
@api_view(['GET'])
@permission_classes([IsAuthenticated])  # ← Requires token
def get_current_user(request):
    # If no valid token, Django returns 401 before reaching here
    return Response(UserSerializer(request.user).data)
```

---

## 📋 Example 6: Create Order

### React Sends This HTTP Request:

```http
POST /api/orders/ HTTP/1.1
Host: localhost:8000
Content-Type: application/json
Authorization: Bearer eyJ0eXAi...
Content-Length: 180
Connection: keep-alive

{
  "shipping_address": "123 Main Street",
  "shipping_city": "San Francisco",
  "shipping_country": "USA",
  "shipping_zip": "94105"
}
```

### Django Sends Back This HTTP Response:

```http
HTTP/1.1 201 Created
Content-Type: application/json
Access-Control-Allow-Origin: http://localhost:3000
Content-Length: 850
Connection: keep-alive

{
  "id": 1,
  "user": 1,
  "order_number": "ORD-A1B2C3D4",
  "status": "pending",
  "total_amount": "1054.97",
  "items": [
    {
      "id": 1,
      "product": 1,
      "product_name": "Laptop Computer",
      "quantity": 1,
      "price": "999.99",
      "total": "999.99"
    },
    {
      "id": 2,
      "product": 3,
      "product_name": "Wireless Mouse",
      "quantity": 2,
      "price": "34.99",
      "total": "69.98"
    }
  ],
  "shipping_address": "123 Main Street",
  "shipping_city": "San Francisco",
  "shipping_country": "USA",
  "shipping_zip": "94105",
  "tracking_number": null,
  "estimated_delivery": null,
  "created_at": "2024-12-02T11:45:00Z",
  "updated_at": "2024-12-02T11:45:00Z"
}
```

**Location in Django Code:**
```python
# BAW_back/orders/views.py
class OrderViewSet(viewsets.ModelViewSet):
    def create(self, request):
        serializer = OrderCreateSerializer(data=request.data)
        if serializer.is_valid():
            order = Order.objects.create(
                user=request.user,
                order_number=f"ORD-{uuid.uuid4().hex[:8].upper()}",
                total_amount=total_amount,
                **serializer.validated_data
            )
            return Response(OrderSerializer(order).data, 
                          status=status.HTTP_201_CREATED)
```

---

## 📊 Summary Table: HTTP Transactions

| Action | HTTP Method | URL | Status | Request | Response |
|--------|-------------|-----|--------|---------|----------|
| Register | POST | `/api/auth/register/` | 201 | User data | User + tokens |
| Login | POST | `/api/auth/login/` | 200 | Email/password | User + tokens |
| Get User | GET | `/api/auth/me/` | 200 | Auth token | User data |
| List Products | GET | `/api/products/` | 200 | Query params | Product array |
| Get Product | GET | `/api/products/1/` | 200 | - | Product data |
| Create Product | POST | `/api/products/` | 201 | Product data | Created product |
| Update Product | PUT | `/api/products/1/` | 200 | Product data | Updated product |
| Add to Cart | POST | `/api/cart/add/` | 201 | Product ID | Cart item |
| Get Cart | GET | `/api/cart/` | 200 | Auth token | Cart items |
| Create Order | POST | `/api/orders/` | 201 | Shipping info | Order data |

---

## 🔍 How to See This in Your Browser

1. **Open Developer Tools:** Press `F12`
2. **Go to Network Tab**
3. **Make a request** (e.g., login, add to cart)
4. **Click on the request** in the Network tab
5. **Look at:**
   - **Headers** - URL, method, authorization
   - **Request** - JSON being sent
   - **Response** - JSON received from Django
   - **Status** - HTTP status code (200, 201, 400, 401, etc.)

---

## ✨ Key Takeaways

✅ **React always sends JSON** - Django expects this  
✅ **Django always responds with JSON** - React expects this  
✅ **Authentication via Authorization header** - Includes Bearer token  
✅ **CORS headers allow cross-origin** - Required for React → Django  
✅ **Status codes matter** - 200=OK, 201=Created, 400=Bad Request, 401=Unauthorized  
✅ **Interceptors add tokens automatically** - You don't add them manually  
✅ **Both communicate via REST API** - Standard HTTP protocol  

**That's exactly how your React frontend and Django backend communicate!** 🚀

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

// Auth Services
export const authService = {
  register: (userData) => api.post('/auth/register/', userData),
  login: (email, password) => api.post('/auth/login/', { email, password }),
  logout: () => api.post('/auth/logout/'),
  refreshToken: () => api.post('/auth/refresh/'),
};

// Product Services
export const productService = {
  getAll: (params) => api.get('/products/', { params }),
  getById: (id) => api.get(`/products/${id}/`),
  create: (data) => api.post('/products/', data),
  update: (id, data) => api.put(`/products/${id}/`, data),
  delete: (id) => api.delete(`/products/${id}/`),
  search: (query) => api.get(`/products/search/?q=${query}`),
};

// Store Services
export const storeService = {
  getAll: (params) => api.get('/stores/', { params }),
  getById: (id) => api.get(`/stores/${id}/`),
  create: (data) => api.post('/stores/', data),
  update: (id, data) => api.put(`/stores/${id}/`, data),
  getMyStore: () => api.get('/stores/my-store/'),
};

// Order Services
export const orderService = {
  getAll: (params) => api.get('/orders/', { params }),
  getById: (id) => api.get(`/orders/${id}/`),
  create: (data) => api.post('/orders/', data),
  update: (id, data) => api.put(`/orders/${id}/`, data),
  updateStatus: (id, status) => api.patch(`/orders/${id}/update-status/`, { status }),
};

// Cart Services
export const cartService = {
  getCart: () => api.get('/cart/'),
  addToCart: (productId, quantity) => api.post('/cart/add/', { product_id: productId, quantity }),
  removeFromCart: (itemId) => api.delete(`/cart/${itemId}/`),
  updateCart: (itemId, quantity) => api.patch(`/cart/${itemId}/`, { quantity }),
};

// Payment Services
export const paymentService = {
  initializePayment: (orderId, method) => api.post('/payments/initialize/', { order_id: orderId, method }),
  verifyPayment: (paymentId) => api.get(`/payments/${paymentId}/verify/`),
};

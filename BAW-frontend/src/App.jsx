import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Provider, useSelector } from 'react-redux'  // Added useSelector here
import store from './store'
import LoginPage from './pages/LoginPage'
import CartPage from './pages/CartPage'
import HomePage from './pages/HomePage'  // Changed to match your import
import ProductPage from './pages/ProductPage'
import RegisterPage from './pages/RegisterPage'
import CheckoutPage from './pages/CheckoutPage'
import SellerDashboard from './pages/SellerDashboard'

// Protected Route wrapper
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useSelector(state => state.auth)
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  return children
}

// Public Route wrapper (redirects to home if already logged in)
function PublicRoute({ children }) {
  const { isAuthenticated } = useSelector(state => state.auth)
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }
  
  return children
}

function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        } />
        
        <Route path="/register" element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        } />
        
        {/* Protected routes - Notice each has a DIFFERENT path */}
        <Route path="/" element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        } />

        <Route path="/cart" element={
          <ProtectedRoute>
            <CartPage />
          </ProtectedRoute>
        } />

        <Route path="/products/:id" element={
          <ProtectedRoute>
            <ProductPage />
          </ProtectedRoute>
        } />

        <Route path="/checkout" element={
          <ProtectedRoute>
            <CheckoutPage />
          </ProtectedRoute>
        } />
        
        <Route path="/seller/dashboard" element={
          <ProtectedRoute>
            <SellerDashboard />
          </ProtectedRoute>
        } />
        
        {/* Catch all - redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}

function App() {
  return (
    <Provider store={store}>
      <AppRoutes />
    </Provider>
  )
}

export default App
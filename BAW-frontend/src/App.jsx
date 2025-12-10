import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Provider } from 'react-redux'
import { useSelector } from 'react-redux'
import store from './store'
import './App.css'

// Pages
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import HomePage from './pages/HomePage'
import ProductPage from './pages/ProductPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import SellerDashboard from './pages/SellerDashboard'

// Components
import Navigation from './components/Navigation'
import Footer from './components/Footer'

// Protected Route Component
function ProtectedRoute({ children, isAuthenticated }) {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  return children
}

function AppRoutes() {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated)

  return (
    <>
      {isAuthenticated && <Navigation />}
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <HomePage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/product/:id" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <ProductPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/cart" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <CartPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/checkout" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <CheckoutPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/seller-dashboard" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <SellerDashboard />
            </ProtectedRoute>
          } 
        />

        {/* Catch all - redirect to home or login */}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />} />
      </Routes>
      {isAuthenticated && <Footer />}
    </>
  )
}

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppRoutes />
      </Router>
    </Provider>
  )
}

export default App

import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { authService } from '../services/api'
import { loginSuccess } from '../store/authSlice'
import { useNavigate, Link } from 'react-router-dom'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    
    try {
      const response = await authService.login(username, password)
      
      // Store tokens in localStorage
      localStorage.setItem('access_token', response.data.access)
      localStorage.setItem('refresh_token', response.data.refresh)
      localStorage.setItem('user', JSON.stringify(response.data.user))
      
      // Dispatch to Redux
      dispatch(loginSuccess({
        user: response.data.user,
        token: response.data.access
      }))
      
      navigate('/')
    } catch (err) {
      console.error('Login error:', err)
      setError(err.response?.data?.error || err.response?.data?.detail || 'Invalid credentials')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div style={{ 
        maxWidth: '450px',
        width: '100%',
        backgroundColor: 'white',
        padding: '2.5rem', 
        borderRadius: '12px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
      }}>
        <h1 style={{ textAlign: 'center', marginBottom: '0.5rem', color: '#2c3e50' }}>Welcome Back</h1>
        <p style={{ textAlign: 'center', color: '#7f8c8d', marginBottom: '2rem' }}>Login to BAW Marketplace</p>
        
        {error && (
          <div style={{ 
            color: '#e74c3c', 
            marginBottom: '1rem', 
            padding: '1rem', 
            backgroundColor: '#ffe5e5', 
            borderRadius: '6px',
            border: '1px solid #ffcccc'
          }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#2c3e50' }}>
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={isLoading}
              style={{ 
                width: '100%', 
                padding: '0.75rem', 
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#2c3e50' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              style={{ 
                width: '100%', 
                padding: '0.75rem', 
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading}
            style={{ 
              width: '100%', 
              padding: '1rem', 
              backgroundColor: isLoading ? '#95a5a6' : '#3498db', 
              color: 'white', 
              border: 'none', 
              borderRadius: '6px', 
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontSize: '1.1rem',
              fontWeight: '600',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => !isLoading && (e.target.style.backgroundColor = '#2980b9')}
            onMouseOut={(e) => !isLoading && (e.target.style.backgroundColor = '#3498db')}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#7f8c8d' }}>
          Don't have an account? <Link to="/register" style={{ color: '#27ae60', textDecoration: 'none', fontWeight: '500' }}>Register here</Link>
        </p>
      </div>
    </div>
  )
}
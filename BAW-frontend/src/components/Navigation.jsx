import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../store/authSlice'

export default function Navigation() {
  const { isAuthenticated, user } = useSelector(state => state.auth)
  const { items } = useSelector(state => state.cart || { items: [] })
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <nav style={{
      backgroundColor: '#2c3e50',
      color: 'white',
      padding: '1rem 2rem',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      marginBottom: '0'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Link 
          to="/" 
          style={{ 
            color: 'white', 
            textDecoration: 'none', 
            fontSize: '1.5rem', 
            fontWeight: 'bold',
            transition: 'opacity 0.2s'
          }}
          onMouseOver={(e) => e.target.style.opacity = '0.8'}
          onMouseOut={(e) => e.target.style.opacity = '1'}
        >
          BAW Marketplace
        </Link>
        
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <Link 
            to="/" 
            style={{ 
              color: 'white', 
              textDecoration: 'none',
              fontSize: '1rem',
              transition: 'opacity 0.2s'
            }}
            onMouseOver={(e) => e.target.style.opacity = '0.7'}
            onMouseOut={(e) => e.target.style.opacity = '1'}
          >
            Home
          </Link>
          
          {isAuthenticated ? (
            <>
              <span style={{ color: 'white', fontSize: '0.9rem' }}>
                Welcome, <strong>{user?.username}</strong>!
              </span>
              
              {user?.user_type === 'seller' && (
                <Link 
                  to="/seller/dashboard" 
                  style={{ 
                    color: 'white', 
                    textDecoration: 'none',
                    fontSize: '1rem',
                    transition: 'opacity 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.opacity = '0.7'}
                  onMouseOut={(e) => e.target.style.opacity = '1'}
                >
                  Dashboard
                </Link>
              )}
              
              <Link 
                to="/cart" 
                style={{ 
                  color: 'white', 
                  textDecoration: 'none',
                  fontSize: '1rem',
                  backgroundColor: '#e74c3c',
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#c0392b'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#e74c3c'}
              >
                Cart ({items?.length || 0})
              </Link>
              
              <button 
                onClick={handleLogout} 
                style={{ 
                  background: '#e74c3c', 
                  border: 'none', 
                  color: 'white', 
                  cursor: 'pointer',
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  fontWeight: '500',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#c0392b'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#e74c3c'}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                style={{ 
                  color: 'white', 
                  textDecoration: 'none',
                  backgroundColor: '#3498db',
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#2980b9'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#3498db'}
              >
                Login
              </Link>
              <Link 
                to="/register" 
                style={{ 
                  color: 'white', 
                  textDecoration: 'none',
                  backgroundColor: '#27ae60',
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#229954'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#27ae60'}
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
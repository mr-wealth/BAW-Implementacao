import React, { useEffect, useState } from 'react'
import { productService } from '../services/api'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'
import { useNavigate } from 'react-router-dom'

export default function HomePage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productService.getAll()
        setProducts(response.data.results || response.data)
      } catch (error) {
        console.error('Error fetching products:', error)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  if (loading) {
    return (
      <>
        <Navigation />
        <div style={{ 
          textAlign: 'center', 
          padding: '4rem',
          minHeight: 'calc(100vh - 200px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div>
            <div style={{ 
              fontSize: '2rem', 
              marginBottom: '1rem',
              animation: 'pulse 1.5s ease-in-out infinite'
            }}>
              ⏳
            </div>
            <p style={{ fontSize: '1.2rem', color: '#7f8c8d' }}>Loading products...</p>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navigation />
      <div style={{ minHeight: 'calc(100vh - 200px)' }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '2rem' 
        }}>
          <div style={{ 
            textAlign: 'center', 
            marginBottom: '3rem',
            padding: '3rem 2rem',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '12px',
            color: 'white'
          }}>
            <h1 style={{ 
              fontSize: '3rem', 
              marginBottom: '1rem',
              fontWeight: 'bold'
            }}>
              Welcome to BAW
            </h1>
            <p style={{ 
              fontSize: '1.3rem', 
              opacity: 0.95,
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Buy and Sell products from around the world
            </p>
          </div>
          
          <h2 style={{ 
            fontSize: '2rem', 
            marginBottom: '1.5rem', 
            color: '#2c3e50',
            borderBottom: '3px solid #3498db',
            paddingBottom: '0.5rem',
            display: 'inline-block'
          }}>
            Featured Products
          </h2>
          
          {products.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '4rem 2rem',
              backgroundColor: '#f8f9fa',
              borderRadius: '12px',
              border: '2px dashed #dee2e6',
              marginTop: '2rem'
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📦</div>
              <h3 style={{ 
                color: '#6c757d', 
                marginBottom: '1rem',
                fontSize: '1.5rem'
              }}>
                No products available yet
              </h3>
              <p style={{ color: '#6c757d', fontSize: '1.1rem' }}>
                Check back later for amazing deals from around the world!
              </p>
            </div>
          ) : (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
              gap: '2rem',
              marginTop: '2rem'
            }}>
              {products.map(product => (
                <div 
                  key={product.id} 
                  style={{ 
                    border: '1px solid #e0e0e0',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    backgroundColor: 'white',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)'
                    e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)'
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                  onClick={() => navigate(`/products/${product.id}`)}
                >
                  {product.image ? (
                    <img 
                      src={product.image} 
                      alt={product.name}
                      style={{
                        width: '100%',
                        height: '200px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        marginBottom: '1rem',
                        backgroundColor: '#f5f5f5'
                      }}
                    />
                  ) : (
                    <div style={{
                      width: '100%',
                      height: '200px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#f5f5f5',
                      borderRadius: '8px',
                      marginBottom: '1rem',
                      fontSize: '4rem'
                    }}>
                      📦
                    </div>
                  )}
                  
                  <h3 style={{ 
                    fontSize: '1.25rem', 
                    marginBottom: '0.5rem',
                    color: '#2c3e50',
                    fontWeight: '600',
                    minHeight: '3rem',
                    lineHeight: '1.5rem'
                  }}>
                    {product.name}
                  </h3>
                  
                  <p style={{ 
                    fontSize: '1.75rem', 
                    fontWeight: 'bold',
                    color: '#27ae60',
                    margin: '0.5rem 0'
                  }}>
                    ${parseFloat(product.price).toFixed(2)}
                  </p>
                  
                  <p style={{ 
                    color: '#7f8c8d',
                    fontSize: '0.95rem',
                    marginBottom: '0.5rem',
                    textTransform: 'capitalize'
                  }}>
                    {product.category || 'General'}
                  </p>
                  
                  <p style={{ 
                    color: product.stock_quantity > 0 ? '#27ae60' : '#e74c3c',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    marginBottom: '1rem',
                    padding: '0.25rem 0.5rem',
                    backgroundColor: product.stock_quantity > 0 ? '#d5f4e6' : '#fadbd8',
                    borderRadius: '4px',
                    display: 'inline-block'
                  }}>
                    {product.stock_quantity > 0 
                      ? `In Stock: ${product.stock_quantity}` 
                      : 'Out of Stock'}
                  </p>
                  
                  <button 
                    style={{
                      width: '100%',
                      marginTop: 'auto',
                      padding: '0.75rem',
                      backgroundColor: product.stock_quantity > 0 ? '#3498db' : '#95a5a6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: product.stock_quantity > 0 ? 'pointer' : 'not-allowed',
                      fontSize: '1rem',
                      fontWeight: '600',
                      transition: 'background-color 0.2s'
                    }}
                    disabled={product.stock_quantity === 0}
                    onMouseOver={(e) => product.stock_quantity > 0 && (e.target.style.backgroundColor = '#2980b9')}
                    onMouseOut={(e) => product.stock_quantity > 0 && (e.target.style.backgroundColor = '#3498db')}
                    onClick={(e) => {
                      e.stopPropagation()
                      navigate(`/products/${product.id}`)
                    }}
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}
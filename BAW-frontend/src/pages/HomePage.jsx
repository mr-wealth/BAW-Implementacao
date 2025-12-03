import React, { useEffect, useState } from 'react'
import { productService } from '../services/api'

export default function HomePage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productService.getAll()
        setProducts(response.data.results || response.data)
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  if (loading) return <div style={{ textAlign: 'center', padding: '40px' }}>Loading products...</div>

  return (
    <div style={{ padding: '40px 20px' }}>
      <h1>Welcome to BAW</h1>
      <p>Buy and Sell products from around the world</p>
      
      <h2>Featured Products</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
        {products.map(product => (
          <div key={product.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
            <h3>{product.name}</h3>
            <p>${product.price}</p>
            <p>{product.category}</p>
            <p>Stock: {product.stock_quantity}</p>
            <button>View Details</button>
          </div>
        ))}
      </div>
    </div>
  )
}

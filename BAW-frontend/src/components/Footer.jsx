import React from 'react'

export default function Footer() {
  return (
    <footer style={{ 
      backgroundColor: '#2c3e50', 
      color: 'white', 
      padding: '2rem', 
      textAlign: 'center', 
      marginTop: '4rem',
      borderTop: '4px solid #3498db'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <p style={{ margin: 0, fontSize: '1rem' }}>
          &copy; 2024 BAW - Buy and Sell Around the World. All rights reserved.
        </p>
        <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', opacity: 0.8 }}>
          Connect buyers and sellers globally
        </p>
      </div>
    </footer>
  )
}
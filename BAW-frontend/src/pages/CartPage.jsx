import React from 'react'
import { useSelector } from 'react-redux'

export default function CartPage() {
  const cart = useSelector(state => state.cart)

  return (
    <div style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Shopping Cart</h1>
      {cart.items.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #ddd' }}>
                <th style={{ textAlign: 'left', padding: '10px' }}>Product</th>
                <th style={{ textAlign: 'center', padding: '10px' }}>Price</th>
                <th style={{ textAlign: 'center', padding: '10px' }}>Quantity</th>
                <th style={{ textAlign: 'right', padding: '10px' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {cart.items.map(item => (
                <tr key={item.id} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '10px' }}>{item.name}</td>
                  <td style={{ textAlign: 'center', padding: '10px' }}>${item.price}</td>
                  <td style={{ textAlign: 'center', padding: '10px' }}>{item.quantity}</td>
                  <td style={{ textAlign: 'right', padding: '10px' }}>${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: '20px', fontSize: '18px', fontWeight: 'bold' }}>
            Total: ${cart.total.toFixed(2)}
          </div>
          <button style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  )
}

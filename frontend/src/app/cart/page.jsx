'use client'
import { useState, useEffect } from 'react'
import Navbar from '../../components/Navbar'
import { cartAPI } from '../../lib/api'
import Link from 'next/link'

export default function CartPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    cartAPI.get('/items')
      .then(r => setItems(r.data.items || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }, [])

  const remove = async (productId) => {
    try { await cartAPI.delete(`/remove/${productId}`) } catch {}
    setItems(prev => prev.filter(i => i.productId !== productId))
  }

  const total = items.reduce((sum, i) => sum + (i.price * (i.quantity || 1)), 0)

  return (
    <>
      <Navbar cartCount={items.length} />
      <div style={{ maxWidth: 800, margin: '40px auto', padding: '0 24px' }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 32 }}>Your Cart</h1>
        {loading ? <p>Loading...</p> : items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60 }}>
            <p style={{ fontSize: 18, color: '#888', marginBottom: 20 }}>Your cart is empty</p>
            <Link href="/" style={{
              background: '#111', color: '#fff', padding: '12px 28px', borderRadius: 8
            }}>Continue Shopping</Link>
          </div>
        ) : (
          <>
            {items.map(item => (
              <div key={item.productId} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                background: '#fff', borderRadius: 10, padding: 20, marginBottom: 12,
                boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
              }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>{item.name}</div>
                  <div style={{ color: '#888', marginTop: 4 }}>Qty: {item.quantity || 1}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                  <div style={{ fontWeight: 700, fontSize: 18 }}>₹{item.price}</div>
                  <button onClick={() => remove(item.productId)}
                    style={{ background: '#ff4d4f', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 14px' }}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <div style={{ textAlign: 'right', marginTop: 24 }}>
              <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 16 }}>Total: ₹{total}</div>
              <Link href="/checkout" style={{
                background: '#111', color: '#fff', padding: '14px 36px',
                borderRadius: 10, fontWeight: 700, fontSize: 16
              }}>Proceed to Checkout</Link>
            </div>
          </>
        )}
      </div>
    </>
  )
}
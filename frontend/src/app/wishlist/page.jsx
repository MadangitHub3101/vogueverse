'use client'
import { useState, useEffect } from 'react'
import Navbar from '../../components/Navbar'
import { wishlistAPI, cartAPI } from '../../lib/api'

export default function WishlistPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    wishlistAPI.get('/items')
      .then(r => setItems(r.data.items || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }, [])

  const remove = async (productId) => {
    try { await wishlistAPI.delete(`/remove/${productId}`) } catch {}
    setItems(prev => prev.filter(i => i.productId !== productId))
  }

  const moveToCart = async (item) => {
    try {
      await cartAPI.post('/add', { productId: item.productId, name: item.name, price: item.price, quantity: 1 })
      await wishlistAPI.delete(`/remove/${item.productId}`)
    } catch {}
    setItems(prev => prev.filter(i => i.productId !== item.productId))
  }

  return (
    <>
      <Navbar wishCount={items.length} />
      <div style={{ maxWidth: 800, margin: '40px auto', padding: '0 24px' }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 32 }}>Your Wishlist</h1>
        {loading ? <p>Loading...</p> : items.length === 0 ? (
          <p style={{ fontSize: 18, color: '#888' }}>No items in wishlist yet.</p>
        ) : (
          items.map(item => (
            <div key={item.productId} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              background: '#fff', borderRadius: 10, padding: 20, marginBottom: 12,
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
            }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16 }}>{item.name}</div>
                <div style={{ color: '#555', marginTop: 4 }}>₹{item.price}</div>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => moveToCart(item)}
                  style={{ background: '#111', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 16px' }}>
                  Move to Cart
                </button>
                <button onClick={() => remove(item.productId)}
                  style={{ background: '#ff4d4f', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 14px' }}>
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  )
}
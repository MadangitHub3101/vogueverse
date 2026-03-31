'use client'
import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import ProductCard from '../components/ProductCard'
import { cartAPI, wishlistAPI, recAPI } from '../lib/api'

const PRODUCTS = [
  { id: 1, name: 'Classic madan Tee', category: 'Men', price: 799, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400' },
  { id: 2, name: 'Floral Sundress', category: 'Women', price: 1499, image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400' },
  { id: 3, name: 'Slim Fit Chinos', category: 'Men', price: 1299, image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400' },
  { id: 4, name: 'Crop Hoodie', category: 'Women', price: 1099, image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400' },
  { id: 5, name: 'Denim Jacket', category: 'Unisex', price: 2299, image: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=400' },
  { id: 6, name: 'Ethnic Kurta', category: 'Men', price: 999, image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400' },
]

export default function Home() {
  const [cart, setCart] = useState([])
  const [wishlist, setWishlist] = useState([])
  const [recs, setRecs] = useState([])
  const [msg, setMsg] = useState('')

  useEffect(() => {
    recAPI.get('/products')
      .then(r => setRecs(r.data.recommendations || []))
      .catch(() => setRecs([]))
  }, [])

  const showMsg = (text) => {
    setMsg(text)
    setTimeout(() => setMsg(''), 2000)
  }

  const addToCart = async (product) => {
    try {
      await cartAPI.post('/add', { productId: product.id, name: product.name, price: product.price, quantity: 1 })
      setCart(prev => [...prev, product])
      showMsg(`${product.name} added to cart!`)
    } catch {
      setCart(prev => [...prev, product])
      showMsg(`${product.name} added to cart!`)
    }
  }

  const toggleWishlist = async (product) => {
    const exists = wishlist.find(w => w.id === product.id)
    try {
      if (exists) {
        await wishlistAPI.delete(`/remove/${product.id}`)
        setWishlist(prev => prev.filter(w => w.id !== product.id))
        showMsg('Removed from wishlist')
      } else {
        await wishlistAPI.post('/add', { productId: product.id, name: product.name, price: product.price })
        setWishlist(prev => [...prev, product])
        showMsg(`${product.name} wishlisted!`)
      }
    } catch {
      if (exists) {
        setWishlist(prev => prev.filter(w => w.id !== product.id))
      } else {
        setWishlist(prev => [...prev, product])
      }
    }
  }

  return (
    <>
      <Navbar cartCount={cart.length} wishCount={wishlist.length} />

      {msg && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, background: '#111', color: '#fff',
          padding: '12px 20px', borderRadius: 8, zIndex: 999, fontSize: 14
        }}>
          {msg}
        </div>
      )}

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        color: '#fff', textAlign: 'center', padding: '80px 20px'
      }}>
        <div style={{ fontSize: 13, letterSpacing: 4, color: '#aaa', marginBottom: 16 }}>NEW SEASON 2024</div>
        <h1 style={{ fontSize: 52, fontWeight: 900, marginBottom: 16 }}>Dress Your Story</h1>
        <p style={{ fontSize: 18, color: '#ccc', marginBottom: 32 }}>Premium apparel for every occasion</p>
        <a href="/search" style={{
          background: '#fff', color: '#111', padding: '14px 36px',
          borderRadius: 40, fontWeight: 700, fontSize: 16
        }}>
          Shop Now
        </a>
      </div>

      {/* Products */}
      <div style={{ maxWidth: 1200, margin: '48px auto', padding: '0 24px' }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 32 }}>Trending Now</h2>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24
        }}>
          {PRODUCTS.map(p => (
            <ProductCard
              key={p.id}
              product={p}
              onAddToCart={addToCart}
              onToggleWishlist={toggleWishlist}
              wishlisted={!!wishlist.find(w => w.id === p.id)}
            />
          ))}
        </div>
      </div>

      {/* Recommendations */}
      {recs.length > 0 && (
        <div style={{ background: '#fff', padding: '48px 24px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 32 }}>Recommended For You</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
              {recs.map(r => (
                <div key={r.id} style={{ background: '#f5f5f5', borderRadius: 10, padding: 16 }}>
                  <div style={{ fontWeight: 600 }}>{r.name}</div>
                  <div style={{ color: '#555', marginTop: 4 }}>₹{r.price}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
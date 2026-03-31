'use client'
import { useState } from 'react'
import Navbar from '../../components/Navbar'
import ProductCard from '../../components/ProductCard'
import { searchAPI, cartAPI, wishlistAPI } from '../../lib/api'

const ALL_PRODUCTS = [
  { id: 1, name: 'Classic White Tee', category: 'Men', price: 799, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400' },
  { id: 2, name: 'Floral Sundress', category: 'Women', price: 1499, image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400' },
  { id: 3, name: 'Slim Fit Chinos', category: 'Men', price: 1299, image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400' },
  { id: 4, name: 'Crop Hoodie', category: 'Women', price: 1099, image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400' },
  { id: 5, name: 'Denim Jacket', category: 'Unisex', price: 2299, image: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=400' },
  { id: 6, name: 'Ethnic Kurta', category: 'Men', price: 999, image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400' },
]

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState(ALL_PRODUCTS)
  const [cart, setCart] = useState([])
  const [wishlist, setWishlist] = useState([])

  const handleSearch = async (q) => {
    setQuery(q)
    if (!q.trim()) { setResults(ALL_PRODUCTS); return }
    try {
      const res = await searchAPI.get(`/products?q=${q}`)
      setResults(res.data.results || [])
    } catch {
      setResults(ALL_PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(q.toLowerCase()) ||
        p.category.toLowerCase().includes(q.toLowerCase())
      ))
    }
  }

  const addToCart = async (product) => {
    try { await cartAPI.post('/add', { productId: product.id, name: product.name, price: product.price, quantity: 1 }) }
    catch {}
    setCart(prev => [...prev, product])
  }

  const toggleWishlist = async (product) => {
    const exists = wishlist.find(w => w.id === product.id)
    try {
      if (exists) { await wishlistAPI.delete(`/remove/${product.id}`) }
      else { await wishlistAPI.post('/add', { productId: product.id, name: product.name, price: product.price }) }
    } catch {}
    setWishlist(prev => exists ? prev.filter(w => w.id !== product.id) : [...prev, product])
  }

  return (
    <>
      <Navbar cartCount={cart.length} wishCount={wishlist.length} />
      <div style={{ maxWidth: 1200, margin: '40px auto', padding: '0 24px' }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 24 }}>Search Apparel</h1>
        <input
          type="text"
          placeholder="Search by name, category..."
          value={query}
          onChange={e => handleSearch(e.target.value)}
          style={{
            width: '100%', padding: '14px 20px', fontSize: 16, borderRadius: 10,
            border: '2px solid #e0e0e0', marginBottom: 32, outline: 'none'
          }}
        />
        <p style={{ marginBottom: 20, color: '#888' }}>{results.length} results found</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
          {results.map(p => (
            <ProductCard
              key={p.id} product={p}
              onAddToCart={addToCart}
              onToggleWishlist={toggleWishlist}
              wishlisted={!!wishlist.find(w => w.id === p.id)}
            />
          ))}
        </div>
      </div>
    </>
  )
}
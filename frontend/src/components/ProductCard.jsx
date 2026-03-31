'use client'

export default function ProductCard({ product, onAddToCart, onToggleWishlist, wishlisted }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 12, overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(0,0,0,0.07)', transition: 'transform 0.2s',
    }}>
      <img
        src={product.image}
        alt={product.name}
        style={{ width: '100%', height: 260, objectFit: 'cover' }}
      />
      <div style={{ padding: '14px 16px' }}>
        <div style={{ fontSize: 13, color: '#888', marginBottom: 4 }}>{product.category}</div>
        <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>{product.name}</div>
        <div style={{ fontWeight: 600, fontSize: 18, color: '#111', marginBottom: 14 }}>
          ₹{product.price}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => onAddToCart(product)}
            style={{
              flex: 1, padding: '10px 0', background: '#111', color: '#fff',
              border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 14
            }}
          >
            Add to Cart
          </button>
          <button
            onClick={() => onToggleWishlist(product)}
            style={{
              padding: '10px 14px', background: wishlisted ? '#ff4d6d' : '#f0f0f0',
              color: wishlisted ? '#fff' : '#555', border: 'none', borderRadius: 8, fontSize: 16
            }}
          >
            ♥
          </button>
        </div>
      </div>
    </div>
  )
}
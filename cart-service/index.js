const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())

// In-memory store (replace with Redis/DB in production)
const carts = {}

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'cart-service' }))

// Add item to cart
app.post('/api/cart/add', (req, res) => {
  const { productId, name, price, quantity = 1 } = req.body
  const userId = req.headers['x-user-id'] || 'guest'
  if (!carts[userId]) carts[userId] = []
  const existing = carts[userId].find(i => i.productId === productId)
  if (existing) {
    existing.quantity += quantity
  } else {
    carts[userId].push({ productId, name, price, quantity })
  }
  res.json({ success: true, cart: carts[userId] })
})

// Get cart items
app.get('/api/cart/items', (req, res) => {
  const userId = req.headers['x-user-id'] || 'guest'
  res.json({ items: carts[userId] || [] })
})

// Remove item
app.delete('/api/cart/remove/:productId', (req, res) => {
  const userId = req.headers['x-user-id'] || 'guest'
  if (carts[userId]) {
    carts[userId] = carts[userId].filter(i => i.productId !== req.params.productId)
  }
  res.json({ success: true })
})

// Clear cart
app.delete('/api/cart/clear', (req, res) => {
  const userId = req.headers['x-user-id'] || 'guest'
  carts[userId] = []
  res.json({ success: true })
})

const PORT = process.env.PORT || 4001
app.listen(PORT, () => console.log(`Cart service running on port ${PORT}`))
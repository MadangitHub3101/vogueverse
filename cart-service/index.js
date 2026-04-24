const express = require('express')
const cors = require('cors')
const { Pool } = require('pg')

const app = express()
app.use(cors())
app.use(express.json())

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

pool.query(`
  CREATE TABLE IF NOT EXISTS cart_items (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(100) NOT NULL,
    product_id VARCHAR(100) NOT NULL,
    name TEXT NOT NULL,
    price NUMERIC NOT NULL,
    quantity INT DEFAULT 1,
    UNIQUE(user_id, product_id)
  )
`).then(() => console.log('cart_items table ready'))
  .catch(err => console.error('Table creation error:', err.message))

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'cart-service' }))

app.post('/api/cart/add', async (req, res) => {
  try {
    const { productId, name, price, quantity = 1 } = req.body
    if (!productId || !name || !price)
      return res.status(400).json({ success: false, message: 'Missing fields' })
    const userId = req.headers['x-user-id'] || 'guest'
    await pool.query(`
      INSERT INTO cart_items (user_id, product_id, name, price, quantity)
      VALUES ($1,$2,$3,$4,$5)
      ON CONFLICT (user_id, product_id)
      DO UPDATE SET quantity = cart_items.quantity + $5
    `, [userId, productId, name, price, quantity])
    const { rows } = await pool.query('SELECT * FROM cart_items WHERE user_id=$1', [userId])
    res.json({ success: true, cart: rows })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, error: err.message })
  }
})

app.get('/api/cart/items', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || 'guest'
    const { rows } = await pool.query('SELECT * FROM cart_items WHERE user_id=$1', [userId])
    res.json({ items: rows })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.delete('/api/cart/remove/:productId', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || 'guest'
    await pool.query('DELETE FROM cart_items WHERE user_id=$1 AND product_id=$2', [userId, req.params.productId])
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.delete('/api/cart/clear', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || 'guest'
    await pool.query('DELETE FROM cart_items WHERE user_id=$1', [userId])
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

const PORT = process.env.PORT || 4001
app.listen(PORT, () => console.log(`Cart service on port ${PORT}`))

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

// Create table on startup
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
`)

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'cart-service' }))

app.post('/api/cart/add', async (req, res) => {
  const { productId, name, price, quantity = 1 } = req.body
  const userId = req.headers['x-user-id'] || 'guest'
  await pool.query(`
    INSERT INTO cart_items (user_id, product_id, name, price, quantity)
    VALUES ($1,$2,$3,$4,$5)
    ON CONFLICT (user_id, product_id)
    DO UPDATE SET quantity = cart_items.quantity + $5
  `, [userId, productId, name, price, quantity])
  const { rows } = await pool.query('SELECT * FROM cart_items WHERE user_id=$1', [userId])
  res.json({ success: true, cart: rows })
})

app.get('/api/cart/items', async (req, res) => {
  const userId = req.headers['x-user-id'] || 'guest'
  const { rows } = await pool.query('SELECT * FROM cart_items WHERE user_id=$1', [userId])
  res.json({ items: rows })
})

app.delete('/api/cart/remove/:productId', async (req, res) => {
  const userId = req.headers['x-user-id'] || 'guest'
  await pool.query('DELETE FROM cart_items WHERE user_id=$1 AND product_id=$2', [userId, req.params.productId])
  res.json({ success: true })
})

app.delete('/api/cart/clear', async (req, res) => {
  const userId = req.headers['x-user-id'] || 'guest'
  await pool.query('DELETE FROM cart_items WHERE user_id=$1', [userId])
  res.json({ success: true })
})

const PORT = process.env.PORT || 4001
app.listen(PORT, () => console.log(`Cart service on port ${PORT}`))

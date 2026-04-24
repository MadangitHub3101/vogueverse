const express = require('express')
const cors = require('cors')
const { v4: uuidv4 } = require('uuid')
const { Pool } = require('pg')

const app = express()
app.use(cors())
app.use(express.json())

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

pool.query(`
  CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    transaction_id VARCHAR(100) UNIQUE NOT NULL,
    name TEXT,
    email TEXT,
    amount NUMERIC,
    currency VARCHAR(10),
    status VARCHAR(20),
    created_at TIMESTAMP DEFAULT NOW()
  )
`)

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'payment-service' }))

app.post('/api/pay/process', async (req, res) => {
  const { name, email, amount, currency = 'INR' } = req.body
  if (!name || !email || !amount)
    return res.status(400).json({ success: false, message: 'Missing fields' })
  const transactionId = uuidv4()
  const timestamp = new Date().toISOString()
  await pool.query(`
    INSERT INTO transactions (transaction_id, name, email, amount, currency, status)
    VALUES ($1,$2,$3,$4,$5,'COMPLETED')
  `, [transactionId, name, email, amount, currency])
  res.json({ success: true, transactionId, amount, currency, status: 'COMPLETED', timestamp })
})

app.get('/api/pay/status/:transactionId', async (req, res) => {
  const { rows } = await pool.query(
    'SELECT * FROM transactions WHERE transaction_id=$1',
    [req.params.transactionId]
  )
  if (!rows.length) return res.status(404).json({ message: 'Not found' })
  res.json(rows[0])
})

const PORT = process.env.PORT || 4003
app.listen(PORT, () => console.log(`Payment service on port ${PORT}`))

const express = require('express')
const cors = require('cors')
const { v4: uuidv4 } = require('uuid')
const app = express()

app.use(cors())
app.use(express.json())

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'payment-service' }))

app.post('/api/pay/process', (req, res) => {
  const { name, email, amount, currency = 'INR' } = req.body

  if (!name || !email || !amount) {
    return res.status(400).json({ success: false, message: 'Missing required fields' })
  }

  // Simulate payment processing
  const transactionId = uuidv4()
  const timestamp = new Date().toISOString()

  console.log(`Payment processed: ₹${amount} by ${email} | txn: ${transactionId}`)

  res.json({
    success: true,
    transactionId,
    amount,
    currency,
    status: 'COMPLETED',
    timestamp,
    message: 'Payment successful'
  })
})

app.get('/api/pay/status/:transactionId', (req, res) => {
  res.json({
    transactionId: req.params.transactionId,
    status: 'COMPLETED',
    timestamp: new Date().toISOString()
  })
})

const PORT = process.env.PORT || 4003
app.listen(PORT, () => console.log(`Payment service running on port ${PORT}`))
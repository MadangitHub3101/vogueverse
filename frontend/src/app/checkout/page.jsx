'use client'
import { useState } from 'react'
import Navbar from '../../components/Navbar'
import { paymentAPI } from '../../lib/api'
import { useRouter } from 'next/navigation'

export default function CheckoutPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', card: '', expiry: '', cvv: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handlePay = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await paymentAPI.post('/process', {
        name: form.name, email: form.email,
        amount: 2999, currency: 'INR'
      })
      setSuccess(true)
      setTimeout(() => router.push('/'), 3000)
    } catch {
      setSuccess(true)
      setTimeout(() => router.push('/'), 3000)
    } finally {
      setLoading(false)
    }
  }

  if (success) return (
    <div style={{ textAlign: 'center', padding: '100px 20px' }}>
      <div style={{ fontSize: 64 }}>✅</div>
      <h2 style={{ fontSize: 28, fontWeight: 800, marginTop: 16 }}>Order Placed!</h2>
      <p style={{ color: '#888', marginTop: 8 }}>Redirecting to home...</p>
    </div>
  )

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: 500, margin: '60px auto', padding: '0 24px' }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 32 }}>Checkout</h1>
        <div style={{ background: '#fff', borderRadius: 12, padding: 32, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
          {['name', 'email', 'card', 'expiry', 'cvv'].map(field => (
            <div key={field} style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: 6, textTransform: 'capitalize' }}>
                {field === 'card' ? 'Card Number' : field === 'cvv' ? 'CVV' : field}
              </label>
              <input
                type={field === 'cvv' ? 'password' : 'text'}
                placeholder={field === 'card' ? '•••• •••• •••• ••••' : field === 'expiry' ? 'MM/YY' : ''}
                value={form[field]}
                onChange={e => setForm(p => ({ ...p, [field]: e.target.value }))}
                style={{
                  width: '100%', padding: '12px 14px', borderRadius: 8,
                  border: '1.5px solid #e0e0e0', fontSize: 15, outline: 'none'
                }}
              />
            </div>
          ))}
          <button
            onClick={handlePay}
            disabled={loading}
            style={{
              width: '100%', padding: '14px 0', background: '#111', color: '#fff',
              border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 16
            }}
          >
            {loading ? 'Processing...' : 'Pay ₹2,999'}
          </button>
        </div>
      </div>
    </>
  )
}
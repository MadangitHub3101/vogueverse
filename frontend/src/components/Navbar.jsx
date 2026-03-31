'use client'
import Link from 'next/link'
import { useState } from 'react'

export default function Navbar({ cartCount = 0, wishCount = 0 }) {
  return (
    <nav style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '16px 40px', background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
      position: 'sticky', top: 0, zIndex: 100
    }}>
      <Link href="/" style={{ fontSize: 24, fontWeight: 800, letterSpacing: 2 }}>
        VOGUEVERSE
      </Link>
      <div style={{ display: 'flex', gap: 28, fontSize: 15 }}>
        <Link href="/">Home</Link>
        <Link href="/search">Search</Link>
        <Link href="/wishlist">Wishlist {wishCount > 0 && `(${wishCount})`}</Link>
        <Link href="/cart">Cart {cartCount > 0 && `(${cartCount})`}</Link>
      </div>
    </nav>
  )
}
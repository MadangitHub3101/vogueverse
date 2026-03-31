import axios from 'axios'

const BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost'

export const cartAPI = axios.create({ baseURL: `${BASE}/api/cart` })
export const searchAPI = axios.create({ baseURL: `${BASE}/api/search` })
export const paymentAPI = axios.create({ baseURL: `${BASE}/api/pay` })
export const wishlistAPI = axios.create({ baseURL: `${BASE}/api/wishlist` })
export const recAPI = axios.create({ baseURL: `${BASE}/api/rec` })
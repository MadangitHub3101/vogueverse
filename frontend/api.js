import axios from 'axios'

const BASE = process.env.NEXT_PUBLIC_API_BASE  // ALB DNS

export const api = {
  // Search microservice  :4002
  search:  (q, filters) =>
    axios.get(`${BASE}/api/search`, { params: { q, ...filters } }),

  // Cart microservice  :4001
  getCart:    ()       => axios.get(`${BASE}/api/cart`),
  addToCart:  (item)   => axios.post(`${BASE}/api/cart/items`, item),
  removeItem: (itemId) => axios.delete(`${BASE}/api/cart/items/${itemId}`),

  // Payment microservice  :4003
  checkout: (payload)  => axios.post(`${BASE}/api/pay/checkout`, payload),

  // Wishlist microservice  :4004
  getWishlist:    ()     => axios.get(`${BASE}/api/wishlist`),
  toggleWishlist: (id)   => axios.post(`${BASE}/api/wishlist/toggle`, { productId: id }),

  // Recommendation microservice  :4005
  getRecs: (userId)    => axios.get(`${BASE}/api/rec/${userId}`),

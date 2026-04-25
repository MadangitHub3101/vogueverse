import axios from 'axios'

export const cartAPI     = axios.create({ baseURL: process.env.NEXT_PUBLIC_CART_URL })
export const searchAPI   = axios.create({ baseURL: process.env.NEXT_PUBLIC_SEARCH_URL })
export const wishlistAPI = axios.create({ baseURL: process.env.NEXT_PUBLIC_WISHLIST_URL })
export const recAPI      = axios.create({ baseURL: process.env.NEXT_PUBLIC_REC_URL })

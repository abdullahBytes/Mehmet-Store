import { reactive, watch } from 'vue'
import catalog from '@/data/products.json'

function storedArray(key) {
  const value = localStorage.getItem(key)
  if (!value) return []

  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    localStorage.removeItem(key)
    return []
  }
}

export const shop = reactive({
  products: catalog,
  cart: storedArray('mehmet-cart'),
  wishlist: storedArray('mehmet-wishlist'),
})

watch(
  () => shop.cart,
  (value) => localStorage.setItem('mehmet-cart', JSON.stringify(value)),
  { deep: true },
)
watch(
  () => shop.wishlist,
  (value) => localStorage.setItem('mehmet-wishlist', JSON.stringify(value)),
  { deep: true },
)

export function cartCount() {
  return shop.cart.reduce((total, item) => total + item.quantity, 0)
}

export function cartSubtotal() {
  return shop.cart.reduce((total, item) => {
    const product = shop.products.find((entry) => entry.id === item.productId)
    return total + (product?.price ?? 0) * item.quantity
  }, 0)
}

export function addToCart(productId, color, size, quantity = 1) {
  const product = shop.products.find((entry) => entry.id === productId)
  if (!product || product.stock === 0) return
  const cartItem = shop.cart.find(
    (entry) => entry.productId === productId && entry.color === color && entry.size === size,
  )
  const alreadyInCart = cartItem?.quantity ?? 0
  const available = Math.max(product.stock - alreadyInCart, 0)
  if (!available) return
  if (cartItem) cartItem.quantity += Math.min(quantity, available)
  else shop.cart.push({ productId, color, size, quantity: Math.min(quantity, product.stock) })
}

export function updateQuantity(index, quantity) {
  const item = shop.cart[index]
  if (!item) return
  const product = shop.products.find((entry) => entry.id === item.productId)
  if (!product || product.stock < 1) {
    shop.cart.splice(index, 1)
    return
  }
  item.quantity = Math.max(1, Math.min(quantity, product.stock))
}

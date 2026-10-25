import storeConfig from '@/data/store.json'

export function money(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount || 0)
}

export function productImage(image, width = 900) {
  return `https://images.unsplash.com/${image}?auto=format&fit=crop&w=${width}&q=85`
}

export function stockLabel(product) {
  if (!product.stock) return 'Sold out'
  if (product.stock < 7) return `Low stock · ${product.stock} left`
  return 'In stock'
}

export function whatsAppLink(message) {
  return `https://wa.me/${storeConfig.whatsappNumber}?text=${encodeURIComponent(message)}`
}

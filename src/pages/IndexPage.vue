<template>
  <q-page class="store-page">
    <StoreHero @browse="scrollTo('collection')" />

    <section class="service-strip" aria-label="Store benefits">
      <div><q-icon name="local_shipping" /><span>Free delivery over 5000pkr</span></div>
      <div><q-icon name="payments" /><span>Pay safely on delivery</span></div>
      <div><q-icon name="autorenew" /><span>Easy 14-day returns</span></div>
    </section>

    <ProductCatalog
      :products="filteredProducts"
      :wishlist="shop.wishlist"
      :categories="categories"
      :active-category="activeCategory"
      :search-query="searchQuery"
      :sort-order="sortOrder"
      :wishlist-only="wishlistOnly"
      @update:active-category="activeCategory = $event"
      @update:search-query="searchQuery = $event"
      @update:sort-order="sortOrder = $event"
      @clear-wishlist-filter="wishlistOnly = false"
      @select-product="selectProduct"
      @toggle-wishlist="toggleWishlist"
      @reset-filters="resetFilters"
    />

    <BrandStory @browse="scrollTo('collection')" />
    <WhatsAppContact :contact-link="storeContactLink" />

    <CartDrawer v-model="cartOpen" @checkout="openCheckout" />
    <ProductDetailDialog
      v-model="productOpen"
      :product="selectedProduct"
      @add-to-cart="addSelectedToCart"
    />
    <WhatsAppCheckoutDialog v-model="checkoutOpen" @show-cart="cartOpen = true" />
  </q-page>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useQuasar } from 'quasar'
import storeConfig from '@/data/store.json'
import { addToCart, shop } from '@/stores/shop'
import { whatsAppLink } from '@/utils/store'
import BrandStory from '@/components/store/BrandStory.vue'
import CartDrawer from '@/components/store/CartDrawer.vue'
import ProductCatalog from '@/components/store/ProductCatalog.vue'
import ProductDetailDialog from '@/components/store/ProductDetailDialog.vue'
import StoreHero from '@/components/store/StoreHero.vue'
import WhatsAppCheckoutDialog from '@/components/store/WhatsAppCheckoutDialog.vue'
import WhatsAppContact from '@/components/store/WhatsAppContact.vue'

const $q = useQuasar()
const categories = ['Everything', 'Watches', 'Underwear']
const activeCategory = ref('Everything')
const searchQuery = ref('')
const wishlistOnly = ref(false)
const sortOrder = ref('featured')
const cartOpen = ref(false)
const productOpen = ref(false)
const checkoutOpen = ref(false)
const selectedProduct = ref(null)

const filteredProducts = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  let products = shop.products.filter((product) => {
    const categoryMatches =
      activeCategory.value === 'Everything' || product.category === activeCategory.value
    const searchableText = `${product.name} ${product.category} ${product.colors
      .map((color) => color.name)
      .join(' ')}`
    const queryMatches = !query || searchableText.toLowerCase().includes(query)
    const wishlistMatches = !wishlistOnly.value || shop.wishlist.includes(product.id)
    return categoryMatches && queryMatches && wishlistMatches
  })

  if (sortOrder.value === 'price-asc') products = [...products].sort((a, b) => a.price - b.price)
  if (sortOrder.value === 'price-desc') products = [...products].sort((a, b) => b.price - a.price)
  return products
})
const storeContactLink = computed(() =>
  whatsAppLink(`Hello ${storeConfig.name}, I have a question about your store.`),
)

function selectProduct(product) {
  selectedProduct.value = product
  productOpen.value = true
}

function addSelectedToCart({ productId, color, size }) {
  addToCart(productId, color, size)
  cartOpen.value = true
}

function toggleWishlist(productId) {
  const index = shop.wishlist.indexOf(productId)
  if (index === -1) shop.wishlist.push(productId)
  else shop.wishlist.splice(index, 1)

  $q.notify({
    message: index === -1 ? 'Saved to your wishlist' : 'Removed from your wishlist',
    color: 'dark',
    position: 'bottom',
    timeout: 1400,
  })
}

function resetFilters() {
  activeCategory.value = 'Everything'
  searchQuery.value = ''
  wishlistOnly.value = false
}

function openCheckout() {
  cartOpen.value = false
  checkoutOpen.value = true
}

function scrollTo(section) {
  document.querySelector(`#${section}`)?.scrollIntoView({ behavior: 'smooth' })
}

function onOpenCart() {
  cartOpen.value = true
}

function onShowWishlist() {
  activeCategory.value = 'Everything'
  searchQuery.value = ''
  wishlistOnly.value = true
  window.setTimeout(() => scrollTo('collection'), 50)
}

function onSetCategory(event) {
  activeCategory.value = event.detail
  wishlistOnly.value = false
  window.setTimeout(() => scrollTo('collection'), 50)
}

onMounted(() => {
  window.addEventListener('shop:open-cart', onOpenCart)
  window.addEventListener('shop:show-wishlist', onShowWishlist)
  window.addEventListener('shop:set-category', onSetCategory)
})

onUnmounted(() => {
  window.removeEventListener('shop:open-cart', onOpenCart)
  window.removeEventListener('shop:show-wishlist', onShowWishlist)
  window.removeEventListener('shop:set-category', onSetCategory)
})
</script>

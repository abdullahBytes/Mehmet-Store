<template>
  <q-page class="store-page">
    <section class="hero-section">
      <img
        class="hero-image"
        src="https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=2200&q=88"
        alt=""
      />
      <div class="hero-shade"></div>
      <div class="hero-content">
        <span class="eyebrow hero-eyebrow">THE EVERYDAY, CONSIDERED</span>
        <h1>Made to be<br />lived in.</h1>
        <p>Thoughtful watches and everyday essentials.<br />The things you reach for, every day.</p>
        <button class="button button-light" @click="scrollTo('collection')">Explore the collection <span>↗</span></button>
      </div>
      <span class="hero-index">01 — 03</span>
      <span class="hero-side-note">EST. FOR THE EVERYDAY</span>
    </section>

    <section class="service-strip" aria-label="Store benefits">
      <div><q-icon name="local_shipping" /><span>Free delivery over 5000pkr</span></div>
      <div><q-icon name="payments" /><span>Pay safely on delivery</span></div>
      <div><q-icon name="autorenew" /><span>Easy 14-day returns</span></div>
    </section>

    <section id="collection" class="collection-section">
      <div class="section-heading">
        <div>
          <span class="eyebrow">THE MEHMET EDIT</span>
          <h2>Considered essentials</h2>
          <p>Made with intention. Chosen to last.</p>
        </div>
        <div class="collection-tools">
          <label class="search-field">
            <q-icon name="search" />
            <input id="store-search" v-model="searchQuery" type="search" placeholder="Find your thing" />
          </label>
          <q-select
            v-model="sortOrder"
            class="sort-select"
            dense
            borderless
            emit-value
            map-options
            :options="sortOptions"
            aria-label="Sort products"
          />
        </div>
      </div>

      <div class="collection-toolbar">
        <div class="category-tabs" aria-label="Filter products by category">
          <button
            v-for="category in categories"
            :key="category"
            class="category-tab"
            :class="{ active: activeCategory === category }"
            @click="activeCategory = category"
          >
            {{ category }}
          </button>
        </div>
        <button v-if="wishlistOnly" class="wishlist-filter" @click="wishlistOnly = false">
          Showing saved pieces <span>×</span>
        </button>
        <span v-else class="result-count">{{ filteredProducts.length }} considered pieces</span>
      </div>

      <div v-if="filteredProducts.length" class="product-grid">
        <article v-for="product in filteredProducts" :key="product.id" class="product-card">
          <div class="product-image-wrap" @click="openProduct(product)">
            <q-img
              class="product-image"
              :src="productImage(product.images[0], 760)"
              :alt="product.name"
              ratio="0.82"
              fit="cover"
              loading="lazy"
            >
              <template #loading>
                <div class="image-loader"><q-spinner color="dark" size="24px" /></div>
              </template>
            </q-img>
            <span class="product-badge" :class="{ 'badge-out': !product.stock }">
              {{ product.stock === 0 ? 'SOLD OUT' : product.stock < 7 ? 'LOW STOCK' : product.badge }}
            </span>
            <button
              class="wishlist-button"
              :aria-label="isWishlisted(product.id) ? 'Remove from wishlist' : 'Add to wishlist'"
              @click.stop="toggleWishlist(product.id)"
            >
              <q-icon :name="isWishlisted(product.id) ? 'favorite' : 'favorite_border'" />
            </button>
            <button class="quick-view" @click.stop="openProduct(product)">Quick view <span>↗</span></button>
          </div>
          <div class="product-card-copy">
            <div class="product-name-line">
              <button class="product-title" @click="openProduct(product)">{{ product.name }}</button>
            </div>
            <span class="product-category">{{ product.category }} <span>·</span> {{ product.colors.length }} colors</span>
            <div class="price-line">
              <span class="product-price">{{ money(product.price) }}</span>
              <span v-if="product.compareAt" class="compare-price">{{ money(product.compareAt) }}</span>
              <span class="stock-note" :class="{ 'stock-low': product.stock > 0 && product.stock < 7, 'stock-out': !product.stock }">
                {{ stockLabel(product) }}
              </span>
            </div>
          </div>
        </article>
      </div>
      <div v-else class="empty-results">
        <q-icon name="search_off" />
        <h3>No pieces found</h3>
        <p>Try another search or browse the complete collection.</p>
        <button class="text-button" @click="resetFilters">Show everything <span>↗</span></button>
      </div>
    </section>

    <section class="story-section" id="story">
      <div class="story-image">
        <img
          src="https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1200&q=85"
          alt="A thoughtfully arranged everyday wardrobe"
          loading="lazy"
        />
        <span class="image-caption">A LITTLE LESS, A LOT BETTER.</span>
      </div>
      <div class="story-copy">
        <span class="eyebrow">A NOTE ON HOW WE MAKE</span>
        <h2>Less, but<br />better.</h2>
        <p>
          We believe the best things are the ones you forget you're wearing. We make a small
          collection of considered essentials, choosing comfort, honest materials, and details that
          earn their place in your day.
        </p>
        <button class="underlined-link" @click="scrollTo('collection')">Find your everyday <span>↗</span></button>
        <span class="story-mark">M.</span>
      </div>
    </section>

    <section class="newsletter-section">
      <span class="eyebrow">A GOOD THING, EVERY NOW AND THEN</span>
      <h2>Talk to Mehmet.</h2>
      <p>Questions about a product or your order? Our team is happy to help directly.</p>
      <a class="button button-dark" :href="storeContactLink" target="_blank" rel="noopener noreferrer">
        Message us on WhatsApp <span>↗</span>
      </a>
      <span class="newsletter-note">No mailing list or account needed.</span>
    </section>

    <q-drawer
      v-model="cartOpen"
      side="right"
      overlay
      bordered
      :width="430"
      class="cart-drawer"
      aria-label="Shopping bag"
    >
      <div class="drawer-heading">
        <div>
          <span class="eyebrow">YOUR SELECTION</span>
          <h2>Your bag <span>({{ cartCount() }})</span></h2>
        </div>
        <q-btn flat round dense icon="close" aria-label="Close bag" @click="cartOpen = false" />
      </div>
      <div v-if="shop.cart.length" class="cart-content">
        <div class="delivery-progress">
          <span>{{ cartSubtotal() >= 100 ? 'You have complimentary delivery' : `You are ${money(100 - cartSubtotal())} away from complimentary delivery` }}</span>
          <div class="progress-track"><span :style="{ width: `${Math.min((cartSubtotal() / 100) * 100, 100)}%` }"></span></div>
        </div>
        <div class="cart-items">
          <article v-for="(item, index) in shop.cart" :key="`${item.productId}-${item.color}-${item.size}`" class="cart-item">
            <q-img :src="productImage(cartProduct(item.productId)?.images[0] || 'photo-1524805444758-089113d48a6d', 260)" :alt="cartProduct(item.productId)?.name || 'Product'" ratio="0.78" fit="cover" />
            <div class="cart-item-copy">
              <div class="cart-item-heading">
                <div>
                  <h3>{{ cartProduct(item.productId)?.name || 'Unavailable product' }}</h3>
                  <span>{{ item.color }} <span v-if="item.size">· {{ item.size }}</span></span>
                </div>
                <button class="remove-button" aria-label="Remove item" @click="removeFromCart(index)">×</button>
              </div>
              <span class="cart-price">{{ money((cartProduct(item.productId)?.price || 0) * item.quantity) }}</span>
              <div class="quantity-stepper">
                <button aria-label="Decrease quantity" @click="changeQuantity(index, item.quantity - 1)">−</button>
                <span>{{ item.quantity }}</span>
                <button aria-label="Increase quantity" :disabled="item.quantity >= (cartProduct(item.productId)?.stock || 1)" @click="changeQuantity(index, item.quantity + 1)">+</button>
              </div>
            </div>
          </article>
        </div>
        <div class="cart-summary">
          <div><span>Subtotal</span><strong>{{ money(cartSubtotal()) }}</strong></div>
          <div><span>Delivery</span><strong>{{ cartSubtotal() >= 100 ? 'Complimentary' : 'Confirm on WhatsApp' }}</strong></div>
          <p>Cash on delivery · Confirm your order with us on WhatsApp</p>
          <button class="button button-dark full-width" @click="openCheckout">Continue to checkout <span>↗</span></button>
          <button class="text-button continue-button" @click="cartOpen = false">Continue exploring</button>
        </div>
      </div>
      <div v-else class="empty-cart">
        <q-icon name="shopping_bag" />
        <h3>Your bag is taking a breather.</h3>
        <p>Find a considered essential for your everyday.</p>
        <button class="button button-dark" @click="cartOpen = false">Explore the collection <span>↗</span></button>
      </div>
    </q-drawer>

    <q-dialog v-model="productOpen" maximized-transition-show="fade" maximized-transition-hide="fade">
      <q-card class="product-dialog">
        <q-btn class="dialog-close" flat round icon="close" aria-label="Close product details" @click="productOpen = false" />
        <div v-if="selectedProduct" class="product-detail-layout">
          <div class="detail-gallery">
            <q-img :src="productImage(selectedProduct.colors[activeColorIndex]?.image || selectedProduct.images[activeImageIndex], 1300)" :alt="selectedProduct.name" class="detail-main-image" :class="{ zoomed: imageZoomed }" fit="cover" @click="imageZoomed = !imageZoomed">
              <template #loading><div class="image-loader"><q-spinner color="dark" size="28px" /></div></template>
            </q-img>
            <div class="gallery-thumbnails">
              <button v-for="(image, index) in selectedProduct.images" :key="`${image}-${index}`" :class="{ selected: activeImageIndex === index }" :aria-label="`View product image ${index + 1}`" @click="activeImageIndex = index; activeColorIndex = Math.min(index, selectedProduct.colors.length - 1); imageZoomed = false">
                <img :src="productImage(image, 180)" :alt="`${selectedProduct.name} view ${index + 1}`" />
              </button>
            </div>
            <div class="zoom-hint"><q-icon name="zoom_in" /> Select an image to explore the details</div>
          </div>
          <div class="detail-copy">
            <span class="eyebrow">{{ selectedProduct.category }} · {{ selectedProduct.badge }}</span>
            <h2>{{ selectedProduct.name }}</h2>
            <div class="detail-price">{{ money(selectedProduct.price) }} <span v-if="selectedProduct.compareAt">{{ money(selectedProduct.compareAt) }}</span></div>
            <p class="detail-description">{{ selectedProduct.description }}</p>

            <div class="detail-choice">
              <div class="choice-label"><span>Color</span><strong>{{ selectedProduct.colors[activeColorIndex]?.name }}</strong></div>
              <div class="swatch-list">
                <button v-for="(color, index) in selectedProduct.colors" :key="color.name" class="color-swatch" :class="{ selected: activeColorIndex === index }" :style="{ '--swatch-color': color.hex }" :aria-label="`Select ${color.name}`" :title="color.name" @click="activeColorIndex = index; activeImageIndex = Math.min(index, selectedProduct.images.length - 1); imageZoomed = false"></button>
              </div>
            </div>
            <div v-if="selectedProduct.sizes.length > 1" class="detail-choice">
              <div class="choice-label"><span>Size</span><button class="text-button" @click="sizeGuideOpen = true">Size guide <span>↗</span></button></div>
              <div class="size-list">
                <button v-for="size in selectedProduct.sizes" :key="size" :class="{ selected: selectedSize === size }" @click="selectedSize = size">{{ size }}</button>
              </div>
            </div>
            <div v-else class="size-guide-line"><button class="text-button" @click="sizeGuideOpen = true">View dimensions <span>↗</span></button></div>
            <div class="detail-stock" :class="{ 'stock-low': selectedProduct.stock > 0 && selectedProduct.stock < 7, 'stock-out': selectedProduct.stock === 0 }">
              <span class="stock-dot"></span>{{ stockLabel(selectedProduct) }}
            </div>
            <button v-if="selectedProduct.stock" class="button button-dark full-width add-to-bag" @click="addSelectedToCart">Add to bag <span>↗</span><strong>{{ money(selectedProduct.price) }}</strong></button>
            <div v-else class="notify-panel">
              <p>This piece is currently sold out. Ask us on WhatsApp when it may be available again.</p>
              <a class="button button-dark" :href="restockLink(selectedProduct)" target="_blank" rel="noopener noreferrer">Ask about restock <span>↗</span></a>
            </div>
            <div class="detail-promises"><div><q-icon name="payments" /> Pay cash on delivery</div><div><q-icon name="autorenew" /> Easy 14-day returns</div></div>
          </div>
        </div>
      </q-card>
    </q-dialog>

    <q-dialog v-model="checkoutOpen">
      <q-card class="checkout-dialog">
        <div class="checkout-heading">
          <div><span class="eyebrow">SIMPLE, DIRECT, PERSONAL</span><h2>Order via WhatsApp</h2><p>Review your details and send your order straight to our team.</p></div>
          <q-btn flat round dense icon="close" aria-label="Close checkout" @click="checkoutOpen = false" />
        </div>
        <q-form class="checkout-form" @submit="orderViaWhatsApp">
          <div class="checkout-section-title"><span>01</span> Your details <small>Guest checkout</small></div>
          <div class="form-row">
            <q-input v-model="checkout.name" outlined dense label="Full name *" autocomplete="name" :rules="[requiredRule]" />
            <q-input v-model="checkout.phone" outlined dense label="Active phone number *" type="tel" autocomplete="tel" :rules="[requiredRule, phoneRule]" />
          </div>
          <q-input v-model="checkout.address" outlined dense label="Delivery address *" autocomplete="street-address" :rules="[requiredRule]" />
          <div class="form-row">
            <q-input v-model="checkout.city" outlined dense label="City *" autocomplete="address-level2" :rules="[requiredRule]" />
            <q-input v-model="checkout.postalCode" outlined dense label="Postal code *" autocomplete="postal-code" :rules="[requiredRule]" />
          </div>
          <q-input v-model="checkout.notes" outlined dense label="Delivery notes (optional)" type="textarea" autogrow />
          <div class="checkout-order-summary">
            <div><span>{{ cartCount() }} items · Subtotal</span><strong>{{ money(cartSubtotal()) }}</strong></div>
            <div><span>Delivery</span><strong>{{ cartSubtotal() >= 100 ? 'Complimentary' : 'Confirm on WhatsApp' }}</strong></div>
            <div class="checkout-total"><span>{{ cartSubtotal() >= 100 ? 'Total · Cash on delivery' : 'Subtotal · delivery confirmed in WhatsApp' }}</span><strong>{{ money(cartSubtotal()) }}</strong></div>
          </div>
          <button class="button button-dark full-width checkout-submit" type="submit" :disabled="!shop.cart.length">Order via WhatsApp <span>↗</span></button>
          <div class="checkout-assurance"><q-icon name="chat" /> Review your order and tap Send in WhatsApp to place it.</div>
        </q-form>
      </q-card>
    </q-dialog>


    <q-dialog v-model="sizeGuideOpen">
      <q-card class="size-guide-dialog">
        <div class="checkout-heading"><div><span class="eyebrow">THE RIGHT FIT, EVERY TIME</span><h2>A quick size guide</h2></div><q-btn flat round dense icon="close" aria-label="Close size guide" @click="sizeGuideOpen = false" /></div>
        <p>Our pieces are designed for a comfortable, true-to-size fit. Between sizes? We recommend sizing up.</p>
        <table class="size-table">
          <thead><tr><th>Size</th><th>Waist (in)</th><th>Watch case</th></tr></thead>
          <tbody><tr><td>S</td><td>28–30</td><td>36–38mm</td></tr><tr><td>M</td><td>31–33</td><td>38–40mm</td></tr><tr><td>L</td><td>34–36</td><td>40–42mm</td></tr><tr><td>XL</td><td>37–39</td><td>42mm+</td></tr></tbody>
        </table>
        <span class="size-guide-foot">Questions about fit? Our team would love to help.</span>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'
import { useQuasar } from 'quasar'
import storeConfig from '@/data/store.json'
import {
  addToCart,
  cartCount,
  cartSubtotal,
  productImage,
  shop,
  updateQuantity,
} from '@/stores/shop'

const $q = useQuasar()
const categories = ['Everything', 'Watches', 'Underwear']
const sortOptions = [
  { label: 'Featured', value: 'featured' },
  { label: 'Price: low to high', value: 'price-asc' },
  { label: 'Price: high to low', value: 'price-desc' },
]
const activeCategory = ref('Everything')
const searchQuery = ref('')
const wishlistOnly = ref(false)
const sortOrder = ref('featured')
const cartOpen = ref(false)
const productOpen = ref(false)
const checkoutOpen = ref(false)
const sizeGuideOpen = ref(false)
const selectedProduct = ref(null)
const activeColorIndex = ref(0)
const activeImageIndex = ref(0)
const imageZoomed = ref(false)
const selectedSize = ref('')
const checkout = reactive({
  name: '',
  phone: '',
  address: '',
  city: '',
  postalCode: '',
  notes: '',
})

const filteredProducts = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  let products = shop.products.filter((product) => {
    const categoryMatches = activeCategory.value === 'Everything' || product.category === activeCategory.value
    const queryMatches = !query || `${product.name} ${product.category} ${product.colors.map((color) => color.name).join(' ')}`.toLowerCase().includes(query)
    const wishlistMatches = !wishlistOnly.value || shop.wishlist.includes(product.id)
    return categoryMatches && queryMatches && wishlistMatches
  })
  if (sortOrder.value === 'price-asc') products = [...products].sort((a, b) => a.price - b.price)
  if (sortOrder.value === 'price-desc') products = [...products].sort((a, b) => b.price - a.price)
  return products
})
const whatsAppLink = computed(() => {
  const items = shop.cart.map((item) => {
    const product = cartProduct(item.productId)
    const variant = [item.color, item.size].filter(Boolean).join(' / ')
    return `• ${product?.name || 'Unavailable product'} × ${item.quantity}${variant ? ` (${variant})` : ''} — ${money((product?.price || 0) * item.quantity)}`
  })
  const message = [
    `Hello ${storeConfig.name}, I’d like to place an order:`,
    '',
    ...items,
    '',
    `Subtotal: ${money(cartSubtotal())}`,
    cartSubtotal() >= 100 ? 'Delivery: Complimentary' : 'Delivery: Please confirm the delivery charge',
    'Payment: Cash on delivery',
    '',
    'Customer details:',
    `Name: ${checkout.name.trim()}`,
    `Phone: ${checkout.phone.trim()}`,
    `Address: ${checkout.address.trim()}`,
    `City: ${checkout.city.trim()}`,
    `Postal code: ${checkout.postalCode.trim()}`,
    checkout.notes.trim() ? `Notes: ${checkout.notes.trim()}` : '',
  ].filter(Boolean).join('\n')
  return `https://wa.me/${storeConfig.whatsappNumber}?text=${encodeURIComponent(message)}`
})
const storeContactLink = computed(() => whatsAppMessageLink(`Hello ${storeConfig.name}, I have a question about your store.`))

function money(amount) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount)
}

function stockLabel(product) {
  if (!product.stock) return 'Sold out'
  if (product.stock < 7) return `Low stock · ${product.stock} left`
  return 'In stock'
}

function cartProduct(productId) {
  return shop.products.find((product) => product.id === productId)
}

function isWishlisted(productId) {
  return shop.wishlist.includes(productId)
}

function toggleWishlist(productId) {
  const index = shop.wishlist.indexOf(productId)
  if (index === -1) shop.wishlist.push(productId)
  else shop.wishlist.splice(index, 1)
  $q.notify({ message: index === -1 ? 'Saved to your wishlist' : 'Removed from your wishlist', color: 'dark', position: 'bottom', timeout: 1400 })
}

function openProduct(product) {
  selectedProduct.value = product
  activeColorIndex.value = 0
  activeImageIndex.value = 0
  imageZoomed.value = false
  selectedSize.value = product.sizes[0] || ''
  productOpen.value = true
}

function addSelectedToCart() {
  if (!selectedProduct.value) return
  addToCart(
    selectedProduct.value.id,
    selectedProduct.value.colors[activeColorIndex.value]?.name || '',
    selectedSize.value,
  )
  cartOpen.value = true
  productOpen.value = false
}

function changeQuantity(index, quantity) {
  updateQuantity(index, quantity)
}

function removeFromCart(index) {
  shop.cart.splice(index, 1)
}

function resetFilters() {
  activeCategory.value = 'Everything'
  searchQuery.value = ''
  wishlistOnly.value = false
}

function scrollTo(section) {
  document.querySelector(`#${section}`)?.scrollIntoView({ behavior: 'smooth' })
}

function whatsAppMessageLink(message) {
  return `https://wa.me/${storeConfig.whatsappNumber}?text=${encodeURIComponent(message)}`
}

function restockLink(product) {
  return whatsAppMessageLink(`Hello ${storeConfig.name}, please let me know if ${product.name} becomes available again.`)
}

function openCheckout() {
  checkoutOpen.value = true
}

const requiredRule = (value) => !!String(value || '').trim() || 'This field is required'
const phoneRule = (value) => /^[+()\d\s.-]{7,20}$/.test(value || '') || 'Enter a valid phone number'

function orderViaWhatsApp() {
  const unavailableItem = shop.cart.find((item) => {
    const product = cartProduct(item.productId)
    return !product || product.stock < item.quantity
  })
  if (unavailableItem) {
    $q.notify({ message: 'A cart item is no longer available in that quantity. Please update your bag.', color: 'negative', position: 'bottom' })
    checkoutOpen.value = false
    cartOpen.value = true
    return
  }
  window.location.assign(whatsAppLink.value)
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

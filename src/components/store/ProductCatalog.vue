<template>
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
          <input
            id="store-search"
            :value="searchQuery"
            type="search"
            placeholder="Find your thing"
            @input="$emit('update:searchQuery', $event.target.value)"
          />
        </label>
        <q-select
          :model-value="sortOrder"
          class="sort-select"
          dense
          borderless
          emit-value
          map-options
          :options="sortOptions"
          aria-label="Sort products"
          @update:model-value="$emit('update:sortOrder', $event)"
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
          @click="$emit('update:activeCategory', category)"
        >
          {{ category }}
        </button>
      </div>
      <button v-if="wishlistOnly" class="wishlist-filter" @click="$emit('clear-wishlist-filter')">
        Showing saved pieces <span>×</span>
      </button>
      <span v-else class="result-count">{{ products.length }} considered pieces</span>
    </div>

    <div v-if="products.length" class="product-grid">
      <article v-for="product in products" :key="product.id" class="product-card">
        <div class="product-image-wrap" @click="$emit('select-product', product)">
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
            @click.stop="$emit('toggle-wishlist', product.id)"
          >
            <q-icon :name="isWishlisted(product.id) ? 'favorite' : 'favorite_border'" />
          </button>
          <button class="quick-view" @click.stop="$emit('select-product', product)">
            Quick view <span>↗</span>
          </button>
        </div>
        <div class="product-card-copy">
          <div class="product-name-line">
            <button class="product-title" @click="$emit('select-product', product)">
              {{ product.name }}
            </button>
          </div>
          <span class="product-category">
            {{ product.category }} <span>·</span> {{ product.colors.length }} colors
          </span>
          <div class="price-line">
            <span class="product-price">{{ money(product.price) }}</span>
            <span v-if="product.compareAt" class="compare-price">{{ money(product.compareAt) }}</span>
            <span
              class="stock-note"
              :class="{
                'stock-low': product.stock > 0 && product.stock < 7,
                'stock-out': !product.stock,
              }"
            >
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
      <button class="text-button" @click="$emit('reset-filters')">Show everything <span>↗</span></button>
    </div>
  </section>
</template>

<script setup>
import { productImage, money, stockLabel } from '@/utils/store'

const props = defineProps({
  products: { type: Array, required: true },
  wishlist: { type: Array, required: true },
  categories: { type: Array, required: true },
  activeCategory: { type: String, required: true },
  searchQuery: { type: String, required: true },
  sortOrder: { type: String, required: true },
  wishlistOnly: { type: Boolean, default: false },
})

defineEmits([
  'update:activeCategory',
  'update:searchQuery',
  'update:sortOrder',
  'clear-wishlist-filter',
  'select-product',
  'toggle-wishlist',
  'reset-filters',
])

const sortOptions = [
  { label: 'Featured', value: 'featured' },
  { label: 'Price: low to high', value: 'price-asc' },
  { label: 'Price: high to low', value: 'price-desc' },
]

function isWishlisted(productId) {
  return props.wishlist.includes(productId)
}
</script>

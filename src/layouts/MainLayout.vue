<template>
  <q-layout view="hHh lpR fFf" class="store-layout">
    <div class="announcement-bar">
      Complimentary delivery on all orders over 5000pkr
      <span class="announcement-separator">·</span>
      Thoughtful essentials, delivered with care
    </div>

    <q-header class="store-header">
      <q-toolbar class="store-toolbar">
        <q-btn
          flat
          round
          dense
          icon="menu"
          class="mobile-menu-button"
          aria-label="Open navigation"
          @click="menuOpen = !menuOpen"
        />
        <router-link to="/" class="brand-lockup">
          <span class="brand-name">MEHMET</span>
          <span class="brand-caption">OBJECTS FOR EVERY DAY</span>
        </router-link>

        <nav class="main-navigation" aria-label="Main navigation">
          <button @click="jumpTo('collection')">Shop all</button>
          <button @click="setCategory('Watches')">Watches</button>
          <button @click="setCategory('Underwear')">Underwear</button>
          <button @click="jumpTo('story')">Our story</button>
        </nav>

        <div class="header-actions">
          <q-btn flat round icon="search" aria-label="Search the store" @click="goSearch" />
          <q-btn
            flat
            round
            icon="favorite_border"
            aria-label="View wishlist"
            @click="goWishlist"
          >
            <q-badge v-if="wishlistCount" color="dark" floating>{{ wishlistCount }}</q-badge>
          </q-btn>
          <q-btn flat round icon="shopping_bag" aria-label="Open shopping bag" @click="openCart">
            <q-badge v-if="itemCount" color="dark" floating>{{ itemCount }}</q-badge>
          </q-btn>
        </div>
      </q-toolbar>
      <div v-if="menuOpen" class="mobile-navigation">
        <button @click="jumpTo('collection')">Shop all</button>
        <button @click="setCategory('Watches')">Watches</button>
        <button @click="setCategory('Underwear')">Underwear</button>
        <button @click="jumpTo('story')">Our story</button>
      </div>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <footer class="store-footer">
      <div class="footer-main">
        <div>
          <router-link to="/" class="brand-lockup footer-brand">
            <span class="brand-name">MEHMET</span>
            <span class="brand-caption">OBJECTS FOR EVERY DAY</span>
          </router-link>
          <p>Fewer, better things. Made for the everyday.</p>
        </div>
        <div class="footer-links">
          <button @click="jumpTo('collection')">Shop collection</button>
          <button @click="jumpTo('story')">Our story</button>
          <button @click="jumpTo('collection')">Browse the collection</button>
        </div>
        <div class="footer-note">
          <span>GOOD THINGS TAKE TIME.</span>
          <p>Every order is thoughtfully packed and sent with care.</p>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© 2026 Mehmet Store</span>
        <span>Secure cash on delivery · Always here to help</span>
      </div>
    </footer>
  </q-layout>
</template>

<script setup>
import { computed, nextTick, ref } from 'vue'
import { useRouter } from 'vue-router'
import { cartCount, shop } from '@/stores/shop'

const router = useRouter()
const menuOpen = ref(false)
const itemCount = computed(cartCount)
const wishlistCount = computed(() => shop.wishlist.length)

async function openCart() {
  await router.push('/')
  await nextTick()
  window.dispatchEvent(new CustomEvent('shop:open-cart'))
}

async function goSearch() {
  await router.push('/')
  await nextTick()
  document.querySelector('#store-search')?.focus()
  document.querySelector('#collection')?.scrollIntoView({ behavior: 'smooth' })
}

async function goWishlist() {
  await router.push('/')
  await nextTick()
  window.dispatchEvent(new CustomEvent('shop:show-wishlist'))
}

async function setCategory(category) {
  await router.push('/')
  await nextTick()
  window.dispatchEvent(new CustomEvent('shop:set-category', { detail: category }))
  menuOpen.value = false
}

async function jumpTo(section) {
  menuOpen.value = false
  await router.push('/')
  await nextTick()
  document.querySelector(`#${section}`)?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <q-drawer
    :model-value="modelValue"
    side="right"
    overlay
    bordered
    :width="430"
    class="cart-drawer"
    aria-label="Shopping bag"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <div class="drawer-heading">
      <div>
        <span class="eyebrow">YOUR SELECTION</span>
        <h2>Your bag <span>({{ cartCount() }})</span></h2>
      </div>
      <q-btn flat round dense icon="close" aria-label="Close bag" @click="close" />
    </div>
    <div v-if="shop.cart.length" class="cart-content">
      <div class="delivery-progress">
        <span>{{ deliveryMessage }}</span>
        <div class="progress-track">
          <span :style="{ width: `${Math.min((cartSubtotal() / freeDeliveryMinimum) * 100, 100)}%` }"></span>
        </div>
      </div>
      <div class="cart-items">
        <article
          v-for="(item, index) in shop.cart"
          :key="`${item.productId}-${item.color}-${item.size}`"
          class="cart-item"
        >
          <q-img
            :src="productImage(cartProduct(item.productId)?.images[0] || fallbackImage, 260)"
            :alt="cartProduct(item.productId)?.name || 'Product'"
            ratio="0.78"
            fit="cover"
          />
          <div class="cart-item-copy">
            <div class="cart-item-heading">
              <div>
                <h3>{{ cartProduct(item.productId)?.name || 'Unavailable product' }}</h3>
                <span>{{ item.color }} <span v-if="item.size">· {{ item.size }}</span></span>
              </div>
              <button class="remove-button" aria-label="Remove item" @click="removeItem(index)">×</button>
            </div>
            <span class="cart-price">
              {{ money((cartProduct(item.productId)?.price || 0) * item.quantity) }}
            </span>
            <div class="quantity-stepper">
              <button aria-label="Decrease quantity" @click="changeQuantity(index, item.quantity - 1)">
                −
              </button>
              <span>{{ item.quantity }}</span>
              <button
                aria-label="Increase quantity"
                :disabled="item.quantity >= (cartProduct(item.productId)?.stock || 1)"
                @click="changeQuantity(index, item.quantity + 1)"
              >
                +
              </button>
            </div>
          </div>
        </article>
      </div>
      <div class="cart-summary">
        <div><span>Subtotal</span><strong>{{ money(cartSubtotal()) }}</strong></div>
        <div>
          <span>Delivery</span>
          <strong>{{ hasFreeDelivery ? 'Complimentary' : 'Confirm on WhatsApp' }}</strong>
        </div>
        <p>Cash on delivery · Confirm your order with us on WhatsApp</p>
        <button class="button button-dark full-width" @click="$emit('checkout')">
          Continue to checkout <span>↗</span>
        </button>
        <button class="text-button continue-button" @click="close">Continue exploring</button>
      </div>
    </div>
    <div v-else class="empty-cart">
      <q-icon name="shopping_bag" />
      <h3>Your bag is taking a breather.</h3>
      <p>Find a considered essential for your everyday.</p>
      <button class="button button-dark" @click="close">Explore the collection <span>↗</span></button>
    </div>
  </q-drawer>
</template>

<script setup>
import { computed } from 'vue'
import { cartCount, cartSubtotal, shop, updateQuantity } from '@/stores/shop'
import { productImage } from '@/utils/store'
import { money } from '@/utils/store'

defineProps({
  modelValue: { type: Boolean, default: false },
})
const emit = defineEmits(['update:modelValue', 'checkout'])

const freeDeliveryMinimum = 5000
const fallbackImage = 'photo-1524805444758-089113d48a6d'
const hasFreeDelivery = computed(() => cartSubtotal() >= freeDeliveryMinimum)
const deliveryMessage = computed(() =>
  hasFreeDelivery.value
    ? 'You have complimentary delivery'
    : `You are ${money(freeDeliveryMinimum - cartSubtotal())} away from complimentary delivery`,
)

function cartProduct(productId) {
  return shop.products.find((product) => product.id === productId)
}

function changeQuantity(index, quantity) {
  updateQuantity(index, quantity)
}

function removeItem(index) {
  shop.cart.splice(index, 1)
}

function close() {
  emit('update:modelValue', false)
}
</script>

<template>
  <q-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)">
    <q-card class="checkout-dialog">
      <div class="checkout-heading">
        <div>
          <span class="eyebrow">SIMPLE, DIRECT, PERSONAL</span>
          <h2>Order via WhatsApp</h2>
          <p>Review your details and send your order straight to our team.</p>
        </div>
        <q-btn
          flat
          round
          dense
          icon="close"
          aria-label="Close checkout"
          @click="$emit('update:modelValue', false)"
        />
      </div>
      <q-form class="checkout-form" @submit="submitOrder">
        <div class="checkout-section-title"><span>01</span> Your details <small>Guest checkout</small></div>
        <div class="form-row">
          <q-input
            v-model="customer.name"
            outlined
            dense
            label="Full name *"
            autocomplete="name"
            :rules="[requiredRule]"
          />
          <q-input
            v-model="customer.phone"
            outlined
            dense
            label="Active phone number *"
            type="tel"
            autocomplete="tel"
            :rules="[requiredRule, phoneRule]"
          />
        </div>
        <q-input
          v-model="customer.address"
          outlined
          dense
          label="Delivery address *"
          autocomplete="street-address"
          :rules="[requiredRule]"
        />
        <div class="form-row">
          <q-input
            v-model="customer.city"
            outlined
            dense
            label="City *"
            autocomplete="address-level2"
            :rules="[requiredRule]"
          />
          <q-input
            v-model="customer.postalCode"
            outlined
            dense
            label="Postal code *"
            autocomplete="postal-code"
            :rules="[requiredRule]"
          />
        </div>
        <q-input
          v-model="customer.notes"
          outlined
          dense
          label="Delivery notes (optional)"
          type="textarea"
          autogrow
        />
        <div class="checkout-order-summary">
          <div><span>{{ cartCount() }} items · Subtotal</span><strong>{{ money(cartSubtotal()) }}</strong></div>
          <div>
            <span>Delivery</span>
            <strong>{{ hasFreeDelivery ? 'Complimentary' : 'Confirm on WhatsApp' }}</strong>
          </div>
          <div class="checkout-total">
            <span>
              {{ hasFreeDelivery ? 'Total · Cash on delivery' : 'Subtotal · delivery confirmed in WhatsApp' }}
            </span>
            <strong>{{ money(cartSubtotal()) }}</strong>
          </div>
        </div>
        <button
          class="button button-dark full-width checkout-submit"
          type="submit"
          :disabled="!shop.cart.length"
        >
          Order via WhatsApp <span>↗</span>
        </button>
        <div class="checkout-assurance">
          <q-icon name="chat" /> Review your order and tap Send in WhatsApp to place it.
        </div>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { computed, reactive } from 'vue'
import { useQuasar } from 'quasar'
import storeConfig from '@/data/store.json'
import { cartCount, cartSubtotal, shop } from '@/stores/shop'
import { money, whatsAppLink } from '@/utils/store'

defineProps({
  modelValue: { type: Boolean, default: false },
})
const emit = defineEmits(['update:modelValue', 'show-cart'])
const $q = useQuasar()
const freeDeliveryMinimum = 5000
const hasFreeDelivery = computed(() => cartSubtotal() >= freeDeliveryMinimum)
const customer = reactive({
  name: '',
  phone: '',
  address: '',
  city: '',
  postalCode: '',
  notes: '',
})

const requiredRule = (value) => !!String(value || '').trim() || 'This field is required'
const phoneRule = (value) =>
  /^[+()\d\s.-]{7,20}$/.test(value || '') || 'Enter a valid phone number'

function cartProduct(productId) {
  return shop.products.find((product) => product.id === productId)
}

function orderMessage() {
  const items = shop.cart.map((item) => {
    const product = cartProduct(item.productId)
    const variant = [item.color, item.size].filter(Boolean).join(' / ')
    return `• ${product?.name || 'Unavailable product'} × ${item.quantity}${variant ? ` (${variant})` : ''} — ${money((product?.price || 0) * item.quantity)}`
  })

  return [
    `Hello ${storeConfig.name}, I’d like to place an order:`,
    '',
    ...items,
    '',
    `Subtotal: ${money(cartSubtotal())}`,
    hasFreeDelivery.value
      ? 'Delivery: Complimentary'
      : 'Delivery: Please confirm the delivery charge',
    'Payment: Cash on delivery',
    '',
    'Customer details:',
    `Name: ${customer.name.trim()}`,
    `Phone: ${customer.phone.trim()}`,
    `Address: ${customer.address.trim()}`,
    `City: ${customer.city.trim()}`,
    `Postal code: ${customer.postalCode.trim()}`,
    customer.notes.trim() ? `Notes: ${customer.notes.trim()}` : '',
  ]
    .filter(Boolean)
    .join('\n')
}

function submitOrder() {
  const unavailableItem = shop.cart.find((item) => {
    const product = cartProduct(item.productId)
    return !product || product.stock < item.quantity
  })

  if (unavailableItem) {
    $q.notify({
      message: 'A cart item is no longer available in that quantity. Please update your bag.',
      color: 'negative',
      position: 'bottom',
    })
    emit('update:modelValue', false)
    emit('show-cart')
    return
  }

  window.location.assign(whatsAppLink(orderMessage()))
}
</script>

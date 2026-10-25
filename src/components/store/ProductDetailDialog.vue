<template>
  <q-dialog
    :model-value="modelValue"
    maximized-transition-show="fade"
    maximized-transition-hide="fade"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <q-card class="product-dialog">
      <q-btn
        class="dialog-close"
        flat
        round
        icon="close"
        aria-label="Close product details"
        @click="close"
      />
      <div v-if="product" class="product-detail-layout">
        <div class="detail-gallery">
          <q-img
            :src="productImage(selectedColor?.image || product.images[activeImageIndex], 1300)"
            :alt="product.name"
            class="detail-main-image"
            :class="{ zoomed: imageZoomed }"
            fit="cover"
            @click="imageZoomed = !imageZoomed"
          >
            <template #loading>
              <div class="image-loader"><q-spinner color="dark" size="28px" /></div>
            </template>
          </q-img>
          <div class="gallery-thumbnails">
            <button
              v-for="(image, index) in product.images"
              :key="`${image}-${index}`"
              :class="{ selected: activeImageIndex === index }"
              :aria-label="`View product image ${index + 1}`"
              @click="selectImage(index)"
            >
              <img :src="productImage(image, 180)" :alt="`${product.name} view ${index + 1}`" />
            </button>
          </div>
          <div class="zoom-hint"><q-icon name="zoom_in" /> Select an image to explore the details</div>
        </div>
        <div class="detail-copy">
          <span class="eyebrow">{{ product.category }} · {{ product.badge }}</span>
          <h2>{{ product.name }}</h2>
          <div class="detail-price">
            {{ money(product.price) }} <span v-if="product.compareAt">{{ money(product.compareAt) }}</span>
          </div>
          <p class="detail-description">{{ product.description }}</p>

          <div class="detail-choice">
            <div class="choice-label"><span>Color</span><strong>{{ selectedColor?.name }}</strong></div>
            <div class="swatch-list">
              <button
                v-for="(color, index) in product.colors"
                :key="color.name"
                class="color-swatch"
                :class="{ selected: activeColorIndex === index }"
                :style="{ '--swatch-color': color.hex }"
                :aria-label="`Select ${color.name}`"
                :title="color.name"
                @click="selectColor(index)"
              ></button>
            </div>
          </div>
          <div v-if="product.sizes.length > 1" class="detail-choice">
            <div class="choice-label">
              <span>Size</span>
              <button class="text-button" @click="sizeGuideOpen = true">
                Size guide <span>↗</span>
              </button>
            </div>
            <div class="size-list">
              <button
                v-for="size in product.sizes"
                :key="size"
                :class="{ selected: selectedSize === size }"
                @click="selectedSize = size"
              >
                {{ size }}
              </button>
            </div>
          </div>
          <div v-else class="size-guide-line">
            <button class="text-button" @click="sizeGuideOpen = true">View dimensions <span>↗</span></button>
          </div>
          <div
            class="detail-stock"
            :class="{
              'stock-low': product.stock > 0 && product.stock < 7,
              'stock-out': product.stock === 0,
            }"
          >
            <span class="stock-dot"></span>{{ stockLabel(product) }}
          </div>
          <button
            v-if="product.stock"
            class="button button-dark full-width add-to-bag"
            @click="addToCart"
          >
            Add to bag <span>↗</span><strong>{{ money(product.price) }}</strong>
          </button>
          <div v-else class="notify-panel">
            <p>This piece is currently sold out. Ask us on WhatsApp when it may be available again.</p>
            <a
              class="button button-dark"
              :href="restockLink"
              target="_blank"
              rel="noopener noreferrer"
            >
              Ask about restock <span>↗</span>
            </a>
          </div>
          <div class="detail-promises">
            <div><q-icon name="payments" /> Pay cash on delivery</div>
            <div><q-icon name="autorenew" /> Easy 14-day returns</div>
          </div>
        </div>
      </div>
    </q-card>
    <SizeGuideDialog v-model="sizeGuideOpen" />
  </q-dialog>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import storeConfig from '@/data/store.json'
import { money, productImage, stockLabel, whatsAppLink } from '@/utils/store'
import SizeGuideDialog from './SizeGuideDialog.vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  product: { type: Object, default: null },
})
const emit = defineEmits(['update:modelValue', 'add-to-cart'])

const activeColorIndex = ref(0)
const activeImageIndex = ref(0)
const imageZoomed = ref(false)
const selectedSize = ref('')
const sizeGuideOpen = ref(false)
const selectedColor = computed(() => props.product?.colors[activeColorIndex.value])
const restockLink = computed(() =>
  whatsAppLink(
    `Hello ${storeConfig.name}, please let me know if ${props.product?.name} becomes available again.`,
  ),
)

watch(
  () => props.product,
  (product) => {
    activeColorIndex.value = 0
    activeImageIndex.value = 0
    imageZoomed.value = false
    selectedSize.value = product?.sizes[0] || ''
  },
)

function selectImage(index) {
  activeImageIndex.value = index
  activeColorIndex.value = Math.min(index, props.product.colors.length - 1)
  imageZoomed.value = false
}

function selectColor(index) {
  activeColorIndex.value = index
  activeImageIndex.value = Math.min(index, props.product.images.length - 1)
  imageZoomed.value = false
}

function addToCart() {
  if (!props.product) return
  emit('add-to-cart', {
    productId: props.product.id,
    color: selectedColor.value?.name || '',
    size: selectedSize.value,
  })
  close()
}

function close() {
  emit('update:modelValue', false)
}
</script>

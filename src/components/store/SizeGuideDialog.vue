<template>
  <q-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)">
    <q-card class="size-guide-dialog">
      <div class="checkout-heading">
        <div>
          <span class="eyebrow">THE RIGHT FIT, EVERY TIME</span>
          <h2>A quick size guide</h2>
        </div>
        <q-btn
          flat
          round
          dense
          icon="close"
          aria-label="Close size guide"
          @click="$emit('update:modelValue', false)"
        />
      </div>
      <p>Our pieces are designed for a comfortable, true-to-size fit. Between sizes? We recommend sizing up.</p>
      <table class="size-table">
        <thead><tr><th>Size</th><th>Waist (in)</th><th>Watch case</th></tr></thead>
        <tbody>
          <tr><td>S</td><td>28–30</td><td>36–38mm</td></tr>
          <tr><td>M</td><td>31–33</td><td>38–40mm</td></tr>
          <tr><td>L</td><td>34–36</td><td>40–42mm</td></tr>
          <tr><td>XL</td><td>37–39</td><td>42mm+</td></tr>
        </tbody>
      </table>
      <span class="size-guide-foot">Questions about fit? Our team would love to help.</span>
    </q-card>
  </q-dialog>
</template>

<script setup>
defineProps({
  modelValue: { type: Boolean, default: false },
})

defineEmits(['update:modelValue'])
</script>

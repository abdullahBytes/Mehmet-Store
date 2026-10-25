<template>
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
      <button class="button button-light" @click="$emit('browse')">
        Explore the collection <span>↗</span>
      </button>
    </div>
    <span class="hero-index">01 — 03</span>
    <span class="hero-side-note">EST. FOR THE EVERYDAY</span>
  </section>
</template>

<script setup>
defineEmits(['browse'])
</script>

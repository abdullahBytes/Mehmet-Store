<template>
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
      <button class="underlined-link" @click="$emit('browse')">Find your everyday <span>↗</span></button>
      <span class="story-mark">M.</span>
    </div>
  </section>
</template>

<script setup>
defineEmits(['browse'])
</script>

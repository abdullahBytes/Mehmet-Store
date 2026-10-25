<template>
  <section class="newsletter-section">
    <span class="eyebrow">A GOOD THING, EVERY NOW AND THEN</span>
    <h2>Talk to Mehmet.</h2>
    <p>Questions about a product or your order? Our team is happy to help directly.</p>
    <a class="button button-dark" :href="contactLink" target="_blank" rel="noopener noreferrer">
      Message us on WhatsApp <span>↗</span>
    </a>
    <span class="newsletter-note">No mailing list or account needed.</span>
  </section>
</template>

<script setup>
defineProps({
  contactLink: { type: String, required: true },
})
</script>

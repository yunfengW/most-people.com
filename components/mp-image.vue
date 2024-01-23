<template>
  <img class="mp-image" loading="lazy" v-bind="$attrs" @error="error" />
</template>

<script setup lang="ts">
const error = (event: Event) => {
  const img = event.target as HTMLImageElement
  if (img) {
    img.src = '/favicon.ico'
  }
}
</script>

<template>
  <main>
    <mp-header :content="route.params.slug[0]" />
    <ContentDoc />
  </main>
</template>

<script setup lang="ts">
const route = useRoute()
</script>

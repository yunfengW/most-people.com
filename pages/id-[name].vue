<template>
  <div class="page-id-name">
    <mp-header :content="route.params.name" />
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
</script>

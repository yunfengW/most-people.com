<template>
  <div>
    <ContentRenderer :value="data" />
  </div>
</template>

<script setup>
const { data } = await useAsyncData('hello', () => queryContent('/hello').findOne())
</script>

<style>
div {
}
</style>

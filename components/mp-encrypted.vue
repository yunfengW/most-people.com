<template>
  <section>
    <div>{{ props.mi }}</div>
  </section>
</template>

<script setup lang="ts">
interface Props {
  mi: string
}
const props = withDefaults(defineProps<Props>(), { mi: '' })
const decrypted = ref('')
</script>

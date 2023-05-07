<template>
  <iconpark-icon :icon-id="props.name" class="mp-icon" :class="`mp-icon-${props.name}`" />
</template>

<script setup lang="ts">
// 使用指南 https://bytedance.feishu.cn/wiki/wikcnJZV45hM71QgI60iwkzvXob

interface Props {
  name: string
}

const props = withDefaults(defineProps<Props>(), {
  name: '',
})
</script>

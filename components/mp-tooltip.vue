<template>
  <el-tooltip
    v-bind="$attrs"
    :content="$props.tip"
    placement="top"
    effect="customized"
    :offset="7.5"
    trigger="click"
  >
    <slot />
  </el-tooltip>
</template>

<script setup lang="ts">
interface Props {
  tip: string
}

const $props = withDefaults(defineProps<Props>(), {
  tip: '',
})
</script>

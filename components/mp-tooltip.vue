<template>
  <div class="mp-tooltip">
    <slot />
    <span class="mp-tip">{{ $props.tip }}</span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  tip: string
}

const $props = withDefaults(defineProps<Props>(), {
  tip: '',
})
</script>

<style lang="scss">
.mp-tooltip {
  position: relative;
  transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);

  .mp-tip {
    display: none;
    position: absolute;
    bottom: calc(100% + 8px);
    left: 0;
    width: 100%;
    padding: 6px 12px;
    background: linear-gradient(90deg, rgb(159, 229, 151), rgb(204, 229, 129));
    border-radius: 4px;
    z-index: 100;

    &::before {
      position: absolute;
      left: calc(50% - 5px);
      bottom: -5px;
      width: 10px;
      height: 10px;
      z-index: -1;
      content: ' ';
      transform: rotate(45deg);
      background: linear-gradient(45deg, #b2e68d, #bce689);
      box-sizing: border-box;
    }
  }
}

.mp-tooltip {
  :first-child:hover {
    & ~ .mp-tip {
      display: block;
    }
  }
}
</style>

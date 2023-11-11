<template>
  <div class="mp-tooltip">
    <slot />
    <div class="mp-tip">
      <span>{{ $props.tip }}</span>
    </div>
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
    justify-content: center;
    position: absolute;
    bottom: calc(100% + 8px);
    left: 0;
    right: 0;
    z-index: 100;

    span {
      display: block;
      padding: 6px 12px;
      background: linear-gradient(90deg, rgb(159, 229, 151), rgb(204, 229, 129));
      border-radius: 4px;
    }

    &::before {
      position: absolute;
      left: calc(50% - 4px);
      bottom: -4px;
      width: 8px;
      height: 8px;
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
      display: flex;
    }
  }
}
</style>

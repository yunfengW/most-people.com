<template>
  <div id="app">
    <div class="mp-uid">UID 000 000 001</div>
    <nuxt-page />
  </div>
</template>

<style lang="scss">
@import url('~/assets/css/global.scss');

#app {
  > .mp-uid {
    position: fixed;
    right: 10px;
    bottom: 10px;
  }
}
</style>

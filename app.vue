<template>
  <div id="app">
    <nuxt-page />
    <div class="uid">UID 000 000 001</div>
  </div>
</template>

<style lang="scss">
html {
  background: rgb(241, 241, 241);
}

body {
  margin: 0;
}

#app {
  > .uid {
    position: fixed;
    right: 20px;
    bottom: 10px;
  }
}
</style>

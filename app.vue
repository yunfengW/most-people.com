<template>
  <div id="app">
    <nuxt-link class="mp-uid" to="/me">
      <el-button link type="info">UID 000 000 001</el-button>
    </nuxt-link>
    <nuxt-page class="page" />
  </div>
</template>

<style lang="scss">
// global
html {
  background: rgb(241, 241, 241);
}
body {
  margin: 0;
}
#app {
  > .page {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    // margin: 0 auto;
  }
  > .mp-uid {
    position: fixed;
    right: 10px;
    bottom: 10px;
  }
}
</style>

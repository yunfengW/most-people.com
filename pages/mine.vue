<template>
  <div id="page-mine">
    <mp-header content="个人中心" />
    <div class="not-logged-in">
      <nuxt-link to="/register">
        <el-button type="primary" plain>注册</el-button>
      </nuxt-link>
      <br />
      <nuxt-link to="/login">
        <el-button type="primary" plain>登录</el-button>
      </nuxt-link>
    </div>
  </div>
</template>

<style lang="scss">
#page-mine {
  .not-logged-in {
    .el-button {
      margin-top: 20px;
      width: 300px;
    }
  }
}
</style>

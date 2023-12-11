<template>
  <div id="page-mine">
    <mp-header title="个人中心" />
    <template v-if="userStore.inited">
      <div class="mine" v-if="userStore.user">
        <el-image
          class="avatar"
          :src="'https://robohash.org/' + userStore.user.name"
          fit="cover"
        ></el-image>
        <h4>{{ userStore.user.name }}</h4>
        <el-button type="danger" plain @click="userStore.exit">退出</el-button>
      </div>
      <div v-else class="not-logged-in">
        <nuxt-link to="/register">
          <el-button type="primary" plain>注册</el-button>
        </nuxt-link>
        <br />
        <nuxt-link to="/login">
          <el-button type="primary" plain>登录</el-button>
        </nuxt-link>
      </div>
    </template>
    <mp-loading v-else/>
  </div>
</template>

<script lang="ts" setup>
const userStore = useUserStore()
</script>

<style lang="scss">
#page-mine {
  .mine {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    .avatar {
      width: 200px;
      height: 200px;
      border-radius: 50%;
      overflow: hidden;

      background-color: #fff;
      border: 1px solid var(--el-text-color-primary);
    }

    .el-button {
      margin-top: 20px;
      width: 300px;
    }
  }
  .not-logged-in {
    .el-button {
      margin-top: 20px;
      width: 300px;
    }
  }
}
</style>

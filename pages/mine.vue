<template>
  <div id="page-mine">
    <mp-header content="个人中心" />
    <template v-if="userStore.inited">
      <div class="mine" v-if="userStore.user">
        <div>{{ userStore.user.name }}</div>
        <el-button plain class="exit" @click="exit">退出登录</el-button>
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
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from '~/stores/user'

const userStore = useUserStore()

const exit = () => {
  if (userStore.user) {
    indexDB.delUser(userStore.user.name)
    userStore.$reset()
  }
}
</script>

<style lang="scss">
#page-mine {
  .mine {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

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

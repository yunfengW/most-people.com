<template>
  <div id="page-mine">
    <mp-header title="个人中心" />
    <template v-if="userStore.inited">
      <div class="mine" v-if="userStore.user">
        <mp-image class="avatar" :src="'https://robohash.org/' + userStore.user.name" fit="cover" />
        <h4>{{ userStore.user.name }}</h4>
        <span> 注册时间：{{ mp.formatTime(userStore.user?.sign_time) }} </span>
        <br />
        <span>以太坊地址：{{ userStore.user.address }}</span>
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
    <mp-loading v-else />
  </div>
</template>

<script lang="ts" setup>
const userStore = useUserStore()
</script>

<style lang="scss">
#page-mine {
  > .mine {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    word-break: break-all;

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

  > .not-logged-in {
    .el-button {
      margin-top: 20px;
      width: 300px;
    }
  }
}
</style>

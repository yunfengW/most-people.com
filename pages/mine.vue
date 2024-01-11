<template>
  <div id="page-mine">
    <mp-header title="个人中心" />
    <template v-if="userStore.inited">
      <div class="mine" v-if="userStore.user">
        <mp-image class="avatar" :src="'https://robohash.org/' + userStore.user.name" fit="cover" />
        <h4>{{ userStore.user.name }}</h4>
        <span>UID：{{ userStore.UID }}</span>
        <br />
        <span> 注册时间：{{ mp.formatTime(userStore.user?.sign_time) }} </span>
        <br />
        <span>以下内容修改密码后将会变化</span>
        <el-button type="warning" plain @click="mp.info('开发中，有兴趣请联系我们。')">
          修改密码
        </el-button>
        <br />
        <span>以太坊地址：{{ userStore.user.address }}</span>
        <nuxt-link to="/mp/web3">
          <el-button type="danger" text bg>导出以太坊私钥</el-button>
        </nuxt-link>
        <br />
        <span>公钥：{{ userStore.user.public_key || '' }}</span>
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

<template>
  <div class="mp-header">
    <div class="left" v-if="route.path !== '/'">
      <mp-icon @click="back" :name="userStore.firstPath === route.path ? 'home' : 'back'" />
      <div class="line"></div>
      <div class="title">{{ props.title }}</div>
    </div>

    <div class="center">
      <slot name="center" />
    </div>

    <div class="right">
      <slot name="right">
        <div class="mp-setting-box">
          <div class="mask" @click="showSetting = false" v-show="showSetting"></div>
          <mp-icon name="setting" @click="showSetting = true" />
          <div class="setting-box" v-show="showSetting">
            <div class="mine">
              <el-image
                class="avatar"
                :src="'https://robohash.org/' + (userStore.user?.name || 'Most-People')"
                fit="cover"
              ></el-image>
              <nuxt-link to="/mine" class="username">
                {{ userStore.user?.name || 'Most-People' }}
              </nuxt-link>
            </div>

            <nuxt-link to="/knowledge">
              <el-button type="success">知识库</el-button>
            </nuxt-link>
            <template v-if="userStore.user">
              <nuxt-link to="/url">
                <el-button type="warning">书签</el-button>
              </nuxt-link>
              <nuxt-link to="/note">
                <el-button type="primary">笔记</el-button>
              </nuxt-link>
              <nuxt-link to="/chat">
                <el-button type="info">联系人</el-button>
              </nuxt-link>
              <nuxt-link to="/pan">
                <el-button type="primary" text bg>网盘</el-button>
              </nuxt-link>
              <nuxt-link>
                <el-button type="danger" @click="userStore.exit">退出</el-button>
              </nuxt-link>
            </template>
            <nuxt-link to="/login" v-else-if="userStore.inited">
              <el-button type="primary">登录 / 注册</el-button>
            </nuxt-link>
          </div>
        </div>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const showSetting = ref(false)

interface Props {
  title: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
})
if (props.title) {
  useHead({ title: props.title })
}

const back = () => {
  if (userStore.firstPath === route.path) {
    router.replace('/').then(() => {
      userStore.firstPath = '/'
    })
  } else {
    router.back()
  }
}
</script>

<style lang="scss">
.mp-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding-bottom: 20px;

  > .left {
    display: flex;
    align-items: center;

    > .mp-icon {
      cursor: pointer;
      font-size: 22px;
      padding-right: 10px;

      &:hover {
        color: #e30002;
      }
    }

    > .line {
      margin: 0 16px 0 6px;
      background: #dcdfe6;
      width: 1px;
      height: 22px;
    }
  }

  > .right {
    display: flex;
    align-items: center;

    > .edit {
      cursor: pointer;
      display: flex;
      align-items: center;
      color: #909399;

      & + .edit {
        margin-left: 20px;
      }

      &:hover {
        color: #b1b3b8;
      }

      .mp-icon {
        margin-top: 2px;
        margin-left: 8px;
        font-size: 20px;
      }
    }
  }
}
</style>

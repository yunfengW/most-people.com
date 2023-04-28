<template>
  <el-page-header @back="back" v-bind="$attrs">
    <template #title>
      <span></span>
    </template>
    <template #icon>
      <mp-icon :icon-id="userStore.firstPath === route.path ? 'home' : 'back'" />
    </template>
    <template v-for="(index, name) in $slots" #[name]><slot :name="name" /></template>
  </el-page-header>
</template>

<script setup lang="ts">
import { useUserStore } from '~/stores/user'
const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
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
.el-page-header {
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;

  .el-page-header__left {
    .el-divider--vertical {
      margin-left: 0;
    }
    .el-page-header__back {
      padding: 20px;
      .el-page-header__icon {
        margin-right: 0;
        .mp-icon {
          font-size: 16px;
        }
      }
    }
  }
  .el-page-header__extra {
    padding: 0 20px;
  }
}
</style>

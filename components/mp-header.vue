<template>
  <div class="mp-header">
    <div class="left">
      <mp-icon @click="back" :name="userStore.firstPath === route.path ? 'home' : 'back'" />
      <div class="line"></div>
      <div class="title">{{ props.title }}</div>
    </div>

    <div class="center"></div>

    <div class="right">
      <slot name="right" />
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

interface Props {
  title: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
})

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
    .edit {
      cursor: pointer;
      display: flex;
      align-items: center;
      color: #909399;

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

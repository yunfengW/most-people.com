<template>
  <el-page-header @back="$router.back()" v-bind="$attrs">
    <template #title>
      <span></span>
    </template>
    <template #icon>
      <svg class="back" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
        <path
          fill="currentColor"
          d="M609.408 149.376 277.76 489.6a32 32 0 0 0 0 44.672l331.648 340.352a29.12 29.12 0 0 0 41.728 0 30.592 30.592 0 0 0 0-42.752L339.264 511.936l311.872-319.872a30.592 30.592 0 0 0 0-42.688 29.12 29.12 0 0 0-41.728 0z"
        ></path>
      </svg>
    </template>
    <template v-for="(index, name) in $slots" #[name]><slot :name="name" /></template>
  </el-page-header>
</template>

<style lang="scss">
.el-page-header {
  width: 100%;
  padding: 20px;
  .el-page-header__icon {
    margin-right: 0;
    .back {
      width: 16px;
      height: 16px;
    }
  }
}
</style>

<template>
  <div id="page-index">
    <img class="logo" src="~/public/logo/ChatGPT.svg" />
    <el-input
      v-model="form.message"
      :placeholder="form.placeholder"
      autofocus
      size="large"
    >
    </el-input>
  </div>
</template>

<script lang="ts" setup>
const form = reactive({
  message: "",
  placeholder: "夜里挑灯看剑",
});
</script>

<style lang="scss">
#page-index {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  img.logo {
    margin: 20px 0;
    height: 80px;
  }

  .el-input {
    margin: 0 20px;
    .el-input__wrapper {
      .el-input__inner {
        text-align: center;
      }
    }
  }
}

// pc 横屏
@media (orientation: landscape) {
  #page-index {
    .el-input {
      width: 61.8%;
    }
  }
}
</style>

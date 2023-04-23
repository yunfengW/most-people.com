<template>
  <div id="page-index">
    <el-input
      autofocus
      v-model="form.message"
      :placeholder="form.placeholder"
    ></el-input>
  </div>
</template>

<script lang="ts" setup>
const form = reactive({
  message: "",
  placeholder: "为什么人类总是不想上班",
});
</script>

<style lang="scss">
#page-index {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  display: flex;
  justify-content: center;
  align-items: center;

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

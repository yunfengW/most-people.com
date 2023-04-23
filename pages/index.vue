<template>
  <div id="page-index">
    <img class="logo" src="~/public/logo/ChatGPT.svg" />
    <el-input
      class="search"
      v-model="form.message"
      :placeholder="form.placeholder"
      autofocus
      size="large"
    >
    </el-input>
    <div class="tools">
      <el-link
        type="primary"
        class="tool"
        href="https://www.wolframalpha.com/examples"
        target="_blank"
      >
        <el-image src="/logo/WolframAlpha.ico" />
        <span>沃尔夫勒姆</span>
      </el-link>
    </div>
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
  padding: 0 20px;
  margin: 0 auto;

  img.logo {
    margin: 20px 0;
    height: 80px;
  }

  .search.el-input {
    .el-input__wrapper {
      .el-input__inner {
        text-align: center;
      }
    }
  }

  .tools {
    width: 100%;
    .tool {
      margin-top: 20px;
      .el-link__inner {
        display: flex;
        flex-direction: column;

        .el-image {
          height: 40px;
        }
      }
    }
  }
}

// PC端 横屏
@media (orientation: landscape) {
  #page-index {
    max-width: 61.8%;
  }
}
</style>

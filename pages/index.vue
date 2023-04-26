<template>
  <div id="page-index">
    <nuxt-link class="mp-join-us" to="/join-us">
      <el-button link type="info">Join Us</el-button>
    </nuxt-link>
    <img class="logo" src="/logo/Bing.svg" />
    <el-input
      class="search"
      v-model="form.message"
      :placeholder="form.placeholder"
      autofocus
      size="large"
      @keyup.enter="send"
    >
      <template #prefix>
        <div class="button microphone" @click.stop="microphone">
          <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
            <path
              fill="currentColor"
              d="M512 128a128 128 0 0 0-128 128v256a128 128 0 1 0 256 0V256a128 128 0 0 0-128-128zm0-64a192 192 0 0 1 192 192v256a192 192 0 1 1-384 0V256A192 192 0 0 1 512 64zm-32 832v-64a288 288 0 0 1-288-288v-32a32 32 0 0 1 64 0v32a224 224 0 0 0 224 224h64a224 224 0 0 0 224-224v-32a32 32 0 1 1 64 0v32a288 288 0 0 1-288 288v64h64a32 32 0 1 1 0 64H416a32 32 0 1 1 0-64h64z"
            ></path>
          </svg>
        </div>
      </template>
      <template #suffix>
        <div class="button send" :class="{ disabled: !form.message }" @click.stop="send">
          <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
            <path
              fill="currentColor"
              d="m64 448 832-320-128 704-446.08-243.328L832 192 242.816 545.472 64 448zm256 512V657.024L512 768 320 960z"
            ></path>
          </svg>
        </div>
      </template>
    </el-input>

    <div class="tools">
      <template v-for="tool in tools">
        <el-link :underline="false" type="info" class="tool" :href="tool.url" target="_blank">
          <el-image :src="tool.logo" fit="contain" />
          <span>{{ tool.name }}</span>
        </el-link>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
// JSON 可视化编辑器 https://jsoneditoronline.org
import tools from '~/assets/json/tools.json'

const form = reactive({
  message: '',
  placeholder: '没有调查，就没有发言权',
})

const send = () => {
  const keyword = form.message || form.placeholder
  window.open('https://www.bing.com/search?q=' + keyword)
}
const microphone = () => {
  ElMessage.info('语音输入 正在开发')
}
</script>

<style lang="scss">
#page-index {
  margin: 0 auto;
  padding: 0 20px;

  > .mp-join-us {
    position: fixed;
    left: 10px;
    bottom: 10px;
  }

  img.logo {
    // cursor: pointer;
    margin: 20px 0;
    height: 80px;
  }

  .search.el-input {
    position: relative;
    .el-input__wrapper {
      padding-left: 0;
      padding-right: 0;
      .el-input__inner {
        text-align: center;
      }
    }
    .button {
      cursor: pointer;
      display: flex;
      align-items: center;
      height: 100%;
      padding: 0 15px;
      color: rgb(142, 142, 160);

      &.disabled {
        opacity: 0.4;

        &:hover {
          opacity: 1;
        }
      }

      svg {
        width: 20px;
        height: 20px;
      }
    }
  }

  .tools {
    width: 100%;
    padding: 10px 0;

    display: grid;
    grid-template-columns: repeat(auto-fill, 100px); /* 列宽度 100px */
    grid-gap: 10px; /* 设置网格间距 */
    justify-content: space-between;

    .tool {
      .el-link__inner {
        display: flex;
        flex-direction: column;

        .el-image {
          height: 40px;
          padding: 2px;
        }

        span {
          margin-top: 4px;
        }
      }
    }
  }
}

// PC端 横屏
@media (orientation: landscape) and (min-width: 980px) {
  #page-index {
    max-width: 61.8%;
  }
}
</style>

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
          <mp-icon name="microphone" />
        </div>
      </template>
      <template #suffix>
        <div class="button send" :class="{ disabled: !form.message }" @click.stop="send">
          <mp-icon name="send" />
        </div>
      </template>
    </el-input>

    <div class="tools">
      <template v-for="tool in tools">
        <el-link
          :underline="false"
          type="info"
          class="tool"
          :href="tool.url"
          target="_blank"
          @click="bindTool($event, tool)"
        >
          <el-image :src="tool.logo" fit="contain" />
          <span>{{ tool.zh }}</span>
        </el-link>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
// JSON 可视化编辑器 https://jsoneditoronline.org
import tools from '~/assets/json/tools.json'

interface Tool {
  id: string
  zh: string
  logo: string
  url: string
}

const form = reactive({
  message: '',
  placeholder: '没有调查，就没有发言权',
  tool: tools[2],
})

const send = () => {
  const keyword = form.message || form.placeholder
  window.open('https://www.bing.com/search?q=' + keyword)
}
const microphone = () => {
  ElMessage.info('语音输入 正在开发')
}

const bindTool = (event: MouseEvent, tool: Tool) => {
  if (tool.url.includes('「most-people」')) {
    console.log('🌊', tool)
    event.preventDefault()
  }
}
</script>

<style lang="scss">
#page-index {
  > .mp-join-us {
    position: absolute;
    left: 10px;
    bottom: 10px;
    z-index: 10;
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

      .mp-icon {
        font-size: 20px;
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
</style>

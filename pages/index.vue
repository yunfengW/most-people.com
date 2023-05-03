<template>
  <div id="page-index">
    <nuxt-link class="mp-join-us" to="/join-us">
      <el-button link type="info">Join Us</el-button>
    </nuxt-link>
    <div class="current-tool">
      <nuxt-link class="left" :to="'/tool/' + userStore.tool.id">
        <mp-icon name="how-to-use" />
        <span>使用指南</span>
      </nuxt-link>
      <nuxt-link class="logo" to="/tool">
        <el-image :src="userStore.tool.logo" />
      </nuxt-link>
      <div class="right">
        <span>{{ userStore.tool.zh }}</span>
      </div>
    </div>

    <div class="search">
      <el-input
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
    </div>

    <div class="tools">
      <template v-for="item in tools">
        <el-link
          :underline="false"
          type="info"
          class="tool"
          :href="item.url"
          target="_blank"
          @click="bindTool($event, item)"
        >
          <el-image :src="item.logo" fit="contain" />
          <span>{{ item.zh }}</span>
        </el-link>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
// JSON 可视化编辑器 https://jsoneditoronline.org
import tools from '~/assets/json/tools.json'
import { useUserStore, Tool } from '~/stores/user'

const form = reactive({
  message: '',
  placeholder: '没有调查，就没有发言权',
})

const userStore = useUserStore()

const send = () => {
  if (userStore.tool.url.includes('「most-people」')) {
    const keyword = encodeURIComponent(form.message || form.placeholder)
    const url = userStore.tool.url.replace('「most-people」', keyword)
    window.open(url)
  } else {
    const url = new URL(userStore.tool.url)
    const keyword = form.message || form.placeholder
    url.searchParams.set('mp-keyword', keyword)
    window.open(url.href)
  }
}
const microphone = () => {
  ElMessage.info('语音输入 正在开发')
}

const bindTool = (event: MouseEvent, tool: Tool) => {
  event.preventDefault()
  userStore.tool = tool
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

  .current-tool {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;

    .left,
    .right {
      width: 96px;
    }

    .left {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      cursor: pointer;

      .mp-icon {
        opacity: 0.8;
        font-size: 24px;
        margin-right: 8px;
      }
      &:hover {
        opacity: 1;
      }
    }

    .logo {
      flex-shrink: 0;
      margin: 20px 22px;
      .el-image {
        height: 80px;
        width: 80px;
      }
    }
  }

  .search {
    width: 100%;

    .el-input {
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
          width: 40px;
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
@media (orientation: landscape) and (min-width: 375px) {
  #page-index {
    .current-tool {
      .logo {
        margin-left: 42px;
        margin-right: 42px;
      }
    }
  }
}
</style>

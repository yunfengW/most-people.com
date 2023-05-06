<template>
  <div id="page-index">
    <nuxt-link class="mp-join-us" to="/join-us">
      <el-button link type="info">Join Us</el-button>
    </nuxt-link>
    <div class="current-tool">
      <nuxt-link class="left" :to="'/tool/' + mp.hyphenate(userStore.tool.id)">
        <mp-icon name="how-to-use" />
        <span>使用指南</span>
      </nuxt-link>
      <el-image class="logo" :src="userStore.tool.logo" />
      <div class="right">
        <a :href="formatURL(userStore.tool.url)" target="_blank">{{ userStore.tool.zh }}</a>
      </div>
    </div>

    <div class="search">
      <el-input
        v-model="userStore.message"
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
          <div class="button send" :class="{ disabled: !userStore.message }" @click.stop="send">
            <mp-icon name="send" />
          </div>
        </template>
      </el-input>
    </div>

    <div class="tools">
      <template v-for="key in userStore.tools">
        <el-link
          :underline="false"
          type="info"
          class="tool"
          :href="tools[key as 'Bing']?.url"
          target="_blank"
          @click.prevent="bindTool(key)"
        >
          <el-image :src="tools[key as 'Bing']?.logo" fit="contain" />
          <span>{{ tools[key as 'Bing']?.zh }}</span>
        </el-link>
      </template>
      <el-link :underline="false" type="info" class="tool" @click="$router.push('/tool')">
        <el-image src="/img/add.svg" fit="contain" />
        <span>添加</span>
      </el-link>
    </div>
  </div>
</template>

<script lang="ts" setup>
// JSON 可视化编辑器 https://jsoneditoronline.org
import tools from '~/assets/json/tools.json'
import { useUserStore } from '~/stores/user'

const form = reactive({
  placeholder: '没有调查，就没有发言权',
})

const userStore = useUserStore()

const formatURL = (url: string) => {
  if (url.includes('「most-people」')) {
    const keyword = encodeURIComponent(userStore.message || form.placeholder)
    return url.replace('「most-people」', keyword)
  }
  const urlObject = new URL(url)
  const keyword = userStore.message || form.placeholder
  urlObject.searchParams.set('mp-keyword', keyword)
  return urlObject.href
}
const send = () => {
  const url = formatURL(userStore.tool.url)
  window.open(url)
}
const microphone = () => {
  ElMessage.info('语音输入 正在开发')
}
const bindTool = (key: string) => {
  const tool = tools[key as 'Bing']
  if (tool) {
    userStore.tool = tool
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

    .right {
      white-space: nowrap;
      // overflow: hidden;
      // text-overflow: ellipsis;
    }

    .logo {
      flex-shrink: 0;
      margin: 20px 22px;
      height: 80px;
      width: 80px;
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

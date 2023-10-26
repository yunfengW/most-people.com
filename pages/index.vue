<template>
  <div id="page-index">
    <div class="mp-join-us">
      <nuxt-link to="/join-us">
        <el-button link type="info">Join Us</el-button>
      </nuxt-link>
      <a href="https://beian.miit.gov.cn/" target="_blank">
        <el-button link type="info">粤ICP备2020105439号</el-button>
      </a>
    </div>

    <div class="setting-box">
      <div class="mask" @click="showSetting = false" v-show="showSetting"></div>
      <mp-icon name="setting" @click="showSetting = true" />
      <main v-show="showSetting">
        <div class="mine">
          <el-image
            class="avatar"
            :src="'https://robohash.org/' + (userStore.user?.name || 'Most-People')"
            fit="cover"
          ></el-image>
          <h4>{{ userStore.user?.name || 'Most-People' }}</h4>
        </div>
        <span class="button-box" v-if="userStore.user" @click="userStore.exit">
          <el-button type="danger">退出</el-button>
        </span>
        <span class="button-box" v-else>
          <nuxt-link to="/login">
            <el-button type="primary">登录 / 注册</el-button>
          </nuxt-link>
        </span>
      </main>
    </div>

    <div class="current-tool">
      <nuxt-link class="left" :to="'/tool/' + userStore.tool.id">
        <mp-icon name="how-to-use" />
        <span>使用指南</span>
      </nuxt-link>
      <nuxt-link class="logo" to="/tool">
        <el-image :src="userStore.tool.logo" />
      </nuxt-link>
      <div class="right">
        <a :href="formatURL(userStore.tool.url)" target="_blank">{{ userStore.tool.zh }}</a>
      </div>
    </div>

    <div
      class="search"
      :class="{ 'show-sug': userStore.sugList.length > 0 && inputFocus, 'is-focus': inputFocus }"
    >
      <div ref="sugElement"></div>

      <div
        class="intelligence"
        v-show="userStore.sugList.length > 0 && inputFocus"
        @mouseout="userStore.sugIndex = -1"
      >
        <div
          class="one"
          v-for="(sug, i) in userStore.sugList"
          @mouseover="userStore.sugIndex = i"
          :class="{ active: userStore.sugIndex === i }"
          @mousedown.prevent="send(sug)"
        >
          {{ sug }}
        </div>
      </div>

      <el-input
        ref="messageElement"
        v-model="userStore.message"
        :placeholder="form.placeholder"
        autofocus
        size="large"
        @input="inputEvent"
        @focus="inputFocus = true"
        @blur="inputFocus = false"
        @keydown="keyDownEvent($event as KeyboardEvent)"
        @keyup="keyUpEvent"
      >
        <template #prefix>
          <div class="button microphone" @click.stop="microphone">
            <mp-icon v-if="isListening" class="el-icon is-loading" name="loading" />
            <mp-icon v-else name="microphone" />
          </div>
        </template>
        <template #suffix>
          <div class="button send" :class="{ disabled: !userStore.message }" @click.stop="send()">
            <mp-icon name="send" />
          </div>
        </template>
      </el-input>
    </div>

    <div class="tools" :class="{ remove: form.remove }">
      <template v-for="key in userStore.tools">
        <div class="tool" @click="bindTool(key)">
          <el-image :src="toolStore.tools[key as 'Bing']?.logo" fit="contain" />
          <span>{{ toolStore.tools[key as 'Bing']?.zh }}</span>
          <mp-icon name="remove" @click.stop="bindRemove(key)" />
        </div>
      </template>
      <div class="tool add" @click="bindAdd">
        <mp-icon name="add" />
        <span>添加</span>
      </div>
      <div class="tool del" @click="form.remove = !form.remove">
        <mp-icon name="del" />
        <span>{{ form.remove ? '关闭删除' : '删除' }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const showSetting = ref(false)

const toolStore = useToolStore()

const {
  userStore,
  form,
  messageElement,
  // 麦克风
  microphone,
  isListening,
  // 发送
  send,
  //
  bindTool,
  bindAdd,
  bindRemove,
  //
  formatURL,
} = useIndex()

const inputFocus = ref(true)

const sugElement = ref<HTMLDivElement>()

const inputEvent = () => {
  const v = userStore.message
  if (!v) {
    userStore.sugList = []
    userStore.sugIndex = -1
    return
  }
  // 缓存关键字
  const url = 'https://sor.html5.qq.com/api/getsug?key=' + encodeURI(v)
  const script = document.createElement('script')
  script.src = url

  const sug = sugElement.value
  if (sug) {
    for (const e of sug.children) {
      e.remove()
    }
    sug.appendChild(script)
  }
}

const keyDownEvent = (event: KeyboardEvent) => {
  // 解决光标 bug
  if (event.key === 'ArrowUp') {
    event.preventDefault()
  }
}
const keyUpEvent = (event: KeyboardEvent) => {
  const k = event.key
  const index = userStore.sugIndex
  const length = userStore.sugList.length
  if (k === 'Enter') {
    send()
  } else if (k === 'ArrowUp') {
    userStore.sugIndex = (index + length - 1) % length
    userStore.message = userStore.sugList[userStore.sugIndex]
    // 下
  } else if (k === 'ArrowDown') {
    userStore.sugIndex = (index + length + 1) % length
    userStore.message = userStore.sugList[userStore.sugIndex]
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

  > .setting-box {
    user-select: none;
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 10;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    > .mp-icon-setting {
      padding: 10px;
      cursor: pointer;
      color: var(--el-color-info);
      font-size: 20px;

      &:hover {
        color: var(--el-color-info-light-5);
      }
    }
    > main {
      border-radius: 12px;
      box-shadow: 0 4px 8px 3px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0, 0, 0, 0.3);
      width: 240px;
      height: 240px;
      display: flex;
      flex-direction: column;
      align-items: center;
      overflow: hidden;
      padding: 8px 0;
      background: rgb(241, 241, 241);
      z-index: 11;

      > span {
        cursor: pointer;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 8px;

        &.button-box {
          justify-content: center;
          a,
          .el-button {
            width: 100%;
          }
        }
      }

      .mine {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        margin-bottom: auto;

        .avatar {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          overflow: hidden;

          background-color: #fff;
          border: 1px solid var(--el-text-color-primary);
        }
      }
    }
    > .mask {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, 0.04);
    }
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
      .el-image {
        width: 100%;
        height: 100%;
      }
    }
  }

  .search {
    width: 100%;
    position: relative;

    &.is-focus {
      .el-input {
        .el-input__wrapper {
          border-color: #e30002;
        }
      }
      &.show-sug {
        .el-input {
          .el-input__wrapper {
            border-radius: 4px 4px 0 0;
          }
        }
      }
    }

    .el-input {
      position: relative;
      .el-input__wrapper {
        padding-left: 0;
        padding-right: 0;
        box-shadow: none;
        border: 1px solid transparent;
        z-index: 1;

        .el-input__inner {
          // font-weight: bolder;
          text-align: center;
          letter-spacing: 1px;
        }
      }
      .button {
        cursor: pointer;
        display: flex;
        align-items: center;
        height: 100%;
        padding: 0 15px;
        color: #909399;

        &:hover {
          color: #b1b3b8;
        }

        .mp-icon {
          font-size: 20px;
        }
      }
    }

    .intelligence {
      position: absolute;
      top: 41px;
      left: 0;
      right: 0;
      background: white;
      z-index: 1;
      padding: 5px 0;

      transition: box-shadow 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
      transform: translate3d(0, 0, 0);
      border: 1px solid #e30002;
      border-top: 0;

      border-radius: 0 0 4px 4px;

      .one {
        cursor: pointer;
        padding: 4px 10px;

        &.active {
          background: rgb(241, 241, 241);
          color: #e30002;
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

    font-size: 14px;
    color: var(--el-color-info);

    .tool {
      cursor: pointer;
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;

      .el-image {
        user-select: none;
        height: 40px;
        width: 40px;
        padding: 2px;
      }
      // add del
      .mp-icon-add,
      .mp-icon-del {
        color: initial;
        font-size: 40px;
      }

      span {
        margin-top: 4px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      .mp-icon-remove {
        visibility: hidden;
        position: absolute;
        top: 0;
        right: 0;
      }

      &:hover {
        color: var(--el-color-info-light-3);
      }
    }

    &.remove {
      .tool {
        .mp-icon-remove {
          visibility: initial;
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

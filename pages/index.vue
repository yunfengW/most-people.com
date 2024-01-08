<template>
  <div id="page-index">
    <mp-header title="" />

    <div class="join-us">
      <nuxt-link to="/join-us">
        <el-button link type="info">加入我们</el-button>
      </nuxt-link>
      <a href="https://beian.miit.gov.cn/" target="_blank">
        <el-button link type="info">粤ICP备2020105439号</el-button>
      </a>
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
        <a :href="formatURL(userStore.tool.url)" target="_blank">{{ userStore.tool.title }}</a>
      </div>
    </div>

    <div
      class="search"
      :class="{
        'show-sug': userStore.getSugList.length > 0 && inputFocus,
        'is-focus': inputFocus,
      }"
    >
      <div ref="sugElement"></div>

      <div
        class="intelligence"
        v-show="userStore.getSugList.length > 0 && inputFocus"
        @mouseout="userStore.sugIndex = -1"
      >
        <div
          class="one"
          v-for="(search, i) in userStore.getSugList"
          @mouseover="userStore.sugIndex = i"
          :class="{ active: userStore.sugIndex === i }"
          @mousedown.prevent="bindSearch(search)"
        >
          <span>{{ search.name }}</span>
          <el-tag v-if="searchTag[search.type].name" :type="(searchTag[search.type].type as any)">
            {{ searchTag[search.type].name }}
          </el-tag>
        </div>
      </div>

      <el-input
        ref="messageElement"
        v-model="userStore.message"
        :placeholder="form.placeholder"
        autofocus
        size="large"
        @input="userStore.initSearch"
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
          <div
            class="button send"
            :class="{ disabled: !userStore.message }"
            @click.stop="bindSearch()"
          >
            <mp-icon name="send" />
          </div>
        </template>
      </el-input>
    </div>

    <div class="tools" :class="{ remove: form.remove }">
      <template v-for="id in userStore.tools">
        <div class="tool" @click="bindTool(id)">
          <el-image :src="toolStore.tools[id]?.logo" fit="contain" />
          <span>{{ toolStore.tools[id]?.title }}</span>
          <mp-icon name="remove" @click.stop="bindRemove(id)" />
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

    <div class="memo">
      <el-input
        @input="saveMemo"
        type="textarea"
        v-model="userStore.memo"
        :autosize="{ minRows: 4 }"
        resize="none"
        placeholder="便签"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
useHead({ title: 'Most People | 动员群众，解决难题 | 密码朋克' })

const router = useRouter()

const toolStore = useToolStore()

const {
  userStore,
  form,
  messageElement,
  // 麦克风
  microphone,
  isListening,
  // 发送
  //
  bindTool,
  bindAdd,
  bindRemove,
  saveMemo,
  //
  formatURL,
} = useIndex()

const inputFocus = ref(true)

const sugElement = ref<HTMLDivElement>()

const searchTag = {
  sogou: {
    name: '',
    type: '',
  },
  tool: {
    name: '工具',
    type: 'info',
  },
  url: {
    name: '书签',
    type: 'warning',
  },
  note: {
    name: '笔记',
    type: '',
  },
  knowledge: {
    name: '知识',
    type: 'success',
  },
}

const bindSearch = (search?: Search) => {
  if (!search) {
    search = userStore.getSugList[userStore.sugIndex]
  }
  if (!search) {
    const url = formatURL(userStore.tool.url, userStore.message)
    window.open(url)
    return
  }
  const { type, data } = search
  if (type === 'url') {
    window.open(data as string)
  } else if (type === 'tool') {
    bindTool(data as number)
    userStore.message = ''
    userStore.sugList = []
    userStore.sugIndex = -1
  } else if (type === 'knowledge') {
    router.push(data as string)
  } else if (type === 'note') {
    router.push(data as string)
  } else if (type === 'sogou') {
    const url = formatURL(userStore.tool.url, data as string)
    window.open(url)
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
  const length = userStore.getSugList.length
  if (k === 'Enter') {
    bindSearch()
  } else if (k === 'ArrowUp') {
    userStore.sugIndex = (index + length - 1) % length
    // 下
  } else if (k === 'ArrowDown') {
    userStore.sugIndex = (index + length + 1) % length
  }
}

onMounted(() => {
  messageElement.value?.focus()
})
</script>

<style lang="scss">
#page-index {
  > .mp-header {
    padding-bottom: 0;
  }
  > .join-us {
    position: absolute;
    left: 10px;
    bottom: 0;
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

        display: flex;
        justify-content: space-between;

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
    grid-template-columns: repeat(auto-fill, 100px);
    /* 列宽度 100px */
    grid-gap: 10px;
    /* 设置网格间距 */
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

  .memo {
    width: 100%;
    margin: 20px 0;
    .el-textarea {
      .el-textarea__inner {
        text-align: center;
        background: transparent;
        box-shadow: none;

        &:hover {
          box-shadow: 0 0 0 1px #dcdfe6 inset;
        }
        &:focus {
          box-shadow: 0 0 0 1px #c0c4cc inset;
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

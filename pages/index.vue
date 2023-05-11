<template>
  <div id="page-index">
    <nuxt-link class="mp-join-us" to="/join-us">
      <el-button link type="info">Join Us</el-button>
    </nuxt-link>
    <mp-icon name="setting" @click="form.remove = !form.remove" />
    <div class="current-tool">
      <nuxt-link class="left" :to="'/tool/' + mp.hyphenate(userStore.tool.id)">
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

    <div class="tools" :class="{ remove: form.remove }">
      <template v-for="key in userStore.tools">
        <div class="tool" @click="bindTool(key)">
          <el-image :src="tools[key as 'Bing']?.logo" fit="contain" />
          <span>{{ tools[key as 'Bing']?.zh }}</span>
          <mp-icon name="remove" @click.stop="bindRemove(key)" />
        </div>
      </template>
      <div class="tool add" @click="bindAdd">
        <el-image src="/img/add.svg" fit="contain" />
        <span>添加</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const {
  tools,
  userStore,
  form,
  // 麦克风
  microphone,
  // 发送
  send,
  //
  bindTool,
  bindAdd,
  bindRemove,
  //
  formatURL,
} = useIndex()
</script>

<style lang="scss">
#page-index {
  > .mp-join-us {
    position: absolute;
    left: 10px;
    bottom: 10px;
    z-index: 10;
  }

  > .mp-icon-setting {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 10;

    padding: 10px;
    cursor: pointer;
    color: var(--el-color-info);
    font-size: 20px;

    &:hover {
      color: var(--el-color-info-light-5);
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

    font-size: 14px;
    color: var(--el-color-info);

    .tool {
      cursor: pointer;
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;

      .el-image {
        height: 40px;
        width: 40px;
        padding: 2px;
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

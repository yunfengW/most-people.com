<template>
  <div id="page-tool">
    <mp-header :title="toolName">
      <!-- <template #extra>
        <el-button round @click="mp.info('正在开发中，请加入我们吧')">
          <mp-icon name="edit" />
        </el-button>
      </template> -->
    </mp-header>

    <div class="markdown-box" v-if="renderHTML" ref="markdownElement" v-html="renderHTML"></div>
    <div class="markdown-empty" v-else-if="inited">
      <h4>抱歉，暂时还没有「{{ toolName }}」的使用指南</h4>
      <div>如果你有兴趣的话，加入我们吧</div>
      <br />
      <el-image class="join-us" src="/img/join-us.jpg" />
    </div>
    <div v-else class="el-icon is-loading">
      <mp-icon name="loading" />
    </div>

    <div class="markdown-editor" ref="editorElement"></div>
  </div>
</template>

<script setup lang="ts">
import { useToolKey } from '~/composables/useToolKey'

const { inited, renderHTML, toolName, editorElement, markdownElement } = useToolKey()
</script>

<style lang="scss">
#page-tool.page {
  // max-width: 100%;
  .markdown-box {
    word-break: break-word;
    width: 100%;

    mp-mi {
      display: flex;
      flex-direction: column;
      position: relative;

      > div {
        color: #000;
      }
      > span {
        color: #f1f1f1;
      }

      > div,
      > span {
        width: 100%;
        padding: 16px;
        background-color: white;
        border-radius: 20px;
        font-size: 16px;
        line-height: 24px;
      }
      > input {
        width: 100%;
        padding: 0 16px;
        height: 56px;
        border-radius: 20px;
        outline: 0;
        border: 0;
        font-size: 20px;
        margin: 10px 0;
      }
      > a {
        position: absolute;
        right: 16px;
        bottom: 20px;
        display: inline-flex;
        align-items: center;
        height: 36px;
        background-color: rgb(29, 155, 240);
        color: white;
        margin-left: 16px;
        padding: 0 16px;
        border-radius: 20px;

        &:hover {
          background-color: rgb(23, 124, 192);
        }
      }
    }
  }
  .markdown-empty {
    text-align: center;
    .join-us {
      max-width: 375px;
    }
  }
  .markdown-editor {
    width: 100%;
    height: 800px;
  }
}
</style>

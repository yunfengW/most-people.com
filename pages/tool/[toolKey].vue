<template>
  <div id="page-tool">
    <mp-header :title="toolName">
      <template #right v-if="renderHTML">
        <div class="edit" @click="edit = !edit">
          <span>编辑</span>
          <mp-icon name="edit"></mp-icon>
        </div>
      </template>
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

    <div class="markdown-editor" v-show="edit">
      <div class="show" v-html="render(markdown)"></div>
      <div class="edit">
        <monaco-editor v-model="markdown" lang="markdown" :options="options" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useToolKey } from '~/composables/useToolKey'

const options: any = {
  language: 'markdown',
  tabSize: 2,
  minimap: {
    enabled: false,
  },
  formatOnType: true,
  wordWrap: 'on',
  theme: 'vs-dark',
}
const edit = ref(false)
const { inited, renderHTML, toolName, markdown, render, markdownElement } = useToolKey()
</script>

<style lang="scss">
#page-tool.page {
  // max-width: 100%;
  .mp-header {
    .right {
      .edit {
        cursor: pointer;
        display: flex;
        align-items: center;
        color: #909399;
        &:hover {
          color: #b1b3b8;
        }

        .mp-icon {
          margin-top: 2px;
          margin-left: 8px;
          font-size: 20px;
        }
      }
    }
  }

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
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: flex-start;
    width: 100%;
    height: 100%;
    background: #f1f1f1;

    .show {
      width: 38.2%;
      height: 100%;
      padding: 0 20px;
    }
    .edit {
      width: 61.8%;
      height: 100%;
      background: #1e1e1e;
    }
  }
}
</style>

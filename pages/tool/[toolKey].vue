<template>
  <div id="page-tool" ref="markdownElement">
    <mp-header :title="toolName">
      <template #right v-if="markdown">
        <div class="edit" @click="showEdit = true">
          <span>编辑</span>
          <mp-icon name="edit" />
        </div>
      </template>
    </mp-header>

    <div v-if="markdown" v-show="!showEdit" class="markdown-box" v-html="render(markdown)"></div>
    <div class="markdown-empty" v-else-if="inited">
      <h4>抱歉，暂时还没有「{{ toolName }}」的使用指南</h4>
      <div>如果你有兴趣的话，加入我们吧</div>
      <br />
      <el-image class="join-us" src="/img/join-us.jpg" />
    </div>
    <div v-else class="el-icon is-loading">
      <mp-icon name="loading" />
    </div>

    <div class="markdown-editor" :class="{ 'show-edit': showEdit }">
      <div class="close" @click="showEdit = false">
        <mp-icon name="close" />
      </div>

      <div class="preview markdown-box" ref="markdownElement" v-html="render(markdown)"></div>
      <monaco-editor class="editor" v-model="markdown" lang="markdown" :options="options" />
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
const showEdit = ref(false)

const { inited, toolName, markdown, render, markdownElement } = useToolKey()
</script>

<style lang="scss">
#page-tool.page {
  .markdown-empty {
    text-align: center;
    .join-us {
      max-width: 375px;
    }
  }
  .markdown-box {
    width: 100%;
    word-break: break-word;
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
    // 默认隐藏
    opacity: 0;
    pointer-events: none;

    .close {
      cursor: pointer;
      position: absolute;
      top: 6px;
      right: 20px;
      z-index: 1;
      font-size: 32px;
      color: #909399;
    }

    .preview {
      width: 38.2%;
      height: 100%;
      padding: 0 20px;
      overflow-y: auto;
    }

    .editor {
      width: 61.8%;
      height: 100%;
      background: #1e1e1e;
    }

    &.show-edit {
      opacity: 1;
      pointer-events: auto;
    }
  }
}
</style>

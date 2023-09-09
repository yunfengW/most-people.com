<template>
  <div id="page-tool">
    <mp-header :content="toolName">
      <!-- <template #extra>
        <el-button round @click="mp.info('正在开发中，请加入我们吧')">
          <mp-icon name="edit" />
        </el-button>
      </template> -->
    </mp-header>

    <div class="markdown-box" v-if="renderHTML" ref="markdownElement" v-html="renderHTML"></div>
    <template v-else>
      <div class="markdown-empty" v-if="inited">
        <h4>抱歉，暂时还没有「{{ toolName }}」的使用指南</h4>
        <div>如果你有兴趣的话，加入我们吧</div>
        <br />
        <el-image class="join-us" src="/img/join-us.jpg" />
      </div>
      <el-icon v-else class="is-loading">
        <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-ea893728="">
          <path
            fill="currentColor"
            d="M512 64a32 32 0 0 1 32 32v192a32 32 0 0 1-64 0V96a32 32 0 0 1 32-32zm0 640a32 32 0 0 1 32 32v192a32 32 0 1 1-64 0V736a32 32 0 0 1 32-32zm448-192a32 32 0 0 1-32 32H736a32 32 0 1 1 0-64h192a32 32 0 0 1 32 32zm-640 0a32 32 0 0 1-32 32H96a32 32 0 0 1 0-64h192a32 32 0 0 1 32 32zM195.2 195.2a32 32 0 0 1 45.248 0L376.32 331.008a32 32 0 0 1-45.248 45.248L195.2 240.448a32 32 0 0 1 0-45.248zm452.544 452.544a32 32 0 0 1 45.248 0L828.8 783.552a32 32 0 0 1-45.248 45.248L647.744 692.992a32 32 0 0 1 0-45.248zM828.8 195.264a32 32 0 0 1 0 45.184L692.992 376.32a32 32 0 0 1-45.248-45.248l135.808-135.808a32 32 0 0 1 45.248 0zm-452.544 452.48a32 32 0 0 1 0 45.248L240.448 828.8a32 32 0 0 1-45.248-45.248l135.808-135.808a32 32 0 0 1 45.248 0z"
          ></path>
        </svg>
      </el-icon>
    </template>

    <div class="markdown-editor" ref="editorElement"></div>
  </div>
</template>

<script setup lang="ts">
import { useToolKey } from '~/composables/useToolKey'

const { inited, renderHTML, toolName, editorElement, markdownElement } = useToolKey()
</script>

<style lang="scss">
#page-tool {
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

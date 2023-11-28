<template>
  <div id="page-knowledge-id" ref="markdownElement">
    <mp-header title="">
      <template #center>
        <input class="note-title" v-model="question" type="text" />
      </template>
      <template #right>
        <div
          class="edit"
          v-show="markdown !== markdownOld || question !== questionOld"
          @click="publish"
        >
          <span>发布</span>
          <mp-icon name="publish" />
        </div>
        <div class="edit" @click="showEdit = true">
          <span>编辑</span>
          <mp-icon name="edit" />
        </div>
      </template>
    </mp-header>

    <div v-if="markdown" v-show="!showEdit" class="mp-markdown-box" v-html="render(markdown)"></div>
    <div v-else class="el-icon is-loading">
      <mp-icon name="loading" />
    </div>

    <div class="mp-markdown-editor" :class="{ 'show-edit': showEdit }">
      <div class="close" @click="showEdit = false">
        <mp-icon name="close" />
      </div>

      <div class="preview markdown-box" ref="markdownElement" v-html="render(markdown)"></div>
      <monaco-editor
        class="editor"
        v-model="markdown"
        lang="markdown"
        :options="{
          tabSize: 2,
          minimap: {
            enabled: false,
          },
          formatOnType: true,
          wordWrap: 'on',
          theme: 'vs-dark',
        }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMarkdown } from '~/composables/useMarkdown'

import api from '~/utils/api'

const route = useRoute()
const router = useRouter()
const knowledge_id = (route.params.knowledge_id || '') as string

const showEdit = ref(false)

const publish = async () => {
  const res = await api({
    method: 'put',
    url: '/knowledge/update',
    data: {
      id: Number(knowledge_id),
      Answer: markdown.value,
      Question: question.value,
    },
  })
  if (res.data?.statusCode === 1004) {
    router.push('/login')
    return
  }
  if (res.data === true) {
    mp.success('发布成功！')
  }
}

const markdownOld = ref('')
const question = ref('')
const questionOld = ref('')

const init = async () => {
  const res = await api({ method: 'post', url: '/db/Knowledge/' + knowledge_id })
  if (res.data?.id) {
    const knowledge: Knowledge = res.data

    const text = knowledge.Answer || '# 新答案\n点击右上角 开启编辑'

    markdown.value = text
    markdownOld.value = text
    question.value = knowledge.Question
    questionOld.value = knowledge.Question
  } else {
    mp.error('知识不存在')
    router.back()
  }
}

const { markdown, render, markdownElement } = useMarkdown(publish)

if (process.client) {
  init()
}
</script>

<style lang="scss">
@import '~/assets/css/markdown.scss';

#page-knowledge-id.page {
  .markdown-empty {
    text-align: center;
  }

  .mp-header {
    .center {
      width: 100%;
      .note-title {
        text-align: center;
        background: transparent;
        border: 0;
        outline: 0;
        font-size: 16px;
        width: 100%;
        background: #eee;
      }
    }
    .right {
      flex-shrink: 0;
    }
  }
}
</style>

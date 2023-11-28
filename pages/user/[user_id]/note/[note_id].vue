<template>
  <div id="page-note-id" ref="markdownElement">
    <mp-header title="">
      <template #center>
        <input class="note-title" v-model="noteTitle" type="text" />
      </template>
      <template #right>
        <div
          class="edit"
          v-show="markdown !== markdownOld || noteTitle !== noteTitleOld"
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
import { indexDB } from '~/utils/api/indexdb'

const route = useRoute()
const router = useRouter()
// const tool_id = (route.params.tool_id || '') as string

const showEdit = ref(false)

const publish = async () => {
  mp.info('开发中')
  // const res = await api({
  //   method: 'put',
  //   url: '/note/update',
  //   data: {
  //     id: tool_id,
  //     content: markdown.value,
  //     title: noteTitle.value,
  //   },
  // })
  // if (res.data?.statusCode === 1004) {
  //   router.push('/login')
  //   return
  // }
  // if (res.data === true) {
  //   mp.success('发布成功！')
  // }
}

const note_id = (route.params.note_id || '') as string

const markdownOld = ref('')
const noteTitle = ref('')
const noteTitleOld = ref('')

const decrypt = async (content: string) => {
  try {
    if (content.startsWith('mp://1.')) {
      const username = window.localStorage.getItem('username')
      if (username) {
        const userDB = await indexDB.getUser(username)
        if (userDB) {
          return await mp.decrypt(content, userDB.key)
        }
      }
    }
  } catch (error) {
    console.error(error)
  }
  return content || '# 新建笔记\n点击右上角 开启编辑'
}

const init = async () => {
  const res = await api({ method: 'post', url: '/db/Notes/' + note_id })
  if (res.data?.id) {
    const note: Note = res.data

    const text = await decrypt(note.content)

    markdown.value = text
    markdownOld.value = text
    noteTitle.value = note.title
    noteTitleOld.value = note.title
  } else {
    mp.error('笔记不存在')
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

#page-note-id.page {
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

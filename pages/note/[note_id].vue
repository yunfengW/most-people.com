<template>
  <div id="page-note-id" ref="markdownElement">
    <mp-header title="">
      <template #center>
        <input class="note-title" v-model="md.form.title" type="text" />
      </template>
      <template #right>
        <div class="edit" v-show="md.form.content !== md.form.contentOld || md.form.title !== md.form.titleOld"
          @click="publish">
          <span>发布</span>
          <mp-icon name="publish" />
        </div>
        <div class="edit" @click="showEdit = true">
          <span>编辑</span>
          <mp-icon name="edit" />
        </div>
      </template>
    </mp-header>

    <div v-if="md.form.content" v-show="!showEdit" class="mp-markdown-box" v-html="md.render(md.form.content)"></div>
    <div v-else-if="!md.form.inited" class="el-icon is-loading">
      <mp-icon name="loading" />
    </div>

    <div class="mp-markdown-editor" :class="{ 'show-edit': showEdit }">
      <div class="close" @click="showEdit = false">
        <mp-icon name="close" />
      </div>

      <div class="preview mp-markdown-box" v-html="md.render(md.form.content)"></div>
      <monaco-editor class="editor" v-model="md.form.content" lang="markdown" :options="md.options" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMarkdown } from '~/composables/useMarkdown'

import api from '~/utils/api'
import { indexDB } from '~/utils/api/indexdb'

const route = useRoute()
const router = useRouter()
const note_id = (route.params.note_id || '') as string
const noteStore = useNoteStore()

const showEdit = ref(false)

const publish = async () => {
  const res = await api({
    method: 'put',
    url: '/note/update',
    data: {
      id: Number(note_id),
      title: md.form.title,
      content: md.form.content,
    },
  })
  if (res.data?.statusCode === 1004) {
    router.push('/login')
    return
  }
  if (res.data === true) {
    mp.success('发布成功！')

    // 发布状态
    md.form.contentOld = md.form.content
    md.form.titleOld = md.form.title

    const i = noteStore.notes.findIndex((e) => String(e.id) === note_id)
    if (i !== -1) {
      noteStore.notes[i].title = md.form.title
    }
  }
}

const decrypt = async (content: string) => {
  try {
    if (content.startsWith('mp://1.')) {
      const username = window.localStorage.getItem('username')
      if (username) {
        const userDB = await indexDB.getUser(username)
        if (userDB) {
          const text = await mp.decrypt(content, userDB.key)
          if (text) {
            return text
          }
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
  md.form.inited = true
  if (res.data?.id) {
    const note: Note = res.data

    const text = await decrypt(note.content)

    md.form.content = text
    md.form.contentOld = text
    md.form.title = note.title
    md.form.titleOld = note.title
  } else {
    mp.error('笔记不存在')
    router.back()
  }
}

const markdownElement = ref<HTMLDivElement>()
const md = useMarkdown(markdownElement)

if (process.client) {
  init()
}
</script>

<style lang="scss">
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

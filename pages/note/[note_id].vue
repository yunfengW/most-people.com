<template>
  <div id="page-note-id" ref="markdownElement">
    <mp-header title="">
      <template #right>
        <div class="edit" v-show="md.needPublish.value" @click="publish">
          <span>发布</span>
          <mp-icon name="publish" />
        </div>
        <div class="edit" @click="showEdit = true">
          <span>编辑</span>
          <mp-icon name="edit" />
        </div>
      </template>
    </mp-header>

    <input class="note-title" v-model="md.form.title" placeholder="输入标题" />
    <div class="note-public">
      <span>是否公开：</span>
      <el-switch v-model="md.form.isPublic" inline-prompt active-text="公开" inactive-text="私有" size="large" />
    </div>

    <template v-if="md.form.content">

      <div v-show="!showEdit" class="mp-markdown-box" v-html="md.render(md.form.content)"></div>
    </template>
    <div v-else-if="!md.form.inited" class="el-icon is-loading">
      <mp-icon name="loading" />
    </div>

    <div class="mp-markdown-editor" :class="{ 'show-edit': showEdit }">
      <div class="close" @click="showEdit = false">
        <mp-icon name="edit-back" />
      </div>

      <div class="preview mp-markdown-box" v-html="md.render(md.form.content)"></div>
      <monaco-editor class="editor" v-model="md.form.content" lang="markdown" :options="md.options" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMarkdown } from '~/composables/useMarkdown'

import api from '~/utils/api'

const route = useRoute()
const router = useRouter()
const note_id = (route.params.note_id || '') as string
const noteStore = useNoteStore()

const showEdit = ref(false)

const publish = async () => {
  let text = md.form.content
  if (md.form.isPublic == false) {
    text = await mp.encrypt(text)
  }
  const res = await api({
    method: 'put',
    url: '/note/update',
    data: {
      id: Number(note_id),
      title: md.form.title,
      content: text,
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
      noteStore.notes[i].content = text
    }
  }
}

const decrypt = async (content: string) => {
  if (content.startsWith('mp://')) {
    try {
      const text = await mp.decrypt(content)
      if (text) {
        return text
      }
    } catch (error) {
      console.error(error)
    }
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
    // 是否公开
    const isPublic = note.content.startsWith('mp://') === false
    md.form.isPublic = isPublic
    md.form.isPublicOld = isPublic
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

  .note-title {
    background: transparent;
    border: 0;
    outline: 0;
    font-size: 28px;
    line-height: 32px;
    font-weight: 700;
    width: 100%;
    text-align: center;
    background: #eee;
  }

  .note-public {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 100%;
    font-size: 14px;
    color: #909399;
  }
}
</style>

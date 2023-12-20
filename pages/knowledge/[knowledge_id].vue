<template>
  <div id="page-knowledge-id" ref="markdownElement">
    <mp-header title="">
      <template #right>
        <div
          class="edit"
          v-show="md.form.content !== md.form.contentOld || md.form.title !== md.form.titleOld"
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

    <input class="note-title" v-model="md.form.title" placeholder="输入标题" />

    <div
      v-if="md.form.content"
      v-show="!showEdit"
      class="mp-markdown-box"
      v-html="md.render(md.form.content)"
    ></div>
    <mp-loading v-else-if="!md.form.inited" />

    <div class="mp-markdown-editor" :class="{ 'show-edit': showEdit }">
      <div class="close" @click="showEdit = false">
        <mp-icon name="edit-back" />
      </div>

      <div class="preview mp-markdown-box" v-html="md.render(md.form.content)"></div>
      <monaco-editor
        class="editor"
        v-model="md.form.content"
        lang="markdown"
        :options="md.options"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMarkdown } from '~/composables/useMarkdown'

import api from '~/utils/api'

const knowledgeStore = useKnowledgeStore()

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

    md.form.titleOld = md.form.title
    md.form.contentOld = md.form.content

    const i = knowledgeStore.list.findIndex((knowledge) => String(knowledge.id) === knowledge_id)
    if (i !== -1) {
      knowledgeStore.list[i].title = md.form.title
      knowledgeStore.list[i].content = md.form.content
    }
  }
}

const init = async () => {
  const res = await api({ method: 'post', url: '/db/Knowledge/' + knowledge_id })
  md.form.inited = true
  if (res.data?.id) {
    const knowledge: Knowledge = res.data

    useHead({ title: knowledge.title })

    const text = knowledge.content || '# 新答案\n点击右上角 开启编辑'

    md.form.title = knowledge.title
    md.form.titleOld = knowledge.title
    md.form.content = text
    md.form.contentOld = text
  } else {
    mp.error('知识不存在')
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
#page-knowledge-id.page {
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
}
</style>

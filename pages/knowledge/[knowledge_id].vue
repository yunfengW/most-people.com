<template>
  <div id="page-knowledge-id" ref="markdownElement">
    <mp-header title="">
      <template #right v-if="userStore.user">
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

    <div
      v-if="md.form.content"
      v-show="!showEdit"
      class="mp-markdown-box"
      v-html="md.render(md.form.content)"
    ></div>
    <mp-loading v-else-if="!md.form.inited" />
    <div class="mp-markdown-editor" :class="{ 'show-edit': showEdit }" ref="editorElement"></div>
    <div class="close" @click="editEnd" v-show="showEdit">
      <mp-icon name="edit-back" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMarkdown } from '~/composables/useMarkdown'

import api from '~/utils/api'

const knowledgeStore = useKnowledgeStore()
const userStore = useUserStore()

const route = useRoute()
const router = useRouter()
const knowledge_id = (route.params.knowledge_id || '') as string

const showEdit = ref(false)

const editorElement = ref<HTMLDivElement>()

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

    md.backup.title = md.form.title
    md.backup.content = md.form.content

    const i = knowledgeStore.list.findIndex((knowledge) => String(knowledge.id) === knowledge_id)
    if (i !== -1) {
      knowledgeStore.list[i].title = md.form.title
      knowledgeStore.list[i].content = md.form.content
    }
  }
}

const editEnd = () => {
  md.form.content = editor.getMarkdown()
  showEdit.value = false
}

const init = async () => {
  const res = await api({ method: 'post', url: '/db/Knowledge/' + knowledge_id })
  md.form.inited = true
  if (res.data?.id) {
    const knowledge: Knowledge = res.data

    useHead({ title: knowledge.title })

    const text = knowledge.content || '# 新答案\n点击右上角 开启编辑'

    md.form.title = knowledge.title
    md.backup.title = knowledge.title
    md.form.content = text
    md.backup.content = text
    if (editor) {
      editor.setMarkdown(text)
    }
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

let editor: any
onMounted(() => {
  // toast UI
  const Editor = window.toastui.Editor
  // https://nhn.github.io/tui.editor/latest/ToastUIEditorCore
  editor = new Editor({
    el: editorElement.value,
    height: 'auto',
    initialValue: '',
    initialEditType: 'wysiwyg',
    // 不能切换到 markdown
    hideModeSwitch: false,
    usageStatistics: false,
    language: 'zh-CN',
    previewStyle: 'vertical',
    customHTMLRenderer: {
      link(node: any, context: any) {
        const { origin, entering } = context
        const result = origin()
        if (entering) {
          result.attributes.target = '_blank'
        }
        return result
      },
    },
  })
})
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

<template>
  <div id="page-tool" ref="markdownElement">
    <mp-header :title="toolName">
      <template #right v-if="userStore.user">
        <div class="edit" v-show="md.needPublish.value" @click="publish">
          <span>发布</span>
          <mp-icon name="publish" />
        </div>
        <div class="edit" @click="md.form.showEdit = true">
          <span>编辑</span>
          <mp-icon name="edit" />
        </div>
      </template>
    </mp-header>

    <mp-loading v-if="!md.form.inited" />

    <div ref="viewerElement" v-show="!md.form.showEdit" class="mp-markdown viewer" />

    <div
      ref="editorElement"
      :class="{ 'show-edit': md.form.showEdit }"
      class="mp-markdown editor"
    />
    <div class="close" @click="editEnd" v-show="md.form.showEdit">
      <mp-icon name="edit-back" />
    </div>
  </div>
</template>

<script setup lang="ts">
import api from '~/utils/api'
import { useMarkdown } from '~/composables/useMarkdown'

const route = useRoute()
const router = useRouter()
const tool_id = (route.params.tool_id || '') as string

const toolStore = useToolStore()
const userStore = useUserStore()

const toolName = computed(() => {
  const tool = toolStore.tools[tool_id]
  if (tool?.title) {
    useHead({ title: tool.title })
    return tool.title
  }
  return ''
})

const publish = async () => {
  const res = await api({
    method: 'put',
    url: '/tool/update.content',
    data: {
      id: Number(tool_id),
      content: md.form.content,
    },
  })
  if (res.data?.errorCode === 1004) {
    router.push('/login')
    return
  }
  if (res.data === true) {
    mp.success('发布成功！')
    md.backup.content = md.form.content
    const tool = toolStore.tools[tool_id]
    tool.content = md.form.content
  }
}

const editEnd = () => {
  md.form.content = editor.getMarkdown()
  md.form.showEdit = false
  viewer.setMarkdown(md.form.content)
}

const init = () => {
  md.form.inited = true

  const tool = toolStore.tools[tool_id]
  const text =
    tool?.content ||
    `#### 抱歉，暂时还没有「${tool.title}」的使用指南\n如果你有兴趣的话，加入我们吧\n![image](/img/join-us.jpg)`

  md.form.content = text
  md.backup.content = text
  viewer.setMarkdown(text)
  editor.setMarkdown(text)
}

const viewerElement = ref<HTMLDivElement>()
const editorElement = ref<HTMLDivElement>()
const md = useMarkdown(viewerElement, editorElement)

let viewer: any
let editor: any
onMounted(() => {
  editor = md.initEditor()
  viewer = md.initViewer()
  init()
})
watch(
  () => toolStore.tools,
  () => init(),
)
</script>

<style lang="scss">
#page-tool.page {
  .markdown-empty {
    text-align: center;

    .join-us {
      max-width: 375px;
    }
  }
}
</style>

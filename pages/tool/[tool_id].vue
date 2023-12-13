<template>
  <div id="page-tool" ref="markdownElement">
    <mp-header :title="toolName">
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
    <div class="markdown-empty" v-else-if="md.form.inited">
      <h4>抱歉，暂时还没有「{{ toolName }}」的使用指南</h4>
      <div>如果你有兴趣的话，加入我们吧</div>
      <br />
      <el-image class="join-us" src="/img/join-us.jpg" />
    </div>
    <mp-loading v-else />

    <div class="mp-markdown-editor" :class="{ 'show-edit': showEdit }">
      <div class="close" @click="showEdit = false">
        <mp-icon name="close" />
      </div>

      <div class="preview markdown-box" v-html="md.render(md.form.content)"></div>
      <monaco-editor class="editor" v-model="md.form.content" lang="markdown" :options="md.options" />
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

const showEdit = ref(false)

const toolName = computed(() => {
  const tool = toolStore.tools[tool_id]
  if (tool?.title) {
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
  if (res.data?.statusCode === 1004) {
    router.push('/login')
    return
  }
  if (res.data === true) {
    mp.success('发布成功！')
    md.form.contentOld = md.form.content
    const tool = toolStore.tools[tool_id]
    tool.content = md.form.content
  }
}

const init = () => {
  md.form.inited = true

  const tool = toolStore.tools[tool_id]
  const text = tool?.content
  if (text) {
    md.form.content = text
    md.form.contentOld = text
  }
}

const markdownElement = ref<HTMLDivElement>()
const md = useMarkdown(markdownElement)
onMounted(() => {
  init()
})
watch(
  () => toolStore.tools,
  () => {
    init()
  },
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

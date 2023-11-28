<template>
  <div id="page-tool" ref="markdownElement">
    <mp-header :title="toolName">
      <template #right>
        <div class="edit" v-show="markdown !== markdownOld" @click="publishGuide">
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
    <div class="markdown-empty" v-else-if="inited">
      <h4>抱歉，暂时还没有「{{ toolName }}」的使用指南</h4>
      <div>如果你有兴趣的话，加入我们吧</div>
      <br />
      <el-image class="join-us" src="/img/join-us.jpg" />
    </div>
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
const tool_id = (route.params.tool_id || '') as string

const toolStore = useToolStore()

const showEdit = ref(false)

const toolName = computed(() => {
  const tool = toolStore.tools[tool_id]
  if (tool?.zh) {
    return tool.zh
  }
  return tool_id as string
})

const publish = async () => {
  const res = await api({
    method: 'put',
    url: '/tool/update.how_to_use',
    data: {
      id: tool_id,
      markdown: markdown.value,
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
const init = () => {
  const tool = toolStore.tools[tool_id]
  const text = tool?.how_to_use
  if (text) {
    markdown.value = text
    markdownOld.value = text
  }
}

const { inited, markdown, render, markdownElement, publishGuide } = useMarkdown(publish)

if (process.client) {
  init()
}

watch(
  () => toolStore.tools,
  () => {
    inited.value = true
    init()
  },
)
</script>

<style lang="scss">
@import '~/assets/css/markdown.scss';

#page-tool.page {
  .markdown-empty {
    text-align: center;
    .join-us {
      max-width: 375px;
    }
  }
}
</style>

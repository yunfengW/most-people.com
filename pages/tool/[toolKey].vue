<template>
  <div id="page-tool">
    <mp-header :content="toolName">
      <template #extra>
        <el-button round @click="mp.info('正在开发中，请加入我们吧')">
          <template #icon>
            <mp-icon name="edit" />
          </template>
        </el-button>
      </template>
    </mp-header>

    <div v-show="html" ref="markdownElement" class="markdown-box" v-html="html"></div>
    <div v-if="inited && !html" class="empty">
      <h4>抱歉，暂时还没有「{{ toolName }}」的使用指南</h4>
      <div>如果你有兴趣的话，加入我们吧</div>
      <br />
      <el-image class="join-us" src="/img/join-us.jpg" />
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import rehypeRaw from 'rehype-raw'
import rehypeStringify from 'rehype-stringify'
import remarkRehype from 'remark-rehype'
import DOMPurify from 'dompurify'
import { useUserStore } from '~/stores/user'
import tools from '~/assets/json/tools.json'

// https://github.com/remarkjs/remark
const processor = unified()
  .use(remarkParse)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeRaw)
  .use(rehypeStringify).process

const html = ref('')
const inited = ref(false)
const markdownElement = ref<HTMLDivElement>()
const userStore = useUserStore()

const render = async (md: string) => {
  const file = await processor(md)
  const clean = DOMPurify.sanitize(file.toString(), { ADD_TAGS: ['mp-mi'] })
  html.value = clean
  // mp-mi
  nextTick(() => {
    if (!markdownElement.value) return
    const miList = markdownElement.value.querySelectorAll('mp-mi') as unknown as HTMLDivElement[]
    for (const mi of miList) {
      mi.addEventListener('click', async (event: any) => {
        const tagName = event?.target?.tagName
        if (tagName === 'A') {
          const input = event.target.previousSibling
          if (input.tagName === 'INPUT') {
            const password = input.value as string
            const text = mi.querySelector('span')?.innerText || ''
            const { key } = await mp.key('most-people', password)
            const decrypted = await mp.decrypt(text, key)
            if (decrypted) {
              mi.innerHTML = `<div>${decrypted.replaceAll('\n', '<br />')}</div>`
            } else {
              mp.error('密码错误')
            }
          }
        }
      })
      mi.innerHTML = `<span>${mi.innerText}</span><input placeholder="输入密码" /><a>解密</a>`
    }
  })
}

const route = useRoute()
const toolKey = route.params.toolKey
const toolName = computed(() => {
  const tool = tools[toolKey as 'Bing']
  if (tool) {
    return tool.zh
  }
  return toolKey
})
const init = () => {
  axios({
    url: `https://cdn.most-people.cn/tool/${toolKey}.md`,
  })
    .then((res) => {
      const md = res.data as string
      if (md) {
        render(md)
      }
    })
    .catch((err) => {
      // mp.error(err.message)
    })
    .finally(() => {
      inited.value = true
    })
}
if (process.client) {
  init()
}
</script>

<style lang="scss">
#page-tool {
  .markdown-box {
    word-break: break-word;
  }
  .empty {
    text-align: center;
    .join-us {
      max-width: 375px;
    }
  }

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
</style>

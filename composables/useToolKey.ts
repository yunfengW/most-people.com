import axios from 'axios'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import rehypeRaw from 'rehype-raw'
import rehypeStringify from 'rehype-stringify'
import remarkRehype from 'remark-rehype'
import DOMPurify from 'dompurify'
import tools from '~/assets/json/tools.json'

export const useToolKey = () => {
  // https://github.com/remarkjs/remark
  const processor = unified()
    .use(remarkParse)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeStringify).process

  const html = ref('')
  const inited = ref(false)
  const markdownElement = ref<HTMLDivElement>()
  const route = useRoute()
  const toolKey = route.params.toolKey

  const toolName = computed(() => {
    const tool = tools[toolKey as 'Bing']
    if (tool) {
      return tool.zh
    }
    return toolKey
  })

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

  const markdown = ref('')
  const init = () => {
    axios({
      url: `https://cdn.most-people.cn/tool/${toolKey}.md`,
    })
      .then((res) => {
        const md = res.data as string
        if (md) {
          markdown.value = md
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

  const editorElement = ref<HTMLDivElement>()

  onMounted(async () => {
    // const { editor } = await import('monaco-editor')
    // if (!editorElement.value) {
    //   return
    // }
    // const markdownEditor = editor.create(editorElement.value, {
    //   value: markdown.value,
    //   language: 'markdown',
    //   tabSize: 2,
    //   minimap: {
    //     enabled: false,
    //   },
    // })
    // console.log('markdownEditor', markdownEditor)
  })

  return {
    inited,
    html,
    toolName,
    editorElement,
  }
}

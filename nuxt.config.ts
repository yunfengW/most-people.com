const { execSync } = require('child_process')
let branch = ''
if (process.env.VERCEL_GIT_COMMIT_REF) {
  branch = process.env.VERCEL_GIT_COMMIT_REF
} else {
  branch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim()
}
console.log('The branch is:', branch)
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: 'Most People | 动员群众，解决难题 | 密码朋克',
      meta: [
        {
          name: 'description',
          content: '全世界无产者，联合起来！',
        },
      ],
      link: [
        {
          rel: 'stylesheet',
          href: 'https://uicdn.toast.com/editor/latest/toastui-editor.min.css',
        },
      ],
      // https://bytedance.feishu.cn/wiki/wikcnJZV45hM71QgI60iwkzvXob
      script: [
        { defer: true, src: '/js/iconpark.js' },
        { defer: true, src: 'https://uicdn.toast.com/editor/latest/toastui-editor-all.min.js' },
        { defer: true, src: 'https://uicdn.toast.com/editor/latest/i18n/zh-cn.js' },
      ],
    },
  },
  vue: {
    compilerOptions: {
      isCustomElement: (tag) => {
        return tag === 'iconpark-icon'
      },
    },
  },
  // generate
  experimental: {
    payloadExtraction: false,
  },
  // modules
  modules: ['@element-plus/nuxt', '@pinia/nuxt', 'nuxt-monaco-editor', '@nuxtjs/device'],
  monacoEditor: { locale: 'zh-hans' },
  // https://content.nuxtjs.org/examples/mdc/nested-components
  components: [{ path: '~/components', global: true }],
  elementPlus: { importStyle: 'scss' },
  devServer: {
    host: '0.0.0.0',
    port: 2023,
  },
})

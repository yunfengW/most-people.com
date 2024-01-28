// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: 'Most People | 动员群众，解决难题 | 密码朋克',
      meta: [
        {
          name: 'description',
          content: '让每个人都能成为密码朋克！',
        },
      ],
      link: [
        {
          rel: 'stylesheet',
          href: 'https://uicdn.toast.com/editor/latest/toastui-editor.min.css',
        },
        { rel: 'icon', href: '/favicon.ico', type: 'image/x-icon' },
        { rel: 'shortcut icon', href: '/favicon.ico', type: 'image/x-icon' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/favicon.png' },
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
  modules: [
    // Element Plus
    '@element-plus/nuxt',
    // 状态管理
    '@pinia/nuxt',
    // VS Code 编辑器
    'nuxt-monaco-editor',
    // 设备信息
    '@nuxtjs/device',
  ],
  monacoEditor: { locale: 'zh-hans' },
  // https://content.nuxtjs.org/examples/mdc/nested-components
  components: [{ path: '~/components', global: true }],
  elementPlus: { importStyle: 'scss' },
  devServer: {
    host: '0.0.0.0',
    port: 2023,
  },
})

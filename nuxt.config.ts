// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: 'Most People',
      meta: [
        {
          name: 'description',
          content: 'Most People | 动员群众，解决难题 | 密码朋克',
        },
      ],
      // https://bytedance.feishu.cn/wiki/wikcnJZV45hM71QgI60iwkzvXob
      script: [{ defer: true, src: '/js/iconpark.js' }],
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

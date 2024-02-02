const { VITE_Data, VITE_Frontend } = import.meta.env
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
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'shortcut icon', type: 'image/svg+xml', href: '/favicon.svg' },
        // apple
        { rel: 'apple-touch-icon', type: 'image/png', href: '/favicon.png' },
        // 后备选项
        { rel: 'alternate icon', href: '/favicon.ico' },
        {
          // href: 'https://uicdn.toast.com/editor/latest/toastui-editor.min.css',
          rel: 'stylesheet',
          href: VITE_Data + '/cdn/css/toastui-editor.min.css',
        },
        {
          // https://www.jsdelivr.com/package/npm/prismjs
          rel: 'stylesheet',
          href: VITE_Data + '/cdn/css/prism.min.css',
        },
        {
          // href: 'https://uicdn.toast.com/editor-plugin-code-syntax-highlight/latest/toastui-editor-plugin-code-syntax-highlight.min.css',
          rel: 'stylesheet',
          href: VITE_Data + '/cdn/css/toastui-editor-plugin-code-syntax-highlight.min.css',
        },
      ],
      script: [
        {
          // https://bytedance.feishu.cn/wiki/wikcnJZV45hM71QgI60iwkzvXob
          defer: true,
          src: '/js/iconpark.js',
        },
        {
          // src: 'https://uicdn.toast.com/editor/latest/toastui-editor-all.min.js',
          src: VITE_Data + '/cdn/js/toastui-editor-all.min.js',
        },
        {
          // src: 'https://uicdn.toast.com/editor/latest/i18n/zh-cn.js',
          src: VITE_Data + '/cdn/js/zh-cn.js',
        },
        {
          // src: 'https://uicdn.toast.com/editor-plugin-code-syntax-highlight/latest/toastui-editor-plugin-code-syntax-highlight-all.min.js',
          src: VITE_Data + '/cdn/js/toastui-editor-plugin-code-syntax-highlight-all.min.js',
        },
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
    // 设备信息
    '@nuxtjs/device',
  ],
  // https://content.nuxtjs.org/examples/mdc/nested-components
  components: [{ path: '~/components', global: true }],
  elementPlus: { importStyle: 'scss' },
  devServer: {
    host: 'localhost',
    port: VITE_Frontend,
  },
})

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: '动员群众，解决难题',
      meta: [
        {
          name: 'description',
          content: 'AI 时代的万能工具箱',
        },
      ],
      script: ['/js/iconpark.js'],
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
  modules: ['@element-plus/nuxt', '@pinia/nuxt'],
  // https://content.nuxtjs.org/examples/mdc/nested-components
  components: [{ path: '~/components', global: true }],
  elementPlus: { importStyle: 'scss' },
})

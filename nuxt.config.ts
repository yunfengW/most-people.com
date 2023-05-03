// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@element-plus/nuxt', '@pinia/nuxt', '@nuxt/content'],
  content: {
    documentDriven: true,
  },
  elementPlus: { importStyle: 'scss' },
  app: {
    head: {
      title: '动员群众，解决难题',
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
})

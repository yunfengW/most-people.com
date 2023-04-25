// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@element-plus/nuxt', '@pinia/nuxt'],
  elementPlus: { importStyle: 'scss' },
  app: {
    head: {
      title: '动员群众，解决难题',
    },
  },
  // generate
  experimental: {
    payloadExtraction: false,
  },
})

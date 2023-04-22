// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@element-plus/nuxt"],
  elementPlus: { importStyle: "scss" },
  experimental: {
    payloadExtraction: false,
  },
});

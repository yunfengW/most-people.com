<template>
  <div id="page-utils">
    <mp-header content="工具函数" />
    <h4>hyphenate：自动把驼峰命名法（camelCase）转换为短横线分隔命名法（kebab-case）</h4>
    <el-input v-model="form.hyphenate" />
    <p>{{ hyphenate(form.hyphenate) }}</p>
    <h4>camelize：自动把短横线分隔命名法（kebab-case）转换为驼峰命名法（camelCase）</h4>
    <el-input v-model="form.camelize" />
    <p>{{ camelize(form.camelize) }}</p>
  </div>
</template>

<script setup lang="ts">
const hyphenate = (str: string) => {
  return str.replace(/\B([A-Z])/g, '-$1').toLowerCase()
}
const camelize = (str: string) => {
  const result = str.replace(/-(\w)/g, (_, c) => (c ? c.toUpperCase() : ''))
  return result.charAt(0).toUpperCase() + result.slice(1)
}

const form = reactive({
  hyphenate: 'ChatGPT',
  camelize: 'git-hub',
})
</script>

<style lang="scss">
#page-utils {
  .el-input {
    .el-input__wrapper {
      .el-input__inner {
        text-align: center;
      }
    }
  }
}
</style>

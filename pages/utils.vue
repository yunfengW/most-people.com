<template>
  <div id="page-utils">
    <mp-header content="工具函数" />
    <!-- <h4>hyphenate:</h4>
    <p>驼峰命名法（camelCase）转换为短横线分隔命名法（kebab-case）</p>
    <el-input v-model="form.hyphenate" />
    <p>{{ mp.hyphenate(form.hyphenate) }}</p>
    <h4>camelize:</h4>
    <p>短横线分隔命名法（kebab-case）转换为驼峰命名法（camelCase）+ 首字母大写</p>
    <el-input v-model="form.camelize" />
    <p>{{ mp.camelize(form.camelize) }}</p> -->

    <el-input v-model="form.username" placeholder="username"></el-input>
    <el-input v-model="form.password" placeholder="password" show-password></el-input>

    <h2>{{ form.address }}</h2>

    <el-button @click="submit">生成地址</el-button>
  </div>
</template>

<script setup lang="ts">
const form = reactive({
  hyphenate: 'ChatGPT',
  camelize: 'git-hub',

  // temp
  username: '',
  password: '',
  address: '',
})
const submit = async () => {
  const { address } = await mp.key(form.username, form.password)
  form.address = address
}
</script>

<style lang="scss">
#page-utils.page {
  align-items: flex-start;
}
</style>

<template>
  <div id="page-utils">
    <mp-header content="Web3" />
    <el-input v-model="form.username" placeholder="username" />
    <br />
    <el-input v-model="form.password" placeholder="password" show-password />
    <h2>Address: {{ form.address }}</h2>
    <el-button @click="submit">生成地址 + 私钥</el-button>
    <br />
    <el-input v-model="form.privateKey" placeholder="Private Key" show-password />
    <p>任何拥有您私钥的人都可以窃取您账户中的任何资产，切勿泄露。</p>
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
  privateKey: '',
})
const submit = async () => {
  const { address, privateKey } = await mp.key(form.username, form.password)
  form.address = address
  form.privateKey = privateKey
}
</script>

<style lang="scss">
#page-utils.page {
  align-items: flex-start;
}
</style>

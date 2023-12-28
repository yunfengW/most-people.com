<template>
  <div id="page-index">
    <el-input v-model="form.message" :placeholder="form.placeholder" @keyup.enter="enter" />
    <mp-loading />
  </div>
</template>

<script setup lang="ts">
const { form, enter } = useIndex()
</script>

<style lang="scss">
#page-index {
  padding: 20px;
}
</style>

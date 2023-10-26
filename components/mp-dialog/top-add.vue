<template>
  <mp-dialog class="mp-dialog-top-add" title="添加类别">
    <el-form @submit.prevent ref="formElement" :model="form" label-position="top">
      <el-form-item prop="category" :rules="[{ validator: checkCategory, trigger: 'blur' }]">
        <el-input v-model.trim="form.category" clearable />
      </el-form-item>
      <el-button type="primary" @click="topAdd">添加</el-button>
    </el-form>
  </mp-dialog>
</template>

<script setup lang="ts">
import { FormInstance } from 'element-plus'

const $emit = defineEmits(['close'])

const toolStore = useToolStore()
const formElement = ref<FormInstance>()
const form = reactive({
  category: '',
})

const topAdd = () => {
  if (!formElement.value) return
  formElement.value.validate(async (ok: boolean) => {
    if (ok) {
      toolStore.toolsTop.push({
        zh: form.category,
        list: [],
      })
      form.category = ''
      $emit('close')
    }
  })
}

// check
const checkCategory = (_rule: any, v: string, callback: (err?: Error) => void) => {
  const category = v
  if (!category) {
    return callback(new Error('请输入类别'))
  }
  // const categories = toolStore.toolsTop.map((e) => e.zh)
  callback()
}
</script>

<style lang="scss">
.mp-dialog-top-add {
  .el-button {
    margin-top: 12px;
    width: 100%;
  }
}
</style>

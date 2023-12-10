<template>
  <mp-dialog class="mp-dialog-tool-edit" :title="form.isAdd ? '添加工具' : '编辑工具'">
    <div class="how-to-use" v-if="!form.isAdd">
      <nuxt-link :to="`/tool/${form.id}`" target="_blank">使用指南</nuxt-link>
    </div>
    <el-form @submit.prevent ref="formElement" :model="form" label-position="top">
      <el-form-item
        prop="title"
        :rules="[{ required: true, trigger: 'blur', message: '请输入名字' }]"
        label="中文"
      >
        <el-input v-model.trim="form.title" clearable />
      </el-form-item>

      <el-form-item
        prop="id"
        :rules="[{ required: true, trigger: 'blur', message: '请输入工具 logo' }]"
        label="Logo"
      >
        <mp-upload :url="form.logo" @change="(file) => (form.logoFile = file)" />
      </el-form-item>

      <el-form-item
        prop="id"
        :rules="[{ required: true, trigger: 'blur', message: '请输入工具网址' }]"
        label="网址「most-people」"
      >
        <el-input
          v-model.trim="form.url"
          type="textarea"
          :autosize="{ minRows: 2 }"
          resize="none"
        />
      </el-form-item>

      <el-form-item label="一句话介绍（选填）">
        <el-input
          v-model.trim="form.intro"
          type="textarea"
          :autosize="{ minRows: 2 }"
          resize="none"
        />
      </el-form-item>

      <div class="button-box">
        <el-button @click="$emit('close')">取消</el-button>
        <el-button type="primary" @click="toolSave">确认</el-button>
      </div>
    </el-form>
  </mp-dialog>
</template>

<script setup lang="ts">
import type { FormInstance } from 'element-plus'

interface Props {
  tool_id: number
}
const $props = defineProps<Props>()
const $emit = defineEmits(['close'])

const toolStore = useToolStore()
const formElement = ref<FormInstance>()
const form = reactive({
  id: 0,
  title: '',
  logo: '',
  url: '',
  intro: '' as undefined | string,
  logoFile: undefined as undefined | File,
  loading: false,
  isAdd: false,
})

const toolSave = () => {
  if (!formElement.value) return
  formElement.value.validate(async (ok: boolean) => {
    if (ok) {
      form.loading = true

      let logoDel = toolStore.tools[form.id]?.logoDel
      if (form.logoFile && !form.logo.startsWith('blob:')) {
        logoDel = form.logo
      }
      toolStore.tools[form.id] = {
        id: form.id,
        title: form.title,
        logo: form.logoFile ? URL.createObjectURL(form.logoFile!) : form.logo,
        url: form.url,
        intro: form.intro || '',
        logoFile: form.logoFile,
        logoDel,
      }

      $emit('close')
    }
  })
}

onUpdated(() => {
  const tool = toolStore.tools[$props.tool_id]
  if (tool) {
    // 编辑
    form.isAdd = false

    form.id = tool.id
    form.title = tool.title
    form.logo = tool.logo
    form.url = tool.url
    form.intro = tool.intro
    form.logoFile = tool.logoFile
  } else {
    // 添加
    form.isAdd = true
    // 重置状态
    form.id = 0
    form.title = ''
    form.logo = ''
    form.url = ''
    form.intro = ''
    form.logoFile = undefined
  }
  form.loading = false
})
</script>

<style lang="scss">
.mp-dialog-tool-edit {
  input,
  textarea {
    font-size: 16px;
    color: #000;
  }

  .button-box {
    margin-top: 24px;
    display: flex;
    justify-content: space-between;
    .el-button {
      width: 48%;
    }
  }

  .how-to-use {
    text-align: center;
    margin-bottom: 16px;
  }
}
</style>

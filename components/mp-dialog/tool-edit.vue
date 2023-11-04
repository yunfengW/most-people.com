<template>
  <mp-dialog class="mp-dialog-tool-edit" :title="form.isAdd ? '添加工具' : '编辑工具'">
    <el-form @submit.prevent ref="formElement" :model="form" label-position="top">
      <el-form-item
        prop="zh"
        :rules="[{ required: true, trigger: 'blur', message: '请输入名字' }]"
        label="中文"
      >
        <el-input v-model.trim="form.zh" clearable />
      </el-form-item>

      <el-form-item
        prop="id"
        :rules="[
          { required: true, trigger: 'blur', message: '请输入工具 ID' },
          { validator: checkToolKey, trigger: 'blur' },
        ]"
        label="工具 ID"
      >
        <el-input v-model.trim="form.id" clearable />
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

      <el-button type="primary" @click="toolSave" :loading="form.loading">确认</el-button>
    </el-form>
  </mp-dialog>
</template>

<script setup lang="ts">
import { FormInstance } from 'element-plus'

interface Props {
  toolKey: string
}
const $props = defineProps<Props>()
const $emit = defineEmits(['close'])

const toolStore = useToolStore()
const formElement = ref<FormInstance>()
const form = reactive({
  id: '',
  zh: '',
  logo: '',
  url: '',
  logoFile: undefined as undefined | File,
  loading: false,
  isAdd: false,
})

const toolSave = () => {
  if (!formElement.value) return
  formElement.value.validate(async (ok: boolean) => {
    if (ok) {
      form.loading = true
      toolStore.tools[form.id] = {
        id: form.id,
        zh: form.zh,
        logo: form.logoFile ? URL.createObjectURL(form.logoFile!) : form.logo,
        url: form.url,
        logoFile: form.logoFile,
        logoDel: form.logoFile ? form.logo : undefined,
      }
      $emit('close')
    }
  })
}

// check
const checkToolKey = (_rule: any, v: string, callback: (err?: Error) => void) => {
  const id = v
  if (!/^[a-zA-Z0-9]+$/.test(id)) {
    return callback(new Error('只能包含字母和数字'))
  }
  if (form.isAdd && toolStore.tools[id]) {
    return callback(new Error(`工具 ID ${id} 已存在`))
  }
  callback()
}

onUpdated(() => {
  const tool = toolStore.tools[$props.toolKey]
  if (tool) {
    // 编辑
    form.isAdd = false

    form.id = tool.id
    form.zh = tool.zh
    form.logo = tool.logo
    form.url = tool.url
    form.logoFile = tool.logoFile
  } else {
    // 添加
    form.isAdd = true
    // 重置状态
    form.id = ''
    form.zh = ''
    form.logo = ''
    form.url = ''
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
  .el-button {
    margin-top: 12px;
    width: 100%;
  }
}
</style>

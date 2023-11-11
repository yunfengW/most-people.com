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
        zh: form.zh,
        logo: form.logoFile ? URL.createObjectURL(form.logoFile!) : form.logo,
        url: form.url,
        intro: form.intro || '',
        logoFile: form.logoFile,
        logoDel,
      }

      if ($props.toolKey !== form.id) {
        // 删除旧的
        delete toolStore.tools[$props.toolKey]
        for (const top of toolStore.toolsTop) {
          for (let index = 0; index < top.list.length; index++) {
            const item = top.list[index]
            if (item === $props.toolKey) {
              // 修改排行榜中的 key
              top.list[index] = form.id
            }
          }
        }
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
    form.intro = tool.intro
    form.logoFile = tool.logoFile
  } else {
    // 添加
    form.isAdd = true
    // 重置状态
    form.id = ''
    form.zh = ''
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
}
</style>

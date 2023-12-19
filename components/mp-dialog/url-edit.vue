<template>
  <mp-dialog
    class="mp-dialog-url-edit"
    :title="form.isAdd ? '添加书签' : '编辑书签'"
    :close-on-click-modal="false"
  >
    <el-form @submit.prevent ref="formElement" :model="form" label-position="top">
      <el-form-item
        prop="name"
        :rules="[{ required: true, trigger: 'blur', message: '请输入名字' }]"
        label="名称"
      >
        <el-input v-model.trim="form.name" clearable />
      </el-form-item>

      <el-form-item
        prop="url"
        :rules="[{ required: true, trigger: 'blur', message: '请输入超链接' }]"
        label="网址"
      >
        <el-input
          v-model.trim="form.url"
          type="textarea"
          :autosize="{ minRows: 2 }"
          resize="none"
        />
      </el-form-item>

      <!-- <div class="how-to-use">
        <nuxt-link to="/knowledge/70" target="_blank">获取网站图标</nuxt-link>
      </div>

      <el-form-item prop="icon" label="图标">
        <mp-upload :url="form.icon" @change="(file) => (form.iconFile = file)" />
      </el-form-item> -->

      <div class="button-box">
        <el-button @click="$emit('close')">取消</el-button>
        <el-button type="primary" :loading="form.loading" @click="submit">确认</el-button>
      </div>
    </el-form>
  </mp-dialog>
</template>

<script setup lang="ts">
import api from '~/utils/api'

import type { FormInstance, ElInput } from 'element-plus'

interface Props {
  url_index: number
}
const $props = defineProps<Props>()
const $emit = defineEmits(['close'])

const userStore = useUserStore()
const formElement = ref<FormInstance>()
const form = reactive({
  name: '',
  icon: '' as string | undefined,
  url: '',
  // 其它状态
  iconFile: undefined as undefined | File,
  loading: false,
  isAdd: false,
})

const urlSave = async () => {
  const url = {
    name: form.name,
    url: form.url,
  }
  const urls = userStore.user?.urls
  if (urls) {
    urls[$props.url_index] = url
  }
  $emit('close')
}

const urlAdd = async () => {
  const url = {
    name: form.name,
    url: form.url,
  }

  if (userStore.user) {
    if (userStore.user.urls) {
      userStore.user.urls.push(url)
    } else {
      userStore.user.urls = [url]
    }
  }
  $emit('close')
}

const submit = () => {
  if (!formElement.value) return
  formElement.value.validate(async (ok: boolean) => {
    if (ok) {
      form.loading = true
      if (form.isAdd) {
        urlAdd()
      } else {
        urlSave()
      }
    }
  })
}

onUpdated(() => {
  const urls = userStore.user?.urls || []
  const url = urls[$props.url_index]
  if (url) {
    // 编辑
    form.isAdd = false
    // 加载状态
    // 重置状态
    form.name = url.name
    form.url = url.url
    form.icon = url.icon
  } else {
    // 添加
    form.isAdd = true
    // 重置状态
    form.name = ''
    form.url = ''
    form.icon = ''
  }
  form.loading = false
  // 移除校验结果
  if (formElement.value) {
    formElement.value.clearValidate()
  }
})
</script>

<style lang="scss">
.mp-dialog-url-edit {
  .how-to-use {
    text-align: center;
  }

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

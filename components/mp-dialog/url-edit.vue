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
        <el-input v-model="form.name" clearable />
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

      <div class="how-to-use">
        <nuxt-link to="/knowledge/70" target="_blank">获取网站图标</nuxt-link>
      </div>
      <div class="url-icon">
        <img :src="form.icon || '/favicon.ico'" @error="iconError" alt="icon" />
      </div>

      <el-form-item prop="icon" label="图标">
        <el-input v-model.trim="form.icon" />
      </el-form-item>

      <div class="button-box">
        <el-button @click="$emit('close')" v-if="form.isAdd">取消</el-button>
        <el-button type="danger" @click="urlDel" v-else>删除</el-button>
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

const iconError = (event: any) => {
  event.target.src = '/favicon.ico'
  form.icon = ''
}

const urlDel = () => {
  const urls = userStore.user?.urls
  if (urls) {
    urls.splice($props.url_index, 1)
  }
  updateUrls()
  $emit('close')
}

const urlSave = () => {
  const url = {
    name: form.name,
    url: form.url,
    icon: form.icon,
  }
  const urls = userStore.user?.urls
  if (urls) {
    urls[$props.url_index] = url
  }
  updateUrls()
  $emit('close')
}

const urlAdd = () => {
  const url = {
    name: form.name,
    url: form.url,
    icon: form.icon,
  }
  if (userStore.user) {
    if (userStore.user.urls) {
      userStore.user.urls.push(url)
    } else {
      userStore.user.urls = [url]
    }
  }
  updateUrls()
  $emit('close')
}

const updateUrls = async () => {
  const urls = userStore.user?.urls
  if (urls) {
    const json = JSON.stringify(urls)
    console.log('🌊', json)
  }
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

  .url-icon {
    margin-top: 10px;
    display: flex;
    justify-content: center;
    img {
      width: 20px;
      height: 20px;
    }
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

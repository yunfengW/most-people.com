<template>
  <mp-dialog
    class="mp-dialog-url-edit"
    :title="form.isAdd ? '添加书签' : '编辑书签'"
    :close-on-click-modal="false"
  >
    <el-form @submit.prevent ref="formElement" :model="form" label-position="top">
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

      <el-form-item
        prop="title"
        :rules="[{ required: true, trigger: 'blur', message: '请输入名字' }]"
        label="中文"
      >
        <el-input v-model.trim="form.name" clearable />
      </el-form-item>

      <el-form-item prop="icon" label="图标">
        <mp-upload :url="form.icon" @change="(file) => (form.iconFile = file)" />
      </el-form-item>

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

const router = useRouter()

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

const uploadLogo = async (file: File) => {
  // const { id, logo } = form
  // // 创建FormData对象
  // const formData = new FormData()
  // // 'file'是要上传的文件字段名，file是要上传的文件对象
  // formData.append('file', file)
  // formData.append('id', String(id))
  // formData.append('logo', logo)
  // const res = await api({
  //   method: 'put',
  //   url: '/data/tool.logo.update',
  //   data: formData,
  //   headers: { 'Content-Type': 'multipart/form-data' },
  // })
  // if (res.data?.statusCode === 1004) {
  //   router.push('/login')
  //   return
  // }
  // if (res.data) {
  //   const url = new URL(res.data)
  //   url.searchParams.set('t', String(Date.now()))
  //   return url.href
  // }
}

const toolSave = async () => {
  // // 上传 logo
  // if (form.logoFile) {
  //   const logo = await uploadLogo(form.logoFile)
  //   form.logoFile = undefined
  //   if (!logo) {
  //     mp.error('logo 上传失败')
  //     return
  //   }
  //   form.logo = logo
  // }
  // // 更新 tool
  // const res = await api({
  //   method: 'put',
  //   url: '/tool/update',
  //   data: {
  //     id: form.id,
  //     title: form.title,
  //     url: form.url,
  //     top: form.top,
  //     logo: form.logo,
  //     intro: form.intro,
  //     tags: form.tags,
  //   },
  // })
  // if (res.data?.statusCode === 1004) {
  //   router.push('/login')
  //   return
  // }
  // if (res.data?.id) {
  //   toolStore.tools[res.data.id] = res.data
  //   toolStore.initTops()
  //   mp.success('保存成功')
  // }
  // $emit('close')
}

const toolAdd = async () => {
  // 创建
  // const res = await api({
  //   method: 'put',
  //   url: '/tool/add',
  //   data: {
  //     title: form.title,
  //     url: form.url,
  //     top: form.top,
  //     intro: form.intro,
  //     logo: '/favicon.ico',
  //   },
  // })
  // if (res.data?.statusCode === 1004) {
  //   router.push('/login')
  //   return
  // }
  // if (res.data?.id) {
  //   form.id = res.data.id
  //   toolSave()
  // }
}

const submit = () => {
  if (!formElement.value) return
  formElement.value.validate(async (ok: boolean) => {
    if (ok) {
      form.loading = true
      if (form.isAdd) {
        toolAdd()
      } else {
        toolSave()
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

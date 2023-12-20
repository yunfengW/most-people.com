<template>
  <mp-dialog
    class="mp-dialog-tool-edit"
    :title="form.isAdd ? '添加工具' : '编辑工具'"
    :close-on-click-modal="false"
  >
    <div class="how-to-use" v-if="!form.isAdd">
      <nuxt-link :to="`/tool/${form.id}`" target="_blank">使用指南</nuxt-link>
    </div>
    <el-form @submit.prevent ref="formElement" :model="form" label-position="top">
      <el-form-item
        prop="title"
        :rules="[{ required: true, trigger: 'blur', message: '请输入名字' }]"
        label="中文"
      >
        <el-input v-model="form.title" clearable />
      </el-form-item>

      <el-form-item
        :prop="form.isAdd ? 'logoFile' : 'logo'"
        :rules="[{ required: true, trigger: 'blur', message: '请上传图片' }]"
        label="Logo"
      >
        <mp-upload :url="form.logo" @change="(file) => (form.logoFile = file)" />
        <nuxt-link class="get-icon" to="/knowledge/70" target="_blank">
          <el-button link>获取网站图标</el-button>
        </nuxt-link>
      </el-form-item>

      <el-form-item
        prop="url"
        :rules="[{ required: true, trigger: 'blur', message: '请输入网址' }]"
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
        <el-input v-model="form.intro" type="textarea" :autosize="{ minRows: 2 }" resize="none" />
      </el-form-item>

      <el-form-item label="排名（选填）">
        <el-input-number v-model="form.top" :min="1" :max="1000" />
      </el-form-item>

      <el-form-item label="分类（选填）">
        <div class="tags">
          <el-tag
            v-for="tag in form.tags"
            :key="tag"
            closable
            :disable-transitions="false"
            @close="removeTag(tag)"
          >
            {{ tag }}
          </el-tag>
          <template v-if="form.tags.length === 0">
            <el-input
              v-if="form.showAddTag"
              ref="addTagElement"
              v-model="form.newTag"
              size="small"
              @keyup.enter="tagAdd"
              @blur="tagAdd"
            />
            <el-button v-else class="button-new-tag ml-1" size="small" @click="tagInputFocus">
              + 新分类
            </el-button>
          </template>
        </div>
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

const addTagElement = ref<InstanceType<typeof ElInput>>()

const removeTag = (tag: string) => {
  form.tags.splice(form.tags.indexOf(tag), 1)
}

const tagInputFocus = () => {
  form.showAddTag = true
  nextTick(() => {
    addTagElement.value!.input!.focus()
  })
}

const tagAdd = () => {
  if (form.newTag) {
    if (form.tags.includes(form.newTag)) {
      mp.info(`${form.newTag} 已存在`)
    } else {
      form.tags.push(form.newTag)
    }
  }
  form.showAddTag = false
  form.newTag = ''
}

interface Props {
  tool_id: number
}
const $props = defineProps<Props>()
const $emit = defineEmits(['close'])

const router = useRouter()

const toolStore = useToolStore()
const formElement = ref<FormInstance>()
const form = reactive({
  id: 0,
  title: '',
  logo: '',
  url: '',
  intro: '',
  top: 1000,
  tags: [] as string[],
  // 其它状态
  newTag: '',
  showAddTag: false,
  logoFile: undefined as undefined | File,
  loading: false,
  isAdd: false,
})

const uploadLogo = async (file: File) => {
  const { id, logo } = form
  // 创建FormData对象
  const formData = new FormData()
  // 'file'是要上传的文件字段名，file是要上传的文件对象
  formData.append('file', file)
  formData.append('id', String(id))
  formData.append('logo', logo)
  const res = await api({
    method: 'put',
    url: '/data/tool.logo.update',
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  if (res.data?.statusCode === 1004) {
    router.push('/login')
    return
  }
  if (res.data) {
    const url = new URL(res.data)
    url.searchParams.set('t', String(Date.now()))
    return url.href
  }
}

const toolSave = async () => {
  // 上传 logo
  if (form.logoFile) {
    const logo = await uploadLogo(form.logoFile)
    form.logoFile = undefined
    if (!logo) {
      mp.error('logo 上传失败')
      return
    }
    form.logo = logo
  }
  // 更新 tool
  const res = await api({
    method: 'put',
    url: '/tool/update',
    data: {
      id: form.id,
      title: form.title,
      url: form.url,
      top: form.top,
      logo: form.logo,
      intro: form.intro,
      tags: form.tags,
    },
  })
  if (res.data?.statusCode === 1004) {
    router.push('/login')
    return
  }
  if (res.data?.id) {
    toolStore.tools[res.data.id] = res.data
    toolStore.initTops()
    mp.success('保存成功')
  }
  $emit('close')
}

const toolAdd = async () => {
  // 创建
  const res = await api({
    method: 'put',
    url: '/tool/add',
    data: {
      title: form.title,
      url: form.url,
      top: form.top,
      intro: form.intro,
      logo: '/favicon.ico',
    },
  })
  if (res.data?.statusCode === 1004) {
    router.push('/login')
    return
  }
  if (res.data?.id) {
    form.id = res.data.id
    toolSave()
  }
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
  const tool = toolStore.tools[$props.tool_id]
  if (tool) {
    // 编辑
    form.isAdd = false
    // 加载状态
    form.id = tool.id
    form.url = tool.url
    form.title = tool.title
    form.intro = tool.intro
    form.logo = tool.logo
    form.logoFile = undefined
    form.top = tool.top || 1000
    form.tags = tool.tags || []
  } else {
    // 添加
    form.isAdd = true
    // 重置状态
    form.id = 0
    form.url = ''
    form.title = ''
    form.intro = ''
    form.logo = ''
    form.logoFile = undefined
    form.top = 1000
    form.tags = []
  }
  form.loading = false
  // 移除校验结果
  if (formElement.value) {
    formElement.value.clearValidate()
  }
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
  }

  .get-icon {
    margin-left: auto;
  }

  .tags {
    .el-tag {
      margin-right: 10px;
    }
    .el-button,
    .el-input {
      width: 75px;
    }
  }
}
</style>

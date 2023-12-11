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

      <el-form-item label="排名（选填）">
        <el-input-number v-model="form.top" :min="0" :max="1000" />
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
        </div>
      </el-form-item>

      <div class="button-box">
        <el-button @click="$emit('close')">取消</el-button>
        <el-button type="primary" @click="toolSave">确认</el-button>
      </div>
    </el-form>
  </mp-dialog>
</template>

<script setup lang="ts">
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

const toolStore = useToolStore()
const formElement = ref<FormInstance>()
const form = reactive({
  id: 0,
  url: '',
  title: '',
  intro: '' as undefined | string,
  logo: '',
  logoFile: undefined as undefined | File,
  loading: false,
  isAdd: false,
  top: 1000,
  tags: [] as string[],
  newTag: '',
  showAddTag: false,
})

const toolSave = () => {
  // if (!formElement.value) return
  // formElement.value.validate(async (ok: boolean) => {
  //   if (ok) {
  //     form.loading = true
  //     let logoDel = toolStore.tools[form.id]?.logoDel
  //     if (form.logoFile && !form.logo.startsWith('blob:')) {
  //       logoDel = form.logo
  //     }
  //     toolStore.tools[form.id] = {
  //       id: form.id,
  //       title: form.title,
  //       logo: form.logoFile ? URL.createObjectURL(form.logoFile!) : form.logo,
  //       url: form.url,
  //       intro: form.intro || '',
  //       logoFile: form.logoFile,
  //       logoDel,
  //     }
  //     $emit('close')
  //   }
  // })
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
    form.logoFile = tool.logoFile
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

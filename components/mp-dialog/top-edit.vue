<template>
  <mp-dialog class="mp-dialog-top-edit" title="编辑类别">
    <el-form @submit.prevent ref="formElement" :model="form" label-position="top">
      <el-form-item prop="zh" :rules="[{ required: true, trigger: 'blur', message: '请输入类别' }]">
        <el-input class="zh" v-model.trim="form.zh" clearable />
      </el-form-item>
      <div>{{ form.list }}</div>

      <div class="button-box">
        <el-button type="primary" @click="topSave">确认</el-button>
        <el-button type="danger" @click="topDel">删除</el-button>
      </div>
    </el-form>
  </mp-dialog>
</template>

<script setup lang="ts">
import { FormInstance } from 'element-plus'

interface Props {
  topIndex: number
}
const $props = defineProps<Props>()
const $emit = defineEmits(['close'])

const toolStore = useToolStore()

const formElement = ref<FormInstance>()
const form = reactive({
  zh: '',
  list: [] as string[],
})

const topDel = () => {
  const top = toolStore.toolsTop[$props.topIndex]
  if (top.list.length > 0) {
    mp.info('请先删除所有子项')
    return
  }
  toolStore.toolsTop.splice($props.topIndex, 1)
  $emit('close')
}

const topSave = () => {
  if (!formElement.value) return
  formElement.value.validate(async (ok: boolean) => {
    if (ok) {
      const top = toolStore.toolsTop[$props.topIndex]
      top.zh = form.zh
      $emit('close')
    }
  })
}

onUpdated(() => {
  const top = toolStore.toolsTop[$props.topIndex]
  form.zh = top.zh
  form.list = top.list
})
</script>

<style lang="scss">
.mp-dialog-top-edit {
  .el-input.zh {
    input {
      font-weight: bold;
    }
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

<template>
  <mp-dialog class="mp-dialog-top-edit" title="编辑分类" destroy-on-close>
    <el-form @submit.prevent ref="formElement" :model="form" label-position="top">
      <el-form-item prop="zh" :rules="[{ required: true, trigger: 'blur', message: '请输入类别' }]">
        <el-input class="zh" v-model.trim="form.title" clearable />
      </el-form-item>
    </el-form>

    <div class="ul">
      <div class="li" v-for="(id, i) in form.list">
        <span class="number">{{ i + 1 }}</span>
        <img class="logo" :src="toolStore.tools[id]?.logo" :alt="toolStore.tools[id]?.title" />
        <span class="name">{{ toolStore.tools[id]?.title }}</span>
        <mp-icon name="delete" @click="form.list.splice(i, 1)" />
      </div>
    </div>

    <el-form @submit.prevent ref="formToolElement" :model="formTool" label-position="top">
      <el-form-item
        class="add-tool"
        prop="tool"
        :rules="[{ required: true, trigger: 'blur', message: '请选择工具' }]"
      >
        <el-select v-model="formTool.tool" filterable placeholder="请选择工具" clearable>
          <el-option
            v-for="tool in Object.values(toolStore.tools)"
            :key="tool.id"
            :label="tool.title"
            :value="tool.id"
          />
        </el-select>
        <el-button @click="addTool">添加</el-button>
      </el-form-item>
    </el-form>

    <div class="button-box">
      <el-button
        v-if="toolStore.toolsTop[$props.topIndex]?.list.length === 0"
        type="danger"
        @click="topDel"
      >
        删除
      </el-button>
      <el-button v-else @click="$emit('close')">取消</el-button>
      <el-button type="primary" @click="topSave">确认</el-button>
    </div>
  </mp-dialog>
</template>

<script setup lang="ts">
import type { FormInstance } from 'element-plus'

interface Props {
  topIndex: number
}
const $props = defineProps<Props>()
const $emit = defineEmits(['close'])

const toolStore = useToolStore()

const formElement = ref<FormInstance>()
const formToolElement = ref<FormInstance>()
const form = reactive({
  title: '',
  list: [] as string[],
})

const formTool = reactive({
  tool: '',
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
      top.title = form.title
      top.list = form.list
      $emit('close')
    }
  })
}

const addTool = () => {
  if (!formToolElement.value) return
  formToolElement.value.validate(async (ok: boolean) => {
    if (ok) {
      if (form.list.includes(formTool.tool)) {
        mp.info('已存在')
        return
      }
      form.list.push(formTool.tool)
      formTool.tool = ''
    }
  })
}

onUpdated(() => {
  const top = toolStore.toolsTop[$props.topIndex]
  if (top) {
    form.title = top.title
    form.list = JSON.parse(JSON.stringify(top.list))
  }
})
</script>

<style lang="scss">
.mp-dialog-top-edit {
  .el-input.zh {
    input {
      font-weight: bold;
    }
  }

  .el-form-item.add-tool {
    .el-form-item__content {
      margin-top: 20px;
      justify-content: space-between;
      .el-select {
        width: 78%;
      }
      .el-button {
        width: 20%;
      }
    }
  }

  .ul {
    height: 96px;
    overflow-y: auto;

    .li {
      display: flex;
      align-items: center;
      height: 24px;

      .number {
        margin-right: 4px;
      }

      img.logo {
        width: 20px;
        height: 20px;
        margin-right: 4px;
      }

      .name {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: var(--el-color-primary);
      }

      .mp-icon-delete {
        cursor: pointer;
        margin-left: auto;

        &:hover {
          color: #000;
        }
      }
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

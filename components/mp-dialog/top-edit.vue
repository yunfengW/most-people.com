<template>
  <mp-dialog class="mp-dialog-top-edit" :title="form.name" destroy-on-close>
    <div class="ul">
      <div class="li" v-for="(id, i) in form.tools">
        <span class="number">{{ i + 1 }}</span>
        <img class="logo" :src="toolStore.tools[id]?.logo" :alt="toolStore.tools[id]?.title" />
        <span class="name">{{ toolStore.tools[id]?.title }}</span>
        <mp-icon name="delete" @click="form.tools.splice(i, 1)" />
      </div>
    </div>

    <el-form @submit.prevent ref="formToolElement" :model="form" label-position="top">
      <el-form-item
        class="add-tool"
        prop="id"
        :rules="[{ required: true, trigger: 'blur', message: '请选择工具' }]"
      >
        <client-only>
          <el-select-v2
            v-model="form.id"
            filterable
            clearable
            :options="Object.values(toolStore.tools)"
            :props="{
              label: 'title',
              value: 'id',
            }"
            placeholder="请选择工具"
          />
        </client-only>
        <el-button @click="addTool">添加</el-button>
      </el-form-item>
    </el-form>

    <div class="button-box">
      <el-button @click="$emit('close')">取消</el-button>
      <el-button type="primary" @click="topSave">确认</el-button>
    </div>
  </mp-dialog>
</template>

<script setup lang="ts">
import type { FormInstance } from 'element-plus'

interface Props {
  top?: Top
}
const $props = defineProps<Props>()
const $emit = defineEmits(['close'])

const toolStore = useToolStore()

const formToolElement = ref<FormInstance>()
const form = reactive({
  name: '',
  tools: [] as number[],
  // select tool id
  id: '',
})

const topSave = () => {
  if ($props.top) {
    const oldList = $props.top.tools
    const newList = form.tools
    // 找出新数组中新增的数字
    const added = newList.filter((id) => !oldList.includes(id))

    // 找出旧数组中被删除的数字
    const removed = oldList.filter((id) => !newList.includes(id))

    console.log('🌊', added)
    console.log('🌊', removed)
  }
  // const top = toolStore.toolsTop[$props.topIndex]
  // top.title = form.title
  // top.list = form.list
  // $emit('close')
}

const addTool = () => {
  if (!formToolElement.value) return
  formToolElement.value.validate(async (ok: boolean) => {
    if (ok) {
      const id = Number(form.id) || 0
      if (form.tools.includes(id)) {
        mp.info('已存在')
        return
      }
      form.tools.push(id)
      form.id = ''
    }
  })
}

onUpdated(() => {
  const top = $props.top
  if (top) {
    form.name = top.name
    form.tools = top.tools.map((e) => e)
  }
})
</script>

<style lang="scss">
.mp-dialog-top-edit {
  .el-form-item.add-tool {
    .el-form-item__content {
      margin-top: 20px;
      justify-content: space-between;
      .el-select-v2 {
        width: 61.8%;
      }
      .el-button {
        width: 35%;
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

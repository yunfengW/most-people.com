<template>
  <mp-dialog class="mp-dialog-top-edit" :title="form.name + form.index" destroy-on-close>
    <div class="ul">
      <div
        class="li"
        v-for="(id, i) in form.tools"
        :key="id"
        :style="{ order: toolStore.getTop(id, form.name) }"
      >
        <span class="number">
          {{ toolStore.getTop(id, form.name) === 100 ? '' : toolStore.getTop(id, form.name) }}
        </span>
        <mp-image class="logo" :src="toolStore.tools[id]?.logo" :alt="toolStore.tools[id]?.title" />
        <span class="name">{{ toolStore.tools[id]?.title }}</span>
        <mp-icon name="edit" @click="toolEdit(id)" />
      </div>
    </div>
  </mp-dialog>
</template>

<script setup lang="ts">
interface Props {
  top?: Top
  top_number?: number
}
const $props = defineProps<Props>()

interface Emits {
  (event: 'edit', tool_id: number): void
}
const $emit = defineEmits<Emits>()

const toolStore = useToolStore()

const form = reactive({
  name: '',
  tools: [] as number[],
  index: '',
})

const toolEdit = (tool_id: number) => {
  $emit('edit', tool_id)
}

onUpdated(() => {
  const top = $props.top
  if (top) {
    form.name = top.name
    // copy
    form.tools = top.tools.map((e) => e)
  }
  const number = $props.top_number
  if (number) {
    form.index = ` No.${String(number)}`
  }
})
</script>

<style lang="scss">
.mp-dialog-top-edit {
  .ul {
    display: flex;
    flex-direction: column;
    .li {
      display: flex;
      align-items: center;
      height: 24px;
      margin-bottom: 4px;

      .number {
        margin-right: 4px;
        min-width: 20px;
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

      .mp-icon-edit {
        cursor: pointer;
        margin-left: auto;

        &:hover {
          color: #000;
        }
      }
    }
  }
}
</style>

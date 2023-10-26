<template>
  <div id="page-tools">
    <mp-header title="全部工具" />

    <div class="tools">
      <nuxt-link
        v-for="tool in Object.values(toolStore.tools)"
        :to="'/tool/' + tool.id"
        class="tool"
        @click="userStore.toolKey = tool.id"
      >
        {{ tool.zh }}
      </nuxt-link>
    </div>
  </div>
</template>

<script setup lang="ts">
const userStore = useUserStore()
const toolStore = useToolStore()
</script>

<style lang="scss">
#page-tools {
  .tools {
    .tool {
      margin: 20px;
      display: inline-block;
      width: 150px;
    }
  }
}
</style>

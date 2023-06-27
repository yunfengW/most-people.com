<template>
  <div id="page-tools">
    <mp-header content="全部工具" />

    <div class="tools">
      <nuxt-link
        v-for="tool in Object.values(tools)"
        :to="'/tool/' + mp.hyphenate(tool.id)"
        class="tool"
        @click="userStore.toolKey = tool.id"
      >
        {{ tool.zh }}
      </nuxt-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import tools from '~/assets/json/tools.json'
import { useUserStore } from '~/stores/user'

const userStore = useUserStore()
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

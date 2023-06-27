<template>
  <div id="page-files">
    <mp-header content="文件管理" />
    <div class="files">
      <div class="file" v-for="(filename, i) in files">
        <a target="_blank" :href="`https://cdn.most-people.cn/${filename}`">
          {{ filename }}
        </a>
        <el-button @click="deleteFile(i)">删除</el-button>
      </div>
    </div>

    <div class="upload">
      <input type="file" ref="fileElement" />
      <el-button @click="upload">上传文件</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import api from '~/utils/api/api'

const fileElement = ref<HTMLInputElement>()
const upload = async () => {
  const file = fileElement.value?.files?.[0]
  if (!file) {
    mp.info('请选择文件')
    return
  }
  const filename = await api.fileUpload(file)
  files.value.push(filename)
}

const deleteFile = async (i: number) => {
  const filename = files.value[i]
  await api.fileDelete(filename)
  files.value.splice(i, 1)
}

const files = ref<string[]>([])
const init = async () => {
  const res = await api.fileGet()
  files.value = res.files
}
init()
</script>

<style lang="scss">
#page-files {
  .files {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
  }
}
</style>

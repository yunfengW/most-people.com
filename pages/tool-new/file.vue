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
      <el-button @click="uploadFile">上传文件</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import api from '~/utils/api/api'

const fileElement = ref<HTMLInputElement>()
const uploadFile = async () => {
  const file = fileElement.value?.files?.[0]
  if (!file) {
    mp.info('请选择文件')
    return
  }
  const filename = await api.fileUpload(file)
  if (filename) {
    files.value.push(filename)
  }
}

const deleteFile = (i: number) => {
  ElMessageBox.confirm('确定删除？', '你好')
    .then(async () => {
      const filename = files.value[i]
      const ok = await api.fileDelete(filename)
      if (ok) {
        files.value.splice(i, 1)
      } else {
        mp.error('删除失败')
      }
    })
    .catch(() => {})
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

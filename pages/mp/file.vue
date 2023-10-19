<template>
  <div id="page-files">
    <mp-header title="文件管理" />
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
import api, { FileGet } from '~/utils/api/api'

const fileElement = ref<HTMLInputElement>()
const uploadFile = async () => {
  const file = fileElement.value?.files?.[0]
  if (!file) {
    mp.info('请选择文件')
    return
  }
  // 创建FormData对象
  const formData = new FormData()
  // 'file'是要上传的文件字段名，file是要上传的文件对象
  formData.append('file', file)
  const filename: string | null = await api({
    method: 'put',
    url: '/file',
    data: formData,
    params: {
      filename: file.name,
    },
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  if (filename) {
    files.value.push(filename)
  }
}

const deleteFile = (i: number) => {
  ElMessageBox.confirm('确定删除？', '你好')
    .then(async () => {
      const filename = files.value[i]
      const ok: boolean = await api({
        method: 'delete',
        url: '/file',
        params: { filename },
      })
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
  const res: FileGet = await api({ method: 'get', url: '/file' })
  if (res) {
    files.value = res.files
  }
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

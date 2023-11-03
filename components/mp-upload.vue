<template>
  <el-upload
    class="mp-upload"
    action="#"
    :show-file-list="false"
    :on-success="uploadSuccess"
    :on-error="uploadError"
    :before-upload="beforeUpload"
  >
    <img v-if="imageUrl" :src="imageUrl" />
    <mp-icon v-else name="add" />
  </el-upload>
</template>

<script lang="ts" setup>
import type { UploadProps } from 'element-plus'

interface Props {
  url: string
}

const $props = withDefaults(defineProps<Props>(), {
  url: '',
})

const $emit = defineEmits<{
  (event: 'change', file: File): void
}>()

const imageUrl = ref($props.url)

const uploadSuccess: UploadProps['onSuccess'] = (res, uploadFile) => {
  const file = uploadFile.raw as File
  imageUrl.value = URL.createObjectURL(file!)
  $emit('change', file)
}
const uploadError: UploadProps['onError'] = (err, uploadFile) => {
  console.error(err, uploadFile)
}

const beforeUpload: UploadProps['beforeUpload'] = (uploadFile) => {
  if (uploadFile.size / 1024 / 1024 > 1) {
    mp.error('图片大小不能超过1MB！')
    return false
  }
  return true
}

onUpdated(() => {
  imageUrl.value = $props.url || ''
})
</script>

<style lang="scss">
.mp-upload {
  img {
    width: 80px;
    height: 80px;
    object-fit: cover;
  }

  .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);

    padding: 10px;
    width: 90px;
    height: 90px;
  }

  .el-upload:hover {
    border-color: var(--el-color-primary);
  }

  .mp-icon {
    font-size: 24px;
    color: #8c939d;
  }
}
</style>

<template>
  <el-upload
    class="mp-upload"
    action="https://api.most-people.cn/upload"
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

const imageUrl = ref($props.url)

const uploadSuccess: UploadProps['onSuccess'] = (res, uploadFile) => {
  imageUrl.value = URL.createObjectURL(uploadFile.raw!)
}
const uploadError: UploadProps['onError'] = (err, uploadFile) => {
  mp.error('上传失败！')
  console.error(err)
}

const beforeUpload: UploadProps['beforeUpload'] = (file) => {
  // if (file.type !== 'image/jpeg') {
  //   mp.error('Avatar picture must be JPG format!')
  //   return false
  // }
  if (file.size / 1024 / 1024 > 1) {
    mp.error('图片大小不能超过1MB！')
    return false
  }
  return true
}

onUpdated(() => {
  const url = $props.url
  if (url) {
    imageUrl.value = url
  }
})
</script>

<style lang="scss">
.mp-upload {
  img {
    width: 80px;
    height: 80px;
  }

  .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);

    padding: 8px;
    width: 88px;
    height: 88px;
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

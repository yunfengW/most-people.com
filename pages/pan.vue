<template>
  <div>
    <el-upload
      class="upload-demo"
      drag
      action="https://jsonplaceholder.typicode.com/posts/"
      multiple
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :before-remove="beforeRemove"
      :file-list="fileList"
      :on-change="handleChange"
      :limit="10"
      :on-exceed="handleExceed"
      :on-success="handleSuccess"
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div class="el-upload__tip" slot="tip">
        支持图片、文件夹、txt、excel、视频、压缩包等文件格式
      </div>
    </el-upload>
    <div v-for="(file, index) in fileList" :key="index">
      <img
        v-if="file.category === 'image'"
        :src="file.url"
        alt="Image preview"
        style="width: 100px; height: 100px"
      />
      <video v-else-if="file.category === 'video'" controls style="width: 200px; height: 100px">
        <source :src="file.url" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  </div>
</template>

<script setup lang="ts">
const fileList = ref([])
const handlePreview = (file: any) => {
  console.log('preview', file)
}

const handleRemove = (file: any, fileList: any) => {
  console.log('remove', file, fileList)
}

const beforeRemove = (file: any, fileList: any) => {
  return confirm(`确定移除 ${file.name}？`)
}

const handleChange = (file: any, fileList: any) => {
  if(file){
    Array.from(file.target.files).forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const category = file.type.startsWith('image/')
          ? 'image'
          : file.type.startsWith('video/')
          ? 'video'
          : 'other'
        fileList.value.push({ url: e.target.result, category: category })
      }

      if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
        reader.readAsDataURL(file)
      }
  }
    // 这里可以添加其他文件类型的处理逻辑
  })
  console.log('change', file, fileList)
}

const handleExceed = (files: any, fileList: any) => {
  console.log('exceed', files, fileList)
}

const handleSuccess = (response: any, file: any, fileList: any) => {
  // 根据文件类型添加分类属性
  // const categorizedFileList = fileList.map((file: any) => {
  //   if (file.raw.type.startsWith('image/')) {
  //     return { ...file, category: 'image' }
  //   } else if (file.raw.type.startsWith('video/')) {
  //     return { ...file, category: 'video' }
  //   } else if (
  //     [
  //       'application/vnd.ms-excel',
  //       'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  //     ].includes(file.raw.type)
  //   ) {
  //     return { ...file, category: 'excel' }
  //   } else if (file.raw.type === 'application/zip') {
  //     return { ...file, category: 'zip' }
  //   } else {
  //     return { ...file, category: 'other' }
  //   }
  // })
  // fileList.value = categorizedFileList
  // console.log('success', fileList.value)
}
</script>

<style scoped>
.upload-demo {
  border: 1px dashed #eee;
  border-radius: 5px;
  position: relative;
  padding: 40px 20px;
}
.upload-demo i {
  color: #20a0ff;
  font-size: 42px;
  margin-bottom: 16px;
}
.upload-demo .el-upload__text {
  font-size: 14px;
  color: #adb5bd;
  line-height: 22px;
  cursor: pointer;
}
.upload-demo .el-upload__tip {
  font-size: 12px;
  color: #adb5bd;
  line-height: 22px;
  margin-top: 12px;
}
</style>

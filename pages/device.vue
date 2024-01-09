<template>
  <div id="page-device">
    <mp-header title="设备信息" />
    <el-input type="textarea" autosize resize="none" readonly :value="myDevice"> </el-input>
  </div>
</template>
<script lang="ts" setup>
const device = useDevice()

const myDevice = computed(() => {
  const dict = JSON.parse(JSON.stringify(device))
  for (const key in dict) {
    const item = dict[key]
    if (!item) {
      delete dict[key]
    }
  }
  return JSON.stringify(dict, null, 2)
})
</script>

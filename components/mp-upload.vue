<template>
  <div class="mp-upload">
    <input ref="upload" type="file" accept="image/*" @change="change" />
    <img v-if="imageUrl" :src="imageUrl" />
    <mp-icon v-else name="add" />
  </div>
</template>

<script lang="ts" setup>
interface Props {
  url: string
}
const $props = withDefaults(defineProps<Props>(), { url: '' })
interface Emits {
  (event: 'change', file: File): void
}
const $emit = defineEmits<Emits>()

const imageUrl = ref($props.url)

const change = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files?.length) {
    return
  }

  const file = input.files[0]
  if (file && file.size / 1024 / 1024 > 1) {
    mp.error('图片大小不能超过1MB！')
    input.value = ''
    return
  }

  imageUrl.value = URL.createObjectURL(file!)
  $emit('change', file)
  input.value = ''
}

watch(
  () => $props.url,
  (nv) => {
    imageUrl.value = nv
  },
)
</script>

<style lang="scss">
.mp-upload {
  position: relative;
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);

  padding: 10px;
  width: 90px;
  height: 90px;

  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 80px;
    height: 80px;
    object-fit: cover;
  }

  &:hover {
    border-color: var(--el-color-primary);
  }

  input {
    cursor: pointer;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
  }

  // .mp-icon {
  //   font-size: 24px;
  //   color: #8c939d;
  // }
}
</style>

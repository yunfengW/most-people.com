<template>
  <div id="page-cdn">
    <div class="files">
      <a class="file" v-for="file in files" target="_blank" :href="formatURL(file)">
        <img :src="formatURL(file)" :alt="file" />
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import api from '~/api/api'

const files = await api.getFiles()

const formatURL = (filename: string) => {
  return 'http://localhost:8001/cdn/' + filename
}
</script>

<style lang="scss">
#page-cdn {
  .files {
    width: 100%;

    display: grid;
    grid-template-columns: repeat(auto-fill, 100px); /* 列宽度 100px */
    grid-gap: 10px; /* 设置网格间距 */
    justify-content: space-between;
    justify-items: center;

    .file {
      background: pink;
      width: 70px;
      height: 70px;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 4px;
      }
    }
  }
}
</style>

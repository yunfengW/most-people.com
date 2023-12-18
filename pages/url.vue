<template>
  <div id="page-url">
    <mp-header title="书签" />

    <div class="filter">
      <el-input v-model="filter" placeholder="关键字查询" clearable />
    </div>

    <div class="url-box">
      <client-only>
        <template v-for="(url, index) in userStore.user?.urls || []">
          <div class="url">
            <img class="icon" :src="url.icon" :alt="url.name" />
            <span class="name" @click.stop="bindUrl(url)">{{ url.name }}</span>
            <mp-icon name="edit" @click.stop="urlEdit(index)" />
          </div>
        </template>
      </client-only>
      <div class="url add">
        <mp-icon name="add" @click="urlEdit(-1)" />
        <span @click="urlEdit(-1)">添加</span>
      </div>
    </div>

    <mp-dialog-url-edit v-model="showUrlEdit" @close="showUrlEdit = false" :url_index="url_index" />
  </div>
</template>

<script setup lang="ts">
const userStore = useUserStore()

const filter = ref('')

const url_index = ref(-1)

const showUrlEdit = ref(false)

const urlEdit = (i: number) => {
  showUrlEdit.value = true
  url_index.value = i
}
const bindUrl = (url: Url) => {
  console.log('🌊', url)
}
</script>

<style lang="scss">
#page-url {
  max-width: 100%;

  .filter {
    max-width: 240px;
    margin-bottom: 18px;
    width: 100%;
  }
  .url-box {
    color: #000;
    width: 100%;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 8px;
    justify-content: space-between;

    .url {
      box-shadow: 0 3px 6px 0 rgba(14, 30, 62, 0.08);
      background-color: #fff;
      will-change: background;
      border-radius: 5px;
      padding: 20px;

      display: flex;
      align-items: center;

      img.logo {
        width: 20px;
        height: 20px;
        margin-right: 6px;
      }

      .name {
        cursor: pointer;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

        &:hover {
          color: var(--el-color-primary);
        }
      }

      .mp-icon-edit {
        cursor: pointer;
        margin-left: auto;
        color: #909399;
      }
    }

    .url.add {
      display: flex;
      justify-content: center;
      user-select: none;

      .mp-icon {
        cursor: pointer;
        padding-right: 4px;
      }

      span {
        cursor: pointer;
      }
    }
  }
}
</style>

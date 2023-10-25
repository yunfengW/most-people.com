<template>
  <div id="page-top">
    <mp-header title="万能工具箱" />
    <div class="top-box">
      <div class="top" v-for="list in toolStore.toolsTop">
        <h4>{{ list.zh }}</h4>
        <div class="ul">
          <div class="li" v-for="(key, i) in list.top" @click="bindTool(key)">
            <span class="No">{{ i + 1 }}</span>
            <img
              class="logo"
              :src="toolStore.tools[key as 'Bing']?.logo"
              :alt="toolStore.tools[key as 'Bing']?.zh"
            />
            <a>{{ toolStore.tools[key as 'Bing']?.zh }}</a>
          </div>
        </div>
      </div>
      <div class="top add">
        <el-image src="/img/add.svg" fit="contain" @click="showTopAdd = true" />
        <span @click="showTopAdd = true">添加</span>
      </div>
    </div>
    <nuxt-link to="/tool/list"></nuxt-link>
    <mp-dialog class="mp-dialog-category" title="添加类别" v-model="showTopAdd">
      <el-form @submit.prevent ref="formElement" :model="form" label-position="top">
        <el-form-item prop="category" :rules="[{ validator: checkCategory, trigger: 'blur' }]">
          <el-input v-model.trim="form.category" clearable />
        </el-form-item>
        <el-button type="primary" @click="topAdd"> 添加 </el-button>
      </el-form>
    </mp-dialog>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '~/stores/user'
import { useToolStore } from '~/stores/tool'
import { Tool } from '~/stores/tool'
import { FormInstance } from 'element-plus'

const showTopAdd = ref(false)

const formElement = ref<FormInstance>()
const form = reactive({ category: '' })

useHead({
  title: '万能工具箱',
})

const userStore = useUserStore()
const toolStore = useToolStore()
const router = useRouter()
const route = useRoute()
const bindTool = (key: string) => {
  const tool = toolStore.tools[key]
  if (tool) {
    // 添加
    if (route.query.type === 'add') {
      addTool(tool)
      return
    }

    userStore.updateTool(tool.id)
    router.replace('/')
  }
}

const addTool = (tool: Tool) => {
  if (userStore.user === null) {
    mp.info('请先登录，登录后即可添加')
  } else {
    if (userStore.tools.includes(tool.id) === false) {
      userStore.tools.push(tool.id)
      userStore.updateTools()
    }
  }
  userStore.updateTool(tool.id)
  router.replace('/')
}

const topAdd = () => {
  if (!formElement.value) return
  formElement.value.validate(async (ok: boolean) => {
    if (ok) {
      toolStore.toolsTop.push({
        zh: form.category,
        top: [],
      })
      form.category = ''
      showTopAdd.value = false
    }
  })
}

// check
const checkCategory = (_rule: any, v: string, callback: (err?: Error) => void) => {
  const category = v
  if (!category) {
    return callback(new Error('请输入类别'))
  }
  // const categories = toolStore.toolsTop.map((e) => e.zh)
  callback()
}
</script>

<style lang="scss">
#page-top.page {
  max-width: 100%;

  .top-box {
    color: #000;
    width: 100%;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 8px;
    justify-content: space-between;

    .top {
      box-shadow: 0 3px 6px 0 rgba(14, 30, 62, 0.08);
      background-color: #fff;
      will-change: background;
      list-style: auto;
      border-radius: 5px;
      padding: 0 20px;
      height: 180px;

      .ul {
        height: 96px;
        overflow-y: auto;

        .li {
          display: flex;
          align-items: center;
          height: 24px;

          .No {
            margin-right: 4px;
          }

          img.logo {
            width: 20px;
            height: 20px;
            margin-right: 4px;
          }

          a {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }

      &.add {
        padding: 0;
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        .el-image {
          cursor: pointer;
          width: 36px;
          height: 36px;
        }
        span {
          cursor: pointer;
        }
      }
    }
  }
}

.mp-dialog-category {
  .el-button {
    margin-top: 12px;
    width: 100%;
  }
}
</style>

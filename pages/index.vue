<template>
  <div id="page-index">
    <img class="logo" src="/logo/ChatGPT.svg" />
    <el-input
      class="search"
      v-model="form.message"
      :placeholder="form.placeholder"
      autofocus
      size="large"
    >
    </el-input>
    <div class="tools">
      <template v-for="tool in tools">
        <el-link type="info" class="tool" :href="tool.url" target="_blank">
          <el-image :src="tool.logo" fit="contain" />
          <span>{{ tool.name }}</span>
        </el-link>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
const form = reactive({
  message: '',
  placeholder: '夜里挑灯看剑',
})
const tools = [
  {
    name: '沃尔夫勒姆',
    logo: '/logo/WolframAlpha.ico',
    url: 'https://www.wolframalpha.com/examples',
  },
  {
    name: '微软计算器',
    logo: '/logo/MathSolver.ico',
    url: 'https://mathsolver.microsoft.com/zh',
  },
  {
    name: '搜狗翻译',
    logo: '/logo/SogouTranslate.png',
    url: 'https://fanyi.sogou.com/text',
  },
  {
    name: 'ChatGPT',
    logo: '/logo/ChatGPT.svg',
    url: 'https://chat.openai.com',
  },
  {
    name: 'Midjourney',
    logo: '/logo/Midjourney.png',
    url: 'https://www.midjourney.com/showcase/recent/',
  },
  {
    name: 'Bing',
    logo: '/logo/Bing.svg',
    url: 'https://www.bing.com/search?form=MY0291&OCID=MY0291&q=Bing+AI&showconv=1',
  },
  {
    name: 'Bard',
    logo: '/logo/Bard.svg',
    url: 'https://bard.google.com/',
  },
  {
    name: '文心一言',
    logo: '/logo/Yiyan.ico',
    url: 'https://yiyan.baidu.com/',
  },
  {
    name: 'Claude',
    logo: '/logo/Claude.png',
    url: 'https://slack.com/apps/A04KGS7N9A8-claude',
  },
]
</script>

<style lang="scss">
#page-index {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 0 20px;
  margin: 0 auto;

  img.logo {
    margin: 20px 0;
    height: 80px;
  }

  .search.el-input {
    .el-input__wrapper {
      .el-input__inner {
        text-align: center;
      }
    }
  }

  .tools {
    width: 100%;
    padding: 10px 0;

    display: grid;
    grid-template-columns: repeat(auto-fill, 100px); /* 列宽度 100px */
    grid-gap: 10px; /* 设置网格间距 */
    justify-content: space-between;

    .tool {
      .el-link__inner {
        display: flex;
        flex-direction: column;

        .el-image {
          height: 40px;
        }

        span {
          margin-top: 4px;
        }
      }
    }
  }
}

// PC端 横屏
@media (orientation: landscape) and (min-width: 980px) {
  #page-index {
    max-width: 61.8%;
  }
}
</style>

<template>
  <div id="page-index">
    <img class="logo" src="/logo/ChatGPT.svg" />
    <el-input
      class="search"
      v-model="form.message"
      :placeholder="form.placeholder"
      autofocus
      size="large"
      @keyup.enter="send"
    >
      <template #prefix>
        <div class="button send" @click.stop="microphone">
          <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
            <path
              fill="currentColor"
              d="M512 128a128 128 0 0 0-128 128v256a128 128 0 1 0 256 0V256a128 128 0 0 0-128-128zm0-64a192 192 0 0 1 192 192v256a192 192 0 1 1-384 0V256A192 192 0 0 1 512 64zm-32 832v-64a288 288 0 0 1-288-288v-32a32 32 0 0 1 64 0v32a224 224 0 0 0 224 224h64a224 224 0 0 0 224-224v-32a32 32 0 1 1 64 0v32a288 288 0 0 1-288 288v64h64a32 32 0 1 1 0 64H416a32 32 0 1 1 0-64h64z"
            ></path>
          </svg>
        </div>
      </template>
      <template #suffix>
        <div class="button microphone" :class="{ disabled: !form.message }" @click.stop="send">
          <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
            <path
              fill="currentColor"
              d="m64 448 832-320-128 704-446.08-243.328L832 192 242.816 545.472 64 448zm256 512V657.024L512 768 320 960z"
            ></path>
          </svg>
        </div>
      </template>
    </el-input>

    <div class="tools">
      <template v-for="tool in tools">
        <el-link :underline="false" type="info" class="tool" :href="tool.url" target="_blank">
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
  {
    name: 'Bito',
    logo: '/logo/Bito.svg',
    url: 'https://bito.ai',
  },
]

const send = () => {
  console.log('🌊', 213)
}
const microphone = () => {
  console.log('🌊', 123)
}
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
    position: relative;
    .el-input__wrapper {
      padding-left: 0;
      padding-right: 0;
      .el-input__inner {
        text-align: center;
      }
    }
    .button {
      display: flex;
      align-items: center;
      height: 100%;
      padding: 0 15px;

      &.disabled {
        opacity: 0.6;
      }

      svg {
        width: 20px;
        height: 20px;
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

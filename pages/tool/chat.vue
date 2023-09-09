<template>
  <div id="page-chat">
    <mp-header title="ChatGPT 3.5" />
    <el-form @submit.prevent ref="formElement" :model="form">
      <div class="ip-address">
        <h4>IP 地址：{{ form.regionName }} {{ form.city }}</h4>
        <el-button
          v-if="!form.countryCode"
          type="primary"
          @click="getLocation"
          :loading="form.locationLoading"
          link
        >
          获取 IP 地址
        </el-button>
        <el-link style="margin-left: auto" type="info" href="http://ip111.cn/" target="_blank">
          自助查询 IP 地址
        </el-link>
      </div>
      <span>{{ form.address }}</span>
      <div class="api-key">
        <h4>
          OpenAI API 密钥
          <el-link href="https://platform.openai.com/account/api-keys" target="_blank" type="info">
            https://platform.openai.com/account/api-keys
          </el-link>
        </h4>
        <el-form-item
          :rules="[
            {
              required: true,
              message: '请输入 OpenAI API 密钥',
              trigger: 'blur',
            },
          ]"
          prop="apiKey"
        >
          <el-input v-model="form.apiKey" clearable show-password />
        </el-form-item>
      </div>
      <div class="question">
        <h4>发送内容</h4>
        <el-form-item
          :rules="[
            {
              required: true,
              message: '请输入要发送的内容',
              trigger: 'blur',
            },
          ]"
          prop="message"
        >
          <el-input
            v-model="form.message"
            :autosize="{ minRows: 2 }"
            type="textarea"
            resize="none"
          />
        </el-form-item>
        <el-button type="primary" @click="submit" :loading="form.submitLoading"> 提交 </el-button>
      </div>
      <div class="reasons">
        <br />
        <div class="reason" v-for="reason in form.reasons">
          {{ reason.message.content }}
        </div>
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios'
import { FormInstance } from 'element-plus'

interface Reason {
  message: {
    content: ''
  }
}
const route = useRoute()
const form = reactive({
  ip: '',
  countryCode: '',
  city: '',
  address: '',
  regionName: '',
  locationLoading: false,
  // OpenAI
  apiKey: (route.query.k as string) || '',
  message: '你好，ChatGPT',
  submitLoading: false,
  reasons: [] as Reason[],
})

const formElement = ref<FormInstance>()
const submit = () => {
  if (!formElement.value) return
  formElement.value.validate(async (ok) => {
    if (ok) {
      // if (!form.countryCode) {
      //   mp.warning('请先获取 IP 地址')
      //   return
      // }
      // if (['HK', 'CN'].includes(form.countryCode)) {
      //   mp.info('OpenAI 暂不支持 中国大陆和香港')
      //   return
      // }
      form.submitLoading = true
      try {
        const res = await chatWithGPT3(form.apiKey, form.message)
        form.reasons = res.data.choices
      } catch (error: any) {
        ElMessageBox.alert(error.response?.data?.error?.message || '未知错误')
      }
      form.submitLoading = false
    }
  })
}

const getLocation = async () => {
  form.locationLoading = true
  try {
    const res = await axios('https://ipinfo.io/json?token=b7d3aff0162a2d')
    if (res.data.ip) {
      const { ip, city, org, country, region } = res.data
      form.ip = ip
      form.city = city
      form.address = org
      form.countryCode = country
      form.regionName = region
    }
  } catch (error) {
    console.log('error', error)
    mp.info('IP 地址请求失败')
  } finally {
    form.locationLoading = false
  }
}

const chatWithGPT3 = (apiKey: string, message: string) => {
  return axios({
    url: 'https://api.openai.com/v1/chat/completions', // 请根据需要更改为 GPT-3.5 聊天模型的实际 API 地址
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    method: 'post',
    data: {
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: message }],
    },
  })
}
</script>

<style lang="scss">
#page-chat {
  .ip-address {
    display: flex;
    align-items: center;
  }
  // .api-key {}
  .question {
    .el-button {
      width: 100%;
    }
  }
}
</style>

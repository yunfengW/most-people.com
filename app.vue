<template>
  <div id="app">
    <div class="ip-address">
      <h4>
        IP 地址： {{ form.country }} {{ form.regionName }} {{ form.city }}
      </h4>

      <el-button
        v-if="!form.countryCode"
        type="primary"
        @click="getLocation"
        :loading="form.locationLoading"
        link
      >
        获取 IP 地址
      </el-button>
    </div>

    <div class="api-key">
      <h4>
        OpenAI API 密钥
        <el-link
          href="https://platform.openai.com/account/api-keys"
          target="_blank"
          type="primary"
        >
          https://platform.openai.com/account/api-keys
        </el-link>
      </h4>
      <el-input v-model="form.apiKey" clearable show-password />
    </div>
    <div class="question">
      <h4>发送内容</h4>
      <div class="message-box">
        <el-input
          v-model="form.message"
          :autosize="{ minRows: 2 }"
          type="textarea"
          resize="none"
        />
        <el-button type="primary" @click="submit" :loading="form.submitLoading">
          提交
        </el-button>
      </div>
    </div>
    <div class="reasons">
      <br />
      <div class="reason" v-for="reason in form.reasons">
        {{ reason.message.content }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from "axios";

interface Reason {
  message: {
    content: "";
  };
}

const form = reactive({
  city: "",
  country: "",
  countryCode: "",
  regionName: "",
  locationLoading: false,
  // OpenAI
  apiKey: "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",
  message: "你好",
  submitLoading: false,
  reasons: [] as Reason[],
});

const submit = async () => {
  if (!form.countryCode) {
    ElMessage.warning("请先获取 IP 地址");
    return;
  }
  if (["HK", "CN"].includes(form.countryCode)) {
    ElMessage.info("OpenAI 暂不支持 中国大陆和香港");
    return;
  }
  if (!form.apiKey) {
    return;
  }
  if (!form.message) {
    return;
  }
  form.submitLoading = true;
  const res = await chatWithGPT3(form.apiKey, form.message);
  form.submitLoading = false;
  form.reasons = res.data.choices;
};

const getLocation = () => {
  form.locationLoading = true;
  axios({
    timeout: 5000,
    url: "http://ip-api.com/json",
    params: {
      lang: "zh-CN",
    },
  })
    .then((res) => {
      if (res.data.status === "success") {
        form.city = res.data.city;
        form.country = res.data.country;
        form.countryCode = res.data.countryCode;
        form.regionName = res.data.regionName;
      }
    })
    .catch((err) => {
      ElMessage.info("OpenAI 暂不支持 中国大陆和香港");
    })
    .finally(() => {
      form.locationLoading = false;
    });
};

const chatWithGPT3 = (apiKey: string, message: string) => {
  return axios({
    url: "https://api.openai.com/v1/chat/completions", // 请根据需要更改为 GPT-3.5 聊天模型的实际 API 地址
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    method: "post",
    data: {
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }],
    },
  });
};
</script>

<style lang="scss">
#app {
  margin: 0 auto;
  max-width: 500px;
  .ip-address {
    display: flex;
    align-items: center;
  }
  // .api-key {}
  .question {
    .message-box {
      display: flex;
      align-items: flex-end;
      .el-button {
        margin-left: 10px;
      }
    }
  }
}
</style>

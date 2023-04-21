<template>
  <div id="app">
    <div class="ip-address">
      IP 地址： {{ form.country }} {{ form.regionName }}
      {{ form.city }}
      <el-button
        v-if="!form.country"
        type="primary"
        @click="getLocation"
        :loading="form.locationLoading"
        link
      >
        获取 IP 地址
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from "axios";

const form = reactive({
  city: "",
  country: "",
  regionName: "",
  locationLoading: false,
});

const getLocation = () => {
  form.locationLoading = true;
  axios({
    url: "http://ip-api.com/json",
    params: {
      lang: "zh-CN",
    },
  })
    .then((res) => {
      if (res.data.status === "success") {
        form.city = res.data.city;
        form.country = res.data.country;
        form.regionName = res.data.regionName;
      }
    })
    .catch((err) => {
      console.log(err);
      ElMessage.error("https://ip-api.com/json 请求失败");
    })
    .finally(() => {
      form.locationLoading = false;
    });
};

const chatWithGPT3 = (prompt: string) => {
  const API_KEY = "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";
  axios({
    url: "https://api.openai.com/v1/chat/completions", // 请根据需要更改为 GPT-3.5 聊天模型的实际 API 地址
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    method: "post",
    data: {
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    },
  })
    .then((res) => {
      console.log("🌊", res);
    })
    .catch((err) => {
      console.log("error", err);
    });
};

const test = () => {
  const prompt = "如何学好英语？";
  chatWithGPT3(prompt);
};
</script>

<style lang="scss">
#app {
  .ip-address {
    display: flex;
    align-items: center;
  }
}
</style>

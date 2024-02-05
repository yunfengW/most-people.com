<template>
  <div id="page-mp-mi">
    <mp-header title="加密 / 解密" />
    <el-form @submit.prevent ref="formElement" :model="form">
      <div class="api-key">
        <h4>密钥</h4>
        <el-form-item
          :rules="[
            {
              required: true,
              message: '请输入密钥',
              trigger: 'blur',
            },
          ]"
          prop="password"
        >
          <el-input v-model="form.password" clearable show-password />
        </el-form-item>
      </div>
      <div class="question">
        <h4>密文</h4>
        <el-form-item
          :rules="[
            {
              required: true,
              message: '请输入要解密的内容',
              trigger: 'change',
            },
          ]"
          prop="encrypted"
        >
          <el-input
            v-model="form.encrypted"
            :autosize="{ minRows: 2 }"
            type="textarea"
            resize="none"
          />
        </el-form-item>
        <br />
        <el-button type="primary" @click="decrypt" :loading="form.decryptedLoading">解密</el-button>
      </div>
      <div class="reasons">
        <h4>明文</h4>
        <el-form-item
          :rules="[
            {
              required: true,
              message: '请输入要加密的内容',
              trigger: 'change',
            },
          ]"
          prop="decrypted"
        >
          <el-input
            v-model="form.decrypted"
            :autosize="{ minRows: 2 }"
            type="textarea"
            resize="none"
          />
        </el-form-item>
        <br />
        <el-button type="primary" @click="encrypt" :loading="form.encryptedLoading">加密</el-button>
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import type { FormInstance } from 'element-plus'

const route = useRoute()
const form = reactive({
  password: (route.query.k as string) || '',
  encrypted: '',
  encryptedLoading: false,
  decrypted: '',
  decryptedLoading: false,
})

const formElement = ref<FormInstance>()
const encrypt = () => {
  if (!formElement.value) return
  formElement.value.validateField(['password', 'decrypted'], async (ok) => {
    if (ok) {
      form.encryptedLoading = true
      const { key } = await mp.key('most-people', form.password)
      form.encrypted = await mp.encrypt(form.decrypted, key)
      form.encryptedLoading = false
    }
  })
}
const decrypt = () => {
  if (!formElement.value) return
  formElement.value.validateField(['password', 'encrypted'], async (ok) => {
    if (ok) {
      form.decryptedLoading = true
      const { key } = await mp.key('most-people', form.password)
      form.decrypted = await mp.decrypt(form.encrypted, key)
      form.decryptedLoading = false
    }
  })
}
</script>

<style lang="scss">
#page-mp-mi {
  .el-form {
    width: 100%;
    max-width: 445px;

    .el-button {
      width: 100%;
    }
  }
}
</style>

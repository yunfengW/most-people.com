<template>
  <div id="page-login">
    <mp-header content="登录" />
    <el-form
      @submit.prevent
      ref="formElement"
      :model="form"
      label-position="top"
      :disabled="form.loading"
    >
      <el-form-item
        label="用户名"
        prop="username"
        :rules="[{ validator: checkUsername, trigger: 'blur' }]"
      >
        <el-input
          v-model.trim="form.username"
          :disabled="form.usernameLoading"
          clearable
          @keyup.enter="login"
        />
      </el-form-item>
      <el-form-item
        label="输入密码"
        prop="password"
        :rules="[{ validator: checkPassword, trigger: 'blur' }]"
      >
        <el-input v-model.trim="form.password" show-password clearable @keyup.enter="login" />
      </el-form-item>
      <el-button @click="login" type="primary" :loading="form.loading">登录</el-button>
    </el-form>
  </div>
</template>

<script setup lang="ts">
const { form, formElement, login, checkUsername } = useLogin()
const { checkPassword } = useRegister()
</script>

<style lang="scss">
#page-login {
  .el-form {
    width: 100%;
  }
  .el-button {
    margin-top: 20px;
    width: 100%;
  }
}
</style>

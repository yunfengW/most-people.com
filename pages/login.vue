<template>
  <div id="page-login">
    <mp-header title="登录" />
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
      <el-button
        @click="login"
        type="primary"
        :loading="form.loading"
        :disabled="form.usernameLoading"
      >
        登录
      </el-button>
    </el-form>
    <br />
    <nuxt-link to="/register" replace> 还没账号？去注册 </nuxt-link>
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
  a {
    color: #606266;
    font-size: 14px;
    font-weight: 500;
    border-bottom: 1px solid transparent;

    &:hover {
      color: #409eff;
      border-color: #409eff;
    }
  }
}
</style>

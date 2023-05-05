<template>
  <div id="page-register">
    <mp-header content="注册" />

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
          clearable
          :disabled="form.usernameLoading"
          @keyup.enter="register"
        />
      </el-form-item>
      <el-form-item
        label="输入密码"
        prop="password"
        :rules="[{ validator: checkPassword, trigger: 'blur' }]"
      >
        <el-input v-model.trim="form.password" show-password clearable></el-input>
      </el-form-item>
      <el-form-item
        label="确认密码"
        prop="confirmPassword"
        :rules="[{ validator: checkConfirmPassword, trigger: 'blur' }]"
      >
        <el-input
          v-model.trim="form.confirmPassword"
          show-password
          clearable
          @keyup.enter="register"
        />
      </el-form-item>
      <el-button
        type="primary"
        @click="register"
        :loading="form.loading"
        :disabled="form.usernameLoading"
      >
        注册
      </el-button>
    </el-form>
  </div>
</template>

<script setup lang="ts">
const { form, formElement, register, checkUsername, checkPassword, checkConfirmPassword } =
  useRegister()
</script>

<style lang="scss">
#page-register {
  .el-form {
    width: 100%;
  }
  .el-button {
    margin-top: 20px;
    width: 100%;
  }
}
</style>

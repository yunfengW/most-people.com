<template>
  <div class="mp-mi">
    <el-input
      :value="form.decrypted || props.mi"
      :autosize="{ minRows: 2, maxRows: 10 }"
      type="textarea"
      resize="none"
      readonly
    />
    <div v-if="!form.decrypted" class="password">
      <el-input v-model="form.password" placeholder="输入密码解密" @keyup.enter="encrypt">
        <template #suffix>
          <div class="button send" @click.stop="encrypt">
            <mp-icon name="send" />
          </div>
        </template>
      </el-input>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  mi: string
}
const props = withDefaults(defineProps<Props>(), { mi: '' })
const form = reactive({
  password: '',
  decrypted: '',
})
const encrypt = async () => {
  const key = await mp.key('most-people', form.password)
  const decrypted = await mp.decrypt(props.mi, key)
  if (decrypted) {
    form.decrypted = decrypted
  } else {
    mp.error('密码错误')
  }
}
</script>

<style lang="scss">
.mp-mi {
  .password {
    margin-top: 10px;

    .el-input {
      .el-input__wrapper {
        padding-left: 15px;
        padding-right: 0;
      }
      .button {
        cursor: pointer;
        display: flex;
        align-items: center;
        height: 100%;
        padding: 0 15px;
        color: rgb(142, 142, 160);

        &.disabled {
          opacity: 0.4;

          &:hover {
            opacity: 1;
          }
        }

        .mp-icon {
          font-size: 20px;
        }
      }
    }
  }
}
</style>

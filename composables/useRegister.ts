import api, { apiErrorCode } from '~/utils/api'
import { ElMessageBox, type FormInstance } from 'element-plus'

export const useRegister = () => {
  const form = reactive({
    username: '',
    usernameLoading: false,
    password: '',
    confirmPassword: '',
    loading: false,
  })
  const router = useRouter()
  const formElement = ref<FormInstance>()

  // click
  const register = () => {
    if (!formElement.value) return
    formElement.value.validate(async (ok: boolean) => {
      if (ok) {
        ElMessageBox.prompt('请牢记您的密码，本站数据加密公开，忘记密码将失去账号。', {
          closeOnClickModal: false,
          closeOnPressEscape: false,
          showCancelButton: true,
          showClose: false,
          showInput: true,
          cancelButtonText: '取消',
          confirmButtonText: '确认牢记',
          inputPlaceholder: '再次输入密码',
          inputValidator(v: string) {
            if (v !== form.password) {
              return '密码不一致'
            }
            return true
          },
          inputErrorMessage: '不支持特殊字符',
        })
          .then(async () => {
            form.loading = true
            await submit(form.username, form.password)
            form.loading = false
          })
          .catch(() => {})
      }
    })
  }
  // submit
  const submit = async (username: string, password: string) => {
    const { key, address, public_key } = await mp.key(username, password)
    const password_hash = await mp.encrypt(username, key)
    const res = await api({
      method: 'post',
      url: '/user/register',
      data: { name: username, password_hash, address, public_key },
    })
    if (res.data) {
      router.replace('/login')
      mp.success('注册成功')
    }
  }

  // check
  const checkUsername = (_rule: any, v: string, callback: (err?: Error) => void) => {
    const username = v
    if (!username) {
      return callback(new Error('请输入用户名'))
    }
    form.usernameLoading = true
    api({
      method: 'post',
      url: '/user/check.name',
      data: { name: username },
    }).then((res) => {
      form.usernameLoading = false
      if (res.data) {
        callback()
      } else if (res.data === null) {
        callback(new Error(apiErrorCode[404]))
      } else {
        callback(new Error(apiErrorCode[1001]))
      }
    })
  }
  const checkPassword = (_rule: any, v: string, callback: (err?: Error) => void) => {
    const password = v
    if (!password) {
      return callback(new Error('请输入密码'))
    }
    if (/^\S{4,32}$/.test(password) === false) {
      return callback(new Error('密码长度为 4-32 位'))
    }
    if (/[^a-zA-Z0-9]/.test(password) === true) {
      return callback()
    }
    if (/(?=.*[A-Z])(?=.*\S)[^]/.test(password) === false) {
      return callback(new Error('至少1个大写字母'))
    }
    if (/(?=[a-z])[^]/.test(password) === false) {
      return callback(new Error('至少1个小写字母'))
    }
    if (/(?=[\d]+)/.test(password) === false) {
      return callback(new Error('至少1个数字'))
    }
    callback()
  }
  const checkConfirmPassword = (_rule: any, v: string, callback: (err?: Error) => void) => {
    const password = v
    if (!password) {
      return callback()
    }
    if (form.password !== password) {
      return callback(new Error('两次密码不一致，请重新输入'))
    }
    callback()
  }

  return {
    form,
    formElement,
    register,
    checkUsername,
    checkPassword,
    checkConfirmPassword,
  }
}

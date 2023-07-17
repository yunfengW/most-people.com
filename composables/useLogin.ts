import type { FormInstance } from 'element-plus'
import api, { User, apiErrorCode } from '~/utils/api/api'
import { indexDB } from '~/utils/api/indexdb'
import { useUserStore } from '~/stores/user'

export const useLogin = () => {
  const form = reactive({
    username: '',
    usernameLoading: false,
    password: '',
    loading: false,
  })

  const router = useRouter()
  const userStore = useUserStore()

  const formElement = ref<FormInstance>()

  const login = async () => {
    if (!formElement.value) return
    formElement.value.validate(async (ok: boolean) => {
      if (ok) {
        form.loading = true
        const user: User | null = await api({
          url: '/user',
          params: { name: form.username },
        })
        if (user) {
          const { key, token } = await mp.key(form.username, form.password)
          const username = await mp.decrypt(user.password_hash, key)
          if (username === form.username) {
            // login success
            indexDB.setUser(username, key, token).then((ok) => {
              if (ok) {
                userStore.update(user, token)
                router.back()
              } else {
                mp.error('indexDB 写入失败')
              }
            })
          } else {
            mp.error('密码错误')
          }
        } else {
          mp.error('用户名不存在')
        }
        form.loading = false
      }
    })
  }

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
    }).then((ok) => {
      form.usernameLoading = false
      if (ok) {
        callback()
      } else if (ok === null) {
        callback(new Error(apiErrorCode[404]))
      } else {
        callback(new Error(apiErrorCode[1001]))
      }
    })
  }

  return {
    form,
    formElement,
    login,
    checkUsername,
  }
}

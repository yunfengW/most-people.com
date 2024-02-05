import type { FormInstance } from 'element-plus'
import api, { apiErrorCode } from '~/utils/api'
import { indexDB } from '~/utils/api/indexdb'

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
        const res = await api({
          method: 'post',
          url: '/user/get.user',
          data: { name: form.username },
        })
        if (res.data) {
          const user = res.data as User
          const { key, token, private_key, public_key } = await mp.key(form.username, form.password)
          const address = mp.getAddress('Bearer ' + token)
          if (address === user.address) {
            // login success
            const mp_private_key = await mp.encrypt(private_key, key)
            indexDB.setUser({ name: user.name, key, token, mp_private_key }).then((ok) => {
              if (ok) {
                userStore.initUser(user, token)
                // auto add public_key
                if (!user.public_key) {
                  api({
                    method: 'post',
                    url: '/user/update',
                    data: { public_key },
                  })
                }
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
      url: '/user/get.user.id',
      data: { name: username },
    }).then((res) => {
      form.usernameLoading = false
      if (res.data) {
        callback()
      } else {
        callback(new Error('用户名不存在'))
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

export const useIndex = () => {
  const userStore = useUserStore()
  const router = useRouter()

  const form = reactive({
    placeholder: '没有调查，就没有发言权',
    remove: false,
  })

  const formatURL = (url: string, sug?: string) => {
    if (url.startsWith('/')) {
      return url
    }
    if (url.includes('「most-people」')) {
      const keyword = encodeURIComponent(sug || userStore.message || form.placeholder)
      return url.replace('「most-people」', keyword)
    }
    const urlObject = new URL(url)
    const keyword = userStore.message || form.placeholder
    urlObject.searchParams.set('mp-keyword', keyword)
    return urlObject.href
  }
  const send = (sug?: string) => {
    const url = formatURL(userStore.tool.url, sug)
    window.open(url)
  }

  const recognition = ref()
  onBeforeMount(() => {
    // 检查浏览器是否支持 SpeechRecognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (SpeechRecognition) {
      recognition.value = new SpeechRecognition()
      recognition.value.lang = 'zh-CN' // 设置语言
      recognition.value.interimResults = true // 设置是否返回临时结果
      recognition.value.maxAlternatives = 1 // 设置返回的最大备选词数量
      recognition.value.onstart = function () {
        // console.log('语音识别开始')
        userStore.message = ''
        form.placeholder = '请说中文'
        isListening.value = true
      }
      recognition.value.onresult = function (event: any) {
        const transcript = event.results[0][0].transcript
        userStore.message = transcript.replace(/[\.。]$/, '')
        // console.log('语音识别结果:', transcript)
      }
      recognition.value.onerror = function (event: any) {
        // console.error('语音识别错误:', event.error)
      }
      recognition.value.onend = function () {
        // console.log('语音识别结束')
        isListening.value = false
        form.placeholder = '没有调查，就没有发言权'
      }
    }
  })

  const messageElement = ref<HTMLInputElement>()
  const isListening = ref(false)
  const microphone = () => {
    if (isListening.value) {
      mp.info('请说中文')
      return
    }

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        if (recognition) {
          recognition.value.start()
          messageElement.value?.focus()
        } else {
          mp.info('您的浏览器不支持语音识别，请尝试使用最新版的 Edge 浏览器')
        }
      })
      .catch((error) => {
        mp.error('浏览器设置禁止了麦克风访问')
      })
  }
  const bindTool = (key: string) => {
    userStore.updateTool(key)
  }

  const bindAdd = () => {
    router.push({
      path: '/tool',
      query: {
        type: 'add',
      },
    })
  }
  const bindRemove = (key: string) => {
    if (userStore.user === null) {
      mp.info('请先登录，登录后即可使用')
      router.push('/mine')
      return
    }
    const i = userStore.tools.findIndex((e) => e === key)
    if (i >= 0) {
      userStore.tools.splice(i, 1)
      userStore.updateTools()
    }
  }

  return {
    userStore,
    form,
    messageElement,
    microphone,
    isListening,
    recognition,
    send,
    bindTool,
    bindAdd,
    bindRemove,
    formatURL,
  }
}

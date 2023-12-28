export const useIndex = () => {
  const form = reactive({
    message: '',
    placeholder: '没有调查，就没有发言权',
  })

  const enter = () => {
    mp.info(form.message)
  }

  return {
    form,
    enter,
  }
}

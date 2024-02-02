// import { Editor } from '@toast-ui/editor'

export const useMarkdown = (
  viewerElement: Ref<HTMLDivElement | undefined>,
  editorElement: Ref<HTMLDivElement | undefined>,
) => {
  const form = reactive({
    title: '',
    content: '',
    // 状态
    isPublic: true,
    // 多人协作
    note_password_hash: '',
    user_password_hash: '',
    inited: false,
    showEdit: false,
  })

  const backup = reactive({
    title: '',
    content: '',
    isPublic: true,
    user_password_hash: '',
    note_password_hash: '',
  })

  const needPublish = computed(() => {
    return (
      form.content !== backup.content ||
      form.title !== backup.title ||
      form.user_password_hash !== backup.user_password_hash ||
      form.note_password_hash !== backup.note_password_hash ||
      form.isPublic !== backup.isPublic
    )
  })

  const toc = computed(() => {
    const { title, content } = form
    if (!title) {
      return ''
    }
    let text = content
    // 补全代码块
    let codeBlock = text.match(/\n```/g)
    if (codeBlock && codeBlock.length % 2 === 1) {
      text += '\n```'
    }
    // 移除代码块
    text.replace(/```[\s\S]+?```/g, '')

    let arr: string[] = [`# ${title}`]
    arr = arr.concat(text.split('\n'))
    // # 号开头
    arr = arr.filter((e) => /^#+? /.test(e))
    arr = arr.map((e, i) => {
      // #
      e = e.slice(1).replace(/#/g, '>')
      // > -
      e = e.replace(/ /, ' - ')
      // 锚点
      e = e.replace(/ - (.+?)$/g, ` - <a href="#${i}">$1</a>`)
      return e
    })
    const md = arr.join('\n')
    return md
  })

  const mp_miPlugin = () => {
    const toHTMLRenderers = {
      mp_mi(node: any) {
        const content = `<mp-mi>
          <span>${node.literal}</span>
          <input placeholder="输入密码" />
          <a>解密</a>
        </mp-mi>`
        return [
          { type: 'openTag', tagName: 'div', outerNewLine: true },
          { type: 'html', content },
          { type: 'closeTag', tagName: 'div', outerNewLine: true },
        ]
      },
    }

    return { toHTMLRenderers }
  }

  const initEditor = () => {
    if (!editorElement.value) {
      return
    }
    if (!window.toastui) {
      mp.error('初始化错误')
      return
    }
    const Editor = window.toastui.Editor
    const { codeSyntaxHighlight } = Editor.plugin
    // https://nhn.github.io/tui.editor/latest/ToastUIEditorCore
    return new Editor({
      el: editorElement.value,
      height: '100%',
      initialValue: '',
      initialEditType: 'wysiwyg',
      // 隐藏切换到 markdown
      // hideModeSwitch: false,
      // 使用 google analytics
      usageStatistics: false,
      language: 'zh-CN',
      previewStyle: 'vertical',
      // 自动添加链接
      extendedAutolinks: true,
      linkAttributes: {
        target: '_blank',
      },
      plugins: [mp_miPlugin, codeSyntaxHighlight],
      customHTMLSanitizer(html: string) {
        return html
      },
    })
  }
  const initViewer = () => {
    if (!viewerElement.value) {
      return
    }
    if (!window.toastui) {
      mp.error('初始化错误')
      return
    }
    const Editor = window.toastui.Editor
    const { codeSyntaxHighlight } = Editor.plugin
    // https://nhn.github.io/tui.editor/latest/ToastUIEditorCore
    return Editor.factory({
      el: viewerElement.value,
      viewer: true,
      // 自动添加链接
      extendedAutolinks: true,
      linkAttributes: {
        target: '_blank',
      },
      plugins: [mp_miPlugin, codeSyntaxHighlight],
      customHTMLSanitizer(html: string) {
        return html
      },
    })
  }

  return {
    // init
    initEditor,
    initViewer,
    //
    needPublish,
    toc,
    form,
    backup,
  }
}

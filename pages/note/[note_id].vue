<template>
  <div id="page-note-id" ref="markdownElement">
    <mp-header title="">
      <template #right v-if="!readonly">
        <div class="edit" @click="publish" v-show="md.needPublish.value">
          <span>发布</span>
          <mp-icon name="publish" />
        </div>
        <div class="edit" @click="md.form.showEdit = true" v-show="!readonly">
          <span>编辑</span>
          <mp-icon name="edit" />
        </div>
      </template>
    </mp-header>

    <input class="note-title" v-model="md.form.title" :readonly="readonly" />
    <div class="note-public">
      <el-switch
        :value="Boolean(md.form.authors)"
        inline-prompt
        active-text="多人协作"
        inactive-text="仅自己"
        width="88"
        size="large"
        :loading="lockLoading"
        :before-change="changeNoteLock"
        :disabled="user_id !== userStore.user?.id"
      />
      <el-switch
        v-model="md.form.isPublic"
        inline-prompt
        active-text="公开"
        inactive-text="私有"
        width="60"
        size="large"
        :disabled="readonly"
      />
    </div>

    <div ref="viewerElement" v-show="!md.form.showEdit" class="mp-markdown viewer" />

    <div class="note-authors">
      <div class="authors">
        <span v-if="md.form.authors">{{ md.form.authors.map((e) => e.name).join(' ') }}</span>
        <span>{{ mp.formatTime(updated_time) }}</span>
      </div>
    </div>

    <div
      ref="editorElement"
      :class="{ 'show-edit': md.form.showEdit }"
      class="mp-markdown editor"
    />
    <div class="close" @click="editEnd" v-show="md.form.showEdit">
      <mp-icon name="edit-back" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMarkdown } from '~/composables/useMarkdown'
import api from '~/utils/api'

const route = useRoute()
const router = useRouter()
const note_id = (route.params.note_id || '') as string
const noteStore = useNoteStore()
const userStore = useUserStore()

const lockLoading = ref(false)

const changeNoteLock = (): Promise<boolean> => {
  lockLoading.value = true
  return new Promise((resolve) => {
    const user = userStore.user
    if (!user) {
      lockLoading.value = false
      return false
    }

    if (md.form.authors) {
      ElMessageBox.prompt('确认关闭多人协作？', {
        closeOnClickModal: false,
        closeOnPressEscape: false,
        showCancelButton: true,
        showClose: false,
        showInput: false,
        cancelButtonText: '取消',
        confirmButtonText: '确认',
      })
        .then(() => {
          md.form.authors = undefined
          md.form.address = undefined
          resolve(true)
          lockLoading.value = false
        })
        .catch(() => {
          resolve(false)
          lockLoading.value = false
        })
    } else {
      ElMessageBox.prompt('请设置协作密码', {
        title: '设置协作密码',
        closeOnClickModal: false,
        closeOnPressEscape: false,
        showCancelButton: true,
        showClose: false,
        showInput: true,
        cancelButtonText: '取消',
        confirmButtonText: '确认',
        inputValidator(v: string) {
          if (!v) {
            return '请设置协作密码'
          }
          return true
        },
      })
        .then(async ({ value }) => {
          lockLoading.value = false
          const password = value
          const { address } = await mp.key('/authors/' + note_id, password)
          const password_hash = await mp.encrypt(password)
          md.form.authors = [
            {
              name: user.name,
              password_hash,
            },
          ]
          md.form.address = address
          resolve(true)
        })
        .catch(() => {
          resolve(false)
          lockLoading.value = false
        })
    }
  })
}

const publish = async () => {
  const username = localStorage.getItem('username')
  let text = md.form.content
  if (md.form.isPublic == false) {
    const author = md.form.authors?.find((e) => e.name === username)
    if (author) {
      const password = await mp.decrypt(author.password_hash)
      if (password) {
        const { key } = await mp.key('/authors/' + note_id, password)
        text = await mp.encrypt(text, key)
      }
    } else {
      text = await mp.encrypt(text)
    }
  }

  const res = await api({
    method: 'put',
    url: '/note/update',
    data: {
      id: Number(note_id),
      title: md.form.title,
      content: text,
      authors: md.form.authors,
      address: md.form.address,
    },
  })
  if (res.data?.statusCode === 1004) {
    router.push('/login')
    return
  }
  if (res.data === true) {
    mp.success('发布成功！')

    // 发布状态
    md.backup.content = md.form.content
    md.backup.title = md.form.title
    md.backup.authors = md.form.authors
    md.backup.address = md.form.address

    const i = noteStore.notes.findIndex((e) => String(e.id) === note_id)
    if (i !== -1) {
      noteStore.notes[i].title = md.form.title
      noteStore.notes[i].content = text
    }
  }
}

const decryptContent = async (content: string) => {
  const username = localStorage.getItem('username')
  let result = ''
  if (content.startsWith('mp://')) {
    try {
      const author = md.form.authors?.find((e) => e.name === username)
      if (author) {
        const password = await mp.decrypt(author.password_hash)
        console.log('🌊', password)
        const { key } = await mp.key('/authors/' + note_id, password)
        const text = await mp.decrypt(content, key)
        if (text) {
          result = text
        }
      } else {
        const text = await mp.decrypt(content)
        if (text) {
          result = text
        }
      }
    } catch (error) {
      console.error(error)
    }
  }
  if (!result) {
    result = content || '# 新建笔记\n点击右上角 开启编辑'
  }
  md.form.content = result
  md.backup.content = result
  viewer.setMarkdown(result)
  editor.setMarkdown(result)
}
const user_id = ref(0)
const updated_time = ref('')
const readonly = computed(() => {
  if (userStore.user?.id === user_id.value) {
    return false
  }
  return !md.form.authors
})

const editEnd = () => {
  md.form.content = editor.getMarkdown()
  md.form.showEdit = false
  viewer.setMarkdown(md.form.content)
}

const init = async () => {
  const username = localStorage.getItem('username') || ''
  const res = await api({ method: 'post', url: '/db/Notes/' + note_id })
  md.form.inited = true
  if (res.data?.id) {
    const note: Note = res.data
    // 多人协作
    if (note.authors) {
      const author = note.authors.findLast((e) => e.name === username)
      // 加入协作
      if (!author) {
        ElMessageBox.prompt('请输入协作密码', {
          title: '加入笔记',
          closeOnClickModal: false,
          closeOnPressEscape: false,
          showCancelButton: true,
          showClose: false,
          showInput: true,
          cancelButtonText: '取消',
          confirmButtonText: '确认',
          async beforeClose(action, instance, done) {
            if (action === 'confirm') {
              const password = instance.inputValue
              const { address } = await mp.key('/authors/' + note_id, password)
              const password_hash = await mp.encrypt(password)
              if (note.authors && address === note.address) {
                // 加入笔记
                note.authors = note.authors.concat([
                  {
                    name: username,
                    password_hash,
                  },
                ])
                md.form.authors = note.authors
                // 解密内容
                decryptContent(note.content)
                done()
              } else {
                mp.error('密码不正确')
              }
            } else {
              done()
            }
          },
          inputValidator(v: string) {
            if (!v) {
              return '请输入协作密码'
            }
            return true
          },
        })
          .then(() => {
            lockLoading.value = false
          })
          .catch(() => {
            lockLoading.value = false
          })
      }
    }
    // 是否协作
    md.form.authors = note.authors
    md.backup.authors = note.authors
    md.form.address = note.address
    md.backup.address = note.address
    // 解密内容
    decryptContent(note.content)
    // 标题
    useHead({ title: note.title })
    md.form.title = note.title
    md.backup.title = note.title
    // 是否公开
    const isPublic = note.content.startsWith('mp://') === false
    md.form.isPublic = isPublic
    md.backup.isPublic = isPublic
    // 创建者
    user_id.value = note.user_id
    // 更新时间
    updated_time.value = note.updated_time
  } else {
    mp.error('笔记不存在')
    router.back()
  }
}

const viewerElement = ref<HTMLDivElement>()
const editorElement = ref<HTMLDivElement>()
const md = useMarkdown(viewerElement, editorElement)

let viewer: any
let editor: any
onMounted(() => {
  editor = md.initEditor()
  viewer = md.initViewer()
  init()
})
</script>

<style lang="scss">
#page-note-id.page {
  .markdown-empty {
    text-align: center;
  }

  .note-title {
    background: transparent;
    border: 0;
    outline: 0;
    font-size: 28px;
    line-height: 32px;
    font-weight: 700;
    width: 100%;
    text-align: center;
    background: #eee;
  }

  .note-public {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 100%;
    font-size: 14px;
    color: #909399;
    .el-switch + .el-switch {
      margin-left: 10px;
    }
  }

  .note-authors {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    .authors {
      display: flex;
      align-items: center;
      flex-direction: column;
      gap: 8px;
    }
  }
}
</style>

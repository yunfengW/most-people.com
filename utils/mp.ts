import { toUtf8Bytes, hexlify, toUtf8String, pbkdf2, sha256, getBytes, Wallet } from 'ethers'
import dayjs from 'dayjs'

const mp = {
  // 本地私钥
  async key(username: string, password: string) {
    const p = toUtf8Bytes(password)
    const salt = toUtf8Bytes('/mp/' + username)
    const kdf = pbkdf2(p, salt, 1, 256 / 8, 'sha512')
    const privateKey = sha256(kdf)

    // address
    const wallet = new Wallet(privateKey)

    const message = String(dayjs().unix())
    const sig = await wallet.signMessage(message)
    const token = [message, sig].join()

    const array = toUtf8Bytes(privateKey)
    const keydata = array.slice(-32)
    // https://gist.github.com/pedrouid/b4056fd1f754918ddae86b32cf7d803e#aes-gcm
    const key = await window.crypto.subtle.importKey('raw', keydata, { name: 'AES-GCM' }, false, [
      'encrypt',
      'decrypt',
    ])

    const address = wallet.address
    return { key, address, token }
  },
  // 加密
  async encrypt(text: string, key?: CryptoKey) {
    if (!key) {
      console.error('not found key')
      return ''
    }
    const version = 'mp://1'
    const iv = String(Date.now())
    const encryptedBytes = await window.crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: toUtf8Bytes(iv),
        tagLength: 32,
      },
      key,
      toUtf8Bytes(text),
    )
    const data = hexlify(new Uint8Array(encryptedBytes)).slice(2)
    const encrypted = [version, iv, data]
    return encrypted.join('.')
  },
  // 解密
  async decrypt(encrypted: string, key: CryptoKey) {
    const [version, iv, data] = encrypted.split('.')
    if (version !== 'mp://1') {
      console.error('version error')
      return ''
    }
    try {
      const decryptedBytes = await window.crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: toUtf8Bytes(iv),
          tagLength: 32,
        },
        key,
        getBytes('0x' + data),
      )
      const decrypted = toUtf8String(new Uint8Array(decryptedBytes))
      return decrypted
    } catch (error) {
      console.error('decrypt error')
      return ''
    }
  },
  // 驼峰命名法（camelCase）转 短横线分隔命名法（kebab-case）
  hyphenate(str: string) {
    return str.replace(/\B([A-Z])/g, '-$1').toLowerCase()
  },
  // 短横线分隔命名法（kebab-case）转 驼峰命名法（camelCase）
  camelize(str: string) {
    const result = str.replace(/-(\w)/g, (_, c) => (c ? c.toUpperCase() : ''))
    // 首字母大写
    return result.charAt(0).toUpperCase() + result.slice(1)
  },
  // 错误提示
  error(message: string) {
    ElMessage({
      message: message,
      type: 'error',
      // duration: 0,
      customClass: 'mp-message-error',
      grouping: true,
    })
  },
  // 成功提示
  success(message: string) {
    ElMessage({
      message,
      type: 'success',
      // duration: 0,
      customClass: 'mp-message-success',
      grouping: true,
    })
  },
  // 消息提示
  info(message: string) {
    ElMessage({
      message,
      type: 'info',
      // duration: 0,
      customClass: 'mp-message-info',
      grouping: true,
    })
  },
}

export default mp

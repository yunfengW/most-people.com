import {
  toUtf8Bytes,
  hexlify,
  toUtf8String,
  pbkdf2,
  sha256,
  getBytes,
  Wallet,
  SigningKey,
} from 'ethers'
import dayjs from 'dayjs'
import elliptic from 'elliptic'
import { indexDB } from '~/utils/api/indexdb'

declare global {
  interface Window {
    sogou: {
      sug: (data: string[][]) => void
    }
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}

const mp = {
  // 本地私钥
  async key(username: string, password: string) {
    const p = toUtf8Bytes(password)
    const salt = toUtf8Bytes('/mp/' + username)
    const kdf = pbkdf2(p, salt, 1, 256 / 8, 'sha512')
    const privateKey = sha256(kdf)

    // key
    const keydata = toUtf8Bytes(privateKey).slice(-32)
    // https://gist.github.com/pedrouid/b4056fd1f754918ddae86b32cf7d803e#aes-gcm
    const key = await window.crypto.subtle.importKey('raw', keydata, { name: 'AES-GCM' }, false, [
      'encrypt',
      'decrypt',
    ])

    // address
    const wallet = new Wallet(privateKey)
    const address = wallet.address
    const { publicKey, compressedPublicKey } = new SigningKey(privateKey)

    // token
    const message = String(dayjs().unix())
    const sig = await wallet.signMessage(message)
    const token = [message, sig].join()

    return { key, address, token, privateKey, publicKey, compressedPublicKey }
  },
  getPublicKey(compressedPublicKey: string) {
    // 压缩公钥 还原 完整公钥
    try {
      const key2 = new elliptic.ec('secp256k1').keyFromPublic(compressedPublicKey.slice(2), 'hex')
      const publicKey = key2.getPublic().encode('hex', false)
      return '0x' + publicKey
    } catch (error) {
      console.error(error)
    }
    return ''
  },
  // 加密
  async encrypt(text: string, key?: CryptoKey) {
    if (!key) {
      key = await indexDB.getKey()
    }
    if (!key) {
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
  async decrypt(encrypted: string, key?: CryptoKey) {
    if (!key) {
      key = await indexDB.getKey()
    }
    if (!key) {
      return ''
    }
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
  deBase64(s: string) {
    return decodeURIComponent(atob(s))
  },
  enBase64(s: string) {
    return btoa(encodeURIComponent(s))
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

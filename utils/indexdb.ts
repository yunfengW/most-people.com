// 阮一峰 : 浏览器数据库 IndexedDB 入门教程
// https://www.ruanyifeng.com/blog/2018/07/indexeddb.html

export interface UserDB {
  name: string
  key: CryptoKey
  token: string
}

let db: IDBDatabase | undefined

export const indexDB = {
  init(): Promise<void> {
    return new Promise((resolve) => {
      const request = window.indexedDB.open('most-people', 1)
      request.onsuccess = () => {
        db = request.result
        if (db.objectStoreNames.contains('user')) {
          resolve()
        }
      }
      request.onupgradeneeded = (event: any) => {
        db = event.target.result as IDBDatabase
        // 表格 table
        if (!db.objectStoreNames.contains('user')) {
          // 主键 keyPath
          db.createObjectStore('user', { keyPath: 'name' })
        }
        if (db.objectStoreNames.contains('user')) {
          resolve()
        }
      }
    })
  },
  // 获取用户
  getUser(name: string): Promise<UserDB | null> {
    return new Promise((resolve) => {
      if (!db) {
        resolve(null)
        return
      }
      const store = db.transaction(['user']).objectStore('user')
      const request = store.get(name)
      request.onsuccess = () => {
        if (request.result) {
          const user: UserDB = request.result
          resolve(user)
        } else {
          resolve(null)
        }
      }
      request.onerror = () => {
        resolve(null)
      }
    })
  },

  // 设置用户
  setUser(name: string, key: CryptoKey, token: string): Promise<boolean> {
    return new Promise((resolve) => {
      if (!db) {
        resolve(false)
        return
      }
      const store = db.transaction(['user'], 'readwrite').objectStore('user')
      const request = store.put({ name, key, token })
      request.onsuccess = () => {
        window.localStorage.setItem('username', name)
        resolve(true)
      }
      request.onerror = () => {
        resolve(false)
      }
    })
  },

  // 删除用户
  delUser(name: string): Promise<boolean> {
    return new Promise((resolve) => {
      if (!db) {
        resolve(false)
        return
      }
      const store = db.transaction(['user'], 'readwrite').objectStore('user')
      const request = store.delete(name)
      request.onsuccess = () => {
        resolve(true)
      }
      request.onerror = () => {
        resolve(false)
      }
    })
  },
}

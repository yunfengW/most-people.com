<template>
  <div id="page-chat">
    <mp-header title="加密聊天" />

    <h4>开发中</h4>
  </div>
</template>

<script setup lang="ts">
onMounted(async () => {
  // 私聊
  const SEA = await mp.key('Test1', 'most-people.com')
  const FourU = await mp.key('Test2', 'www.most-people.com')

  const encoded1 = mp.encode('SEA: 你好吗', FourU.public_key, SEA.private_key)
  const messageSEA = mp.decode(encoded1, SEA.public_key, FourU.private_key)
  console.log('🌊', messageSEA)
  const encoded2 = mp.encode('4u: 我很好', SEA.public_key, FourU.private_key)
  const message4u = mp.decode(encoded2, FourU.public_key, SEA.private_key)
  console.log('🌊', message4u)

  // 群聊
  const { key } = await mp.key('most-people', '德玛西亚')
  const encrypted = await mp.encrypt('你好', key)
  const decrypted = await mp.decrypt(encrypted, key)
  console.log('🌊', decrypted)
})
</script>

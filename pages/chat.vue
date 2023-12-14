<template>
    <div id="page-chat">
        <mp-header title="加密聊天" />
    </div>
</template>

<script setup lang="ts">
onMounted(async () => {
    const SEA = await mp.key('Test1', 'most-people.com')
    const FourU = await mp.key('Test2', 'www.most-people.com')

    const encoded = mp.encode('瓦萨', FourU.public_key, SEA.private_key)
    const test = mp.decode(encoded, SEA.public_key, FourU.private_key)
    console.log('🌊', test)
    const encoded2 = mp.encode('答复发', SEA.public_key, FourU.private_key)
    const test2 = mp.decode(encoded2, FourU.public_key, SEA.private_key)
    console.log('🌊', test2)
})
</script>
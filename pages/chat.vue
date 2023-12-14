<template>
    <div id="page-chat">
        <mp-header title="加密聊天" />
    </div>
</template>

<script setup lang="ts">
onMounted(async () => {
    const SEA = await mp.key('Test1', 'most-people.com')
    const FourU = await mp.key('Test2', 'www.most-people.com')
    const encoded = mp.encode('防守打法是的发生大法师代发打撒', SEA.private_key, FourU.public_key)
    console.log('🌊', encoded)
    const ybyb = mp.decode(encoded, SEA.public_key, FourU.private_key)
    console.log('🌊', ybyb)

})
</script>
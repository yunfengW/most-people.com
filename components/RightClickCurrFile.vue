<template>
  <!-- 外层最大盒子设置contextmenu事件-->
  <div class="curr_Menu" @contextmenu.prevent="openMenu($event)">
    <div class="mainBox"></div>
    <!-- 右击弹框设置 -->
    <div
      class="curr_text"
      v-show="person.visible"
      :style="{ left: person.left + 'px', top: person.top + 'px' }"
    >
      <div
        class="curr_item"
        v-for="(menu, meIndex) in person.rightMenu"
        :key="meIndex"
        @click="onMenu(menu, meIndex)"
      >
        {{ menu.name }}
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { reactive, watch } from 'vue'
const person = reactive({
  visible: false, // 控制菜单栏的隐藏与展示
  top: 0, // 定义菜单栏出现的位置
  left: 0,
  rightMenu: [{ name: '打开' }, { name: '重命名' }, { name: '删除' }],
})

const emits = defineEmits(['onMenus', 'openCurr'])

watch(
  () => person.visible,
  (newVal) => {
    // 如果打开了菜单栏
    if (newVal) {
      // 在body上设置点击事件 ， 移除菜单栏
      document.body.addEventListener('click', closeMenu)
    } else {
      // 如果没有出现菜单栏 ， 就直接移除body上的点击事件，以免其他页面出现问题
      document.body.removeEventListener('click', closeMenu)
    }
  },
)

// 鼠标右击
const openMenu = (e: any) => {
  // 设置菜单栏出现的位置
  let x = e.clientX
  let y = e.clientY
  person.top = y
  person.left = x
  // 右击打开了菜单栏
  person.visible = true
  emits('openCurr', person.visible)
}

// 菜单栏关闭执行回调
const closeMenu = () => {
  person.visible = false
}
// 右击菜单
const onMenu = (item: any, index: number) => {
  emits('onMenus', item)
}
</script>
<style lang="scss" scoped>
.curr_Menu {
  position: absolute;
  width: 100%;
  height: 100%;
  background-size: 100% 100%;
  .curr_text {
    margin: 0;
    background: #fff;
    position: fixed;
    z-index: 99999;
    padding: 5px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
  }
  .curr_item {
    margin: 0;
    padding: 7px 16px;
    cursor: pointer;
    transition: all 0.3s;
    text-align: left;
  }
  .curr_item:hover {
    background: #2080f7;
    color: white;
  }
}
</style>

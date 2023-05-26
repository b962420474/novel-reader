<template>
  <div v-show="menus.length < 1" style="width:100%;height: 100%; position: absolute;">
    <div style="
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    font-size: 30px;
    "> 内容加载中</div>
  </div>
  <div v-show="menus.length >= 1">
    <my-content @handleClick="handleClick" @next="next" :contents="contents" :id="id" :height="config.height"
      :width="config.width" :font-size="store.state.fontSize" :line-height="store.state.fontSize + 6" :style="styles"
      :menus="menus" :url="(route.query.url as string)" ref="cont">
    </my-content>
    <div v-show="isShow" style="width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 220;
    background: rgba(0,0,0,0.12);" @click="handleClick">
      <tab :title="title" v-show="!menuShow"></tab>
      <the-menu :menus="menus" :isShow="menuShow" @jump="jump" :id="id"></the-menu>
      <toolbar @menuToggle="menuToggle" v-show="!menuShow" :isShow="!isShow"></toolbar>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import tab from './components/tab.vue'
import myContent from './components/content/index.vue'
import toolbar from './components/toolbar/index.vue'
import theMenu from './components/menu.vue'
import { load } from '@/chrome/reader'
import { loadBookmark } from '@/chrome'
import { useStore } from 'vuex'
const route = useRoute()

// 加载小说数据
const { title, contents, menus } = load(route.query.url as string)

// 更新章节
const id = ref(1)
const next = (page: number) => {
  if (page <= menus.value.length && page >= 1) {
    id.value = page
  }
}

// 侧边栏隐藏显示
const isShow = ref(false)
const handleClick = () => {
  isShow.value = !isShow.value
  menuShow.value = false
}
const hide = () => {
  isShow.value = false
  menuShow.value = false
}
const menuShow = ref(false)
const menuToggle = () => {
  menuShow.value = !menuShow.value
}

// 跳转目录
const cont = ref(null)
const jump = (i: number) => {
  hide()
  id.value = i
  if (cont.value) {
    (cont.value as any).init()
  }
}
// 加载书签数据
const readBookMark = () => {
  const data = loadBookmark(route.query.url as string)
  onMounted(() => {
    if (data) {
      id.value = data.id
      if (cont.value) {
        (cont.value as any).init(data.cacheId)
      }
    }
  })
}
readBookMark()

// 初始化样式
const store = useStore()
const initStyle = () => {
  const config = ref({
    width: 370,
    height: 565
  })
  const styles = computed(() => {
    return {
      fontSize: store.state.fontSize + 'px',
      lineHeight: store.state.fontSize + 6 + 'px',
      width: config.value.width + 'px',
      height: config.value.height + 'px'
    }
  })
  const resize = () => {
    console.log('resize.....')
    const w = document.documentElement.clientWidth
    const h = document.documentElement.clientHeight
    config.value.width = w
    config.value.height = h
  }
  onMounted(() => {
    resize()
    window.addEventListener('resize', resize, false)
  })
  onBeforeUnmount(() => {
    window.removeEventListener('resize', resize, false)
  })
  return { config, styles }
}
const { styles, config } = initStyle()
</script>
<style lang="scss" scoped>
* {
  background: #dbcdcd;
}
</style>

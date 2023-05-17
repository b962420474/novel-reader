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
      :width="config.width" :font-size="config.fontSize" :line-height="config.lineHeight" :style="styles" :menus="menus"
      :url="(route.query.url as string)" ref="cont">
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
      <toolbar @menuToggle="menuToggle" v-show="!menuShow"></toolbar>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import tab from './components/tab.vue'
import myContent from './components/content/index.vue'
import toolbar from './components/toolbar.vue'
import theMenu from './components/menu.vue'
import { load } from '@/chrome/reader'
import { loadBookmark } from '@/chrome'
const route = useRoute()
const isShow = ref(false)
const id = ref(1)
const { title, contents, menus } = load(route.query.url as string)
const config = {
  fontSize: 20,
  lineHeight: 22,
  width: 370,
  height: 565
}
const styles = ref({
  fontSize: config.fontSize + 'px',
  lineHeight: config.lineHeight + 'px',
  width: config.width + 'px',
  height: config.height + 'px'
})
const next = (page: number) => {
  if (page <= menus.value.length && page >= 1) {
    id.value = page
  }
}
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
</script>
<style lang="scss" scoped>
* {
  background: #dbcdcd;
}
</style>

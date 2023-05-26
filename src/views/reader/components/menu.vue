<template>
  <virtual-scroll class="menus" :sourceDataList="menus" :oneDataHeight="41" :style="styles" ref="vs">
    <template #item="{ data }">
      <div @click="click($event, data as menu)" :class="id === (data as menu).id ? 'active' : ''">{{
        (data as menu).name }}</div>
    </template>
  </virtual-scroll>
</template>
<script setup lang="ts">
import { menu } from '@/types/book'
import { computed, ref, watch } from 'vue'
import VirtualScroll from '@/views/components/virtual-scroll/index.vue'
const props = defineProps<{
  menus: menu[],
  isShow: boolean,
  id: number
}>()

const styles = computed(() => {
  return props.isShow ? { transform: 'translateX(0)' } : { transform: 'translateX(-100%)' }
})

// 显示定位当前章节
const vs = ref(null)
watch(() => props.isShow, (oldVal, newVal) => {
  if (oldVal !== newVal && !newVal) {
    if (vs.value && props.isShow) {
      (vs.value as any).myResize();
      (vs.value as any).setCurrentIndex(props.menus.findIndex(item => item.id === props.id))
    }
  }
})

// 目录跳转
interface Emits {
  (event: 'jump', value: number): void
}
const emit = defineEmits<Emits>()
const click = (e: MouseEvent, item: menu) => {
  e.stopPropagation()
  emit('jump', item.id)
}
</script>
<style lang="scss" scoped>
.menus {
  text-align: left;
  position: absolute;
  z-index: 200;
  left: 0;
  padding-top: 20px;
  display: block;
  width: 70%;
  height: calc(100% - 20px);
  overflow-y: auto;
  // transition: all 0.3s;
  background: #dbcdcd;

  .active {
    background: #888484;
  }

  div {
    padding: 5px;
    border-top: 1px solid #cbb5b545;
    line-height: 30px;
  }
}
</style>

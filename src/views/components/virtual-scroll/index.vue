<template>
  <!-- wrapper可视容器需要设置overflow-y:auto;才能监听滚动事件，在父组件使用该组件时，需要设置wrapper可视容器的区域范围 -->
  <div class="wrapper" @scroll.passive="scrollHandler" ref="wrapper">
    <!-- content填充要显示内容以及上下空白占位 -->
    <div class="content" :style="blankFillStyle">
      <div v-for="(item, index) in showDataList" :key="index">
        <!-- 每条数据的内容结构通过插槽的方式让父组件调用该组件时填充进来 -->
        <slot name="item" :data="item"></slot>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, nextTick, onMounted, ref } from 'vue'

const props = defineProps({
  oneDataHeight: {
    type: Number,
    default: 0
  },
  // 所有数据据列表
  sourceDataList: {
    type: Array,
    default: () => []
  },
  // 是否向外触发滚动至底事件(scroll-last)
  scrollLastFlag: {
    type: Boolean,
    default: false
  },
  // 是否向外触发滚动事件(scroll)，会传出滚动的位移
  scrollFlag: {
    type: Boolean,
    default: false
  }
})
const wrapper = ref(null)
const screenContainSize = ref(0)
// 当前数据起始位置索引
const startIndex = ref(0)
// 滚动事件触发执行的函数
// 保存滚动位移
const endIndex = computed(() => {
  // 屏幕下方加一屏缓冲数据，以消除因向上滚动过快而出现的白屏现象
  // let endIndex = this.startIndex + this.screenContainSize;
  let endIndex = startIndex.value + screenContainSize.value * 2
  // 如果endIndex位置索引数据不存在，则就等于源数据的长度
  if (!props.sourceDataList[endIndex]) {
    endIndex = props.sourceDataList.length
  }
  return endIndex
})
const showDataList = computed(() => {
  // 屏幕上方留一屏缓冲数据，以消除因向下滚动过快而出现的白屏现象
  let startIndex1 = startIndex.value
  if (startIndex1 < screenContainSize.value) {
    startIndex1 = 0
  } else {
    startIndex1 = startIndex.value - screenContainSize.value
  }
  // 截取要展示的数据
  return props.sourceDataList.slice(startIndex1, endIndex.value)
})
// 计算上下空白占位填充
const blankFillStyle = computed(() => {
  // 上方因为留了一屏缓冲数据，因此滚动过一屏数据后才开始计算上方空白占位
  let startIndex1 = startIndex.value
  if (startIndex1 < screenContainSize.value) {
    startIndex1 = 0
  } else {
    startIndex1 = startIndex.value - screenContainSize.value
  }
  return {
    paddingTop: startIndex1 * props.oneDataHeight + 'px',
    paddingBottom: (props.sourceDataList.length - endIndex.value) * props.oneDataHeight + 'px'
  }
})
const myResize = () => {
  if (wrapper.value) {
    console.log((wrapper.value as HTMLElement).offsetHeight)
    screenContainSize.value = ~~((wrapper.value as HTMLElement).offsetHeight / props.oneDataHeight) + 2
  }
}
onMounted(() => {
  nextTick(() => {
    // 挂载后，根据可视容器高度计算可视屏幕容积数量
    myResize()
    // 屏幕尺寸变化以及横屏，都要重新计算可视屏幕容积数量
    window.onresize = myResize
    window.onorientationchange = myResize
  })
})
const scrollHandler = () => {
  // 1.定时器节流方式
  // 定时器节流，因为定时时间是设定死的，无法根据设备屏幕刷新率相匹配；
  // 如果定时时间设置高了，对于高刷新率设备屏幕来说，当滚动速度很快时，这个定时节流就是个累赘，数据处理速率慢，很容易出现白屏现象
  // this.scrollFn();

  // 2.请求动画帧节流方式
  // 请求动画帧函数是根据设备屏幕的刷新率来设置回调函数执行的时间间隔的，效果上比定时器节流要好很多

  const fps = 30 // 屏幕刷新率为30hz
  const interval = parseInt(1000 / fps + '') // 每次的时间间隔
  let then = Date.now()
  // 定义请求动画帧回调函数
  const callback = () => {
    const now = Date.now()
    setStartIndex()
    // 兼容低刷新率设备，如果屏幕刷新率低于30hz，递归执行回调函数
    if (now - then >= interval) {
      then = now
      window.requestAnimationFrame(callback)
    }
  }
  window.requestAnimationFrame(callback)
}
// 根据滚动的位移计算当前数据起始位置索引
const setStartIndex = () => {
  const scrollY = (wrapper.value as unknown as HTMLElement).scrollTop
  console.log(scrollY)
  const currentIndex = ~~(scrollY / props.oneDataHeight)
  // 如果上一次的startIndex与现在的startIndex相等，直接返回，无须处理
  if (currentIndex === startIndex.value) return
  startIndex.value = currentIndex
  // 滚动至底向外触发事件
}
const setCurrentIndex = (current: number) => {
  (wrapper.value as unknown as HTMLElement).scrollTop = ((current - 4) >= 0 ? (current - 4) : current) * props.oneDataHeight
  setStartIndex()
}
defineExpose({
  myResize,
  setCurrentIndex
})
</script>
<style scoped>
.wrapper {
  overflow-y: auto;
}
</style>

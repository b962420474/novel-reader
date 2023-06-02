<template>
  <div id="book" @click="handleClick">
    <div class="page" v-for="(item, index) in datas" :key="index" :style="styles(index)">
      <slot v-bind:item="item"></slot>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, nextTick } from 'vue'
const props = defineProps<{
  list: string[]
}>()
interface Emits {
  (event: 'handleClick'): void
  (event: 'prev'): void
  (event: 'next'): void
}
const emit = defineEmits<Emits>()
const styles = computed(() => (index: number) => {
  const params = {
    'transform-origin': 'left',
    transition: 'none'
  }
  if (index === 1) {
    return {
      ...params,
      transform: 'translate(0px,0px)',
      zIndex: 100
    }
  } else if (index === 0) {
    return {
      ...params,
      transform: 'translate(0px,0px) rotateY(90deg)',
      zIndex: 0
    }
  } else if (index === 2) {
    return {
      ...params,
      transform: 'translate(0px,0px)',
      zIndex: 10
    }
  } else {
    return {
      ...params,
      transform: 'translate(0px,0px)',
      zIndex: 0
    }
  }
})
const datas = computed(() => {
  const result: string[] = []
  result.push(...props.list.slice(0, 3))
  return result
})
const handleClick = (e: MouseEvent) => {
  const target = document.getElementById('book')
  const width = target?.offsetWidth || 0
  const pageX = e.pageX
  if (pageX < (width / 3)) {
    prev()
  } else if (pageX > (width / 3 * 2)) {
    next()
  } else {
    emit('handleClick')
  }
}
const prev = () => {
  return new Promise<void>((resolve, reject) => {
    if (props.list[0] === '') {
      reject(new Error('已是首页'))
      return
    }
    const dom = document.querySelectorAll('#book .page')[0] as HTMLElement
    if (dom) {
      dom.style.transform = 'rotateY(0deg)'
      dom.style.transition = 'all 0.5s ease-in'
      dom.style.zIndex = '1001'
    }
    const end = () => {
      dom.removeEventListener('webkitTransitionEnd', end)
      nextTick(() => {
        emit('prev')
        resolve()
      })
    }
    dom.addEventListener('webkitTransitionEnd', end, false)
  })
}
const next = () => {
  return new Promise<void>((resolve, reject) => {
    if (props.list[2] === '') {
      reject(new Error('已是尾页'))
      return
    }
    const dom = document.querySelectorAll('#book .page')[1] as HTMLElement
    if (dom) {
      const end = () => {
        dom.removeEventListener('webkitTransitionEnd', end)
        nextTick(() => {
          emit('next')
          resolve()
        })
      }
      if (document.visibilityState === 'visible') {
        dom.style.transform = 'rotateY(90deg)'
        dom.style.transition = 'all 0.5s ease-in'
        dom.addEventListener('webkitTransitionEnd', end, false)
      } else {
        end()
      }
    }
  })
}
defineExpose({
  prev,
  next
})
</script>
<style scoped lang="scss">
#book {
  position: relative;

  .page {
    position: absolute;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
}
</style>

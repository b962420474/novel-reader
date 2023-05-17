<template>
  <div id="content">
    <turn :list="cache" @handleClick="handleClick" @prev="prev" @next="next" ref="turner">
      <template #default="{ item }">
        <div v-html="item"></div>
      </template>
    </turn>
  </div>
</template>
<script lang="ts" setup>
import { computed, nextTick, ref } from 'vue'
import turn from '@/views/components/turn.vue'
import { content, menu } from '@/types/book'
import getPages from './cal'
import { saveBookmark } from '@/chrome'
import { initTTS } from '../tts'
const props = defineProps<{
  fontSize: number,
  lineHeight: number,
  contents: content,
  width: number,
  height: number,
  id: number,
  menus: menu[],
  url: string
}>()
const turner = ref(null)
interface Emits {
  (event: 'handleClick'): void
  (event: 'hide'): void
  (event: 'next', value: number): void
}
const emit = defineEmits<Emits>()
const handleClick = () => {
  emit('handleClick')
}
const prev = () => {
  cacheId.value--
  if (cacheId.value < 0) {
    if (prevList.value) {
      cacheId.value = prevList.value.length - 1
    }
    emit('next', props.id - 1)
  }
  nextTick(() => {
    saveBookmark(props.url, { cacheId: cacheId.value, id: props.id })
  })
}
const next = () => {
  cacheId.value++
  if (currentList.value && cacheId.value > currentList.value.length - 1) {
    cacheId.value = 0
    emit('next', props.id + 1)
  }
  nextTick(() => {
    saveBookmark(props.url, { cacheId: cacheId.value, id: props.id })
  })
}
const getTitle = (id: number) => {
  const i = props.menus.findIndex(item => item.id === id)
  return props.menus[i].name
}
const getContent = (text: string, title: string) => {
  return getPages(text, props.width, props.height, props.fontSize, props.lineHeight, title)
}
const prevList = computed(() => {
  const c = props.contents[props.id - 1] || ''
  if (c) {
    return getContent(c, getTitle(props.id - 1))
  } else {
    return []
  }
})
const currentList = computed(() => {
  const c = props.contents[props.id] || ''
  if (c) {
    return getContent(c, getTitle(props.id))
  } else {
    return []
  }
})
const nextList = computed(() => {
  const c = props.contents[props.id + 1] || ''
  if (c) {
    return getContent(c, getTitle(props.id + 1))
  } else {
    return []
  }
})
const cacheId = ref(0)
const cache = computed(() => {
  let m: string[] = []
  if (cacheId.value >= 1) {
    m = currentList.value?.slice(cacheId.value - 1, cacheId.value - 1 + 3) || []
    if (m && m.length < 3 && nextList.value) {
      m.push(...nextList.value?.slice(0, 3 - m.length))
    }
    if (m && m.length < 3) {
      m.push(...['', '', ''].slice(0, 3 - m.length))
    }
  } else {
    if (prevList.value && prevList.value.length > 0) {
      m = prevList.value.slice(prevList.value.length - 1, prevList.value.length)
    } else {
      m = ['']
    }
    if (currentList.value) {
      m.push(...currentList.value.slice(0, 2))
    }
    if (m && m.length < 3 && nextList.value) {
      m.push(...nextList.value?.slice(0, 3 - m.length))
    }
    if (m && m.length < 3) {
      m.push(...['', '', ''].slice(0, 3 - m.length))
    }
  }
  return m
})

// 语音播报
initTTS(() => {
  return cache.value[1].replaceAll('<br>', '').replaceAll('</br>', '').replaceAll('<h4>', '').replaceAll('</h4>', '').replaceAll('&nbsp;', '')
}, async () => {
  if (turner.value) {
    await (turner.value as any).next()
  }
})

const init = (value = 0) => {
  cacheId.value = value
  nextTick(() => {
    saveBookmark(props.url, { cacheId: cacheId.value, id: props.id })
  })
}
defineExpose({
  init
})
</script>
<style scoped lang="scss">
#content {
  text-align: left;

  div {
    width: 100%;
    height: 100%;
    background: #dbcdcd;
  }

}
</style>

<template>
  <div class="bottom">
    <div class="flex" v-show="!setShow">
      <div class="iconfont btn" @click="handleToggle($event)">&#xe890;</div>
      <div class="iconfont btn" @click="openSetting($event)">&#xe8b7;</div>
      <div class="iconfont btn">&#xe712;</div>
      <div class="iconfont btn" @click="handlePlay($event)">{{ state ? '&#xe629;' : '&#xe8a3;' }}</div>
    </div>
    <setting v-show="setShow" @hide="setShow=false"></setting>
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'
import setting from './setting.vue'
import { pause, play } from '../tts'

interface Emits {
  (event: 'menuToggle'): void
}
const emit = defineEmits<Emits>()
const handleToggle = (e: MouseEvent) => {
  e.stopPropagation()
  emit('menuToggle')
}
// 语音播报
const state = ref(false)
const handlePlay = (e: MouseEvent) => {
  e.stopPropagation()
  if (state.value) {
    pause()
  } else {
    play()
  }
  state.value = !state.value
}

// setting
const props = defineProps<{
  isShow: boolean
}>()
const setShow = ref(false)
watch(() => props.isShow, () => {
  if (props.isShow) {
    setShow.value = false
  }
})
const openSetting = (e: MouseEvent) => {
  e.stopPropagation()
  setShow.value = !setShow.value
}
</script>
<style lang="scss" scoped>
.bottom {
  z-index: 200;
  position: absolute;
  bottom: 0px;
  height: 60px;
  width: 100%;
  background: #161515;
  color: white;

  .flex {
    display: flex;
    justify-content: center;

    .btn {
      font-size: 30px;
      line-height: 60px;
      padding: 0 30px;
    }
  }
}
</style>

<template>
  <div class="setting">
    <div class="iconfont back" @click="back($event)">&#xe624;</div>
    <div class="fontsize flex">
      <div>字体大小</div>
      <button @click="handleFontSize($event, false)">A-</button>
      <div>{{ store.state.fontSize }}</div>
      <button @click="handleFontSize($event, true)">A+</button>
    </div>
    <div class="bg">
      <div class="flex">
        <div v-for="(t, index) in themes" :key="index">
          <button :style="{
            background: t.theme['--c-background'],
            border: currentMode === t.mode ? 'red solid 2px' : 'white solid 2px'
          }" class="item" @click="change($event, t.mode)"></button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { changeTheme, getCurrentTheme, getThemes } from '@/lib/theme'
import { onBeforeMount, ref } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const handleFontSize = (e: MouseEvent, isAdd: boolean) => {
  e.stopPropagation()
  const result = isAdd ? store.state.fontSize + 1 : store.state.fontSize - 1
  store.commit('setFontSize', result)
}

// 返回
interface Emits {
  (event: 'hide'): void
}
const emit = defineEmits<Emits>()
const back = (e: MouseEvent) => {
  e.stopPropagation()
  emit('hide')
}

// 切换背景
const themes = ref<{
  mode: string
  theme: Record<string, string>
}[] | null>(null)
const currentMode = ref<string>('default')
onBeforeMount(async () => {
  themes.value = await getThemes()
  currentMode.value = (await getCurrentTheme()).mode
})
const change = (e: MouseEvent, mode: string) => {
  e.stopPropagation()
  currentMode.value = mode
  changeTheme(mode)
}
</script>
<style lang="scss" scoped>
.setting {
  position: absolute;
  width: 100%;
  bottom: 0;
  background: #161515;

  .flex {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .back {
    font-size: 20px;
    float: left;
    line-height: 25px;
  }

  .fontsize {
    font-size: 20px;

    button {
      margin: 0 10px;
      width: 30px;
    }

    div {
      margin: 0 10px;
    }
  }

  .bg {
    .item {
      width: 50px;
      height: 30px;
      border-radius: 5px;
      margin: 0 8px;
    }
  }
}
</style>

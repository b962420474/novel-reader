<template>
  <div class="bottom">
    <div class="flex">
      <div class="iconfont btn" @click="handleToggle($event)">&#xe890;</div>
      <div class="iconfont btn">&#xe8b7;</div>
      <div class="iconfont btn">&#xe712;</div>
    </div>
  </div>
</template>
<script setup lang="ts">
interface Emits {
  (event: 'menuToggle'): void
}
const emit = defineEmits<Emits>()
const handleToggle = (e: MouseEvent) => {
  e.stopPropagation()
  emit('menuToggle')
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

<template>
  <div class="header">
    <div class="iconfont back" @click="back($event)">&#xe624;</div>
    <h3>{{ title }}</h3>
  </div>
</template>
<script lang="ts" setup>
import { useRouter } from 'vue-router'

defineProps<{
  title: string
}>()
const router = useRouter()
const back = (e: MouseEvent) => {
  e.stopPropagation()
  router.back()
}
</script>
<style lang="scss" scoped>
.header {
  z-index: 210;
  position: absolute;
  top: 0px;
  width: 100%;
  height: 40px;
  font-size: 20px;
  line-height: 40px;
  background: #161515;
  color: white;

  .back {
    float: left;
    font-size: 20px;
    line-height: 40px;
  }
}
</style>

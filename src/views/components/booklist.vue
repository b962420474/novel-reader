<template>
  <div class="booklist">
    <div class="item" v-for="item in bookmenus" :key="item.url" @mousedown="handleClick($event, item)">
      <div class="bg">
        <img :src="item.imgurl" />
      </div>
      <span>{{ item.name }}</span>
    </div>
    <div class="item" @click="addBook()">
      <div class="logo">
        <img src="~@/assets/imgs/jia.png" />
      </div>
      <span>&nbsp;</span>
    </div>
  </div>
</template>
<script setup lang="ts">
import { bookMenu } from '@/types/book'
defineProps<{
  bookmenus: bookMenu[]
}>()
interface Emits {
  (event: 'handleClick', value: bookMenu): void
  (event: 'doubleClick', value: bookMenu): void
  (event: 'addBook', value: null): void
}
const emit = defineEmits<Emits>()
const handleClick = (e: MouseEvent, item: bookMenu) => {
  const t = Date.now()
  if (e.target) {
    const callback = () => {
      if (e.target) {
        e.target.removeEventListener('mouseup', callback)
      }
      if (Date.now() - t > 1000) {
        emit('doubleClick', item)
      } else {
        emit('handleClick', item)
      }
    }
    e.target.addEventListener('mouseup', callback)
  }
}
const addBook = () => {
  emit('addBook', null)
}
</script>
<style scoped lang="scss">
.booklist {
  text-align: left;
  padding: 10px;

  .item {
    margin: 10px;
    display: inline-block;

    .bg {
      width: 90px;
      height: 120px;
      background: #249dcb;
      border-radius: 5px;
      background-image: url('~@/assets/imgs/local.jpg');
      background-size: cover;
    }

    .logo {
      width: 90px;
      height: 130px;
      border-radius: 5px;
      background: gray;
      position: relative;

      img {
        transform: translate(-50%, -50%);
        position: absolute;
        top: 50%;
        left: 50%;
      }
    }
  }
}
</style>

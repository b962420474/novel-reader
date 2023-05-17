<template>
  <h3>我的书架</h3>
  <div class="list">
    <book-list :bookmenus="bookmenus" @doubleClick="remove" @handle-click="open" @add-book="addBook"></book-list>
  </div>
</template>
<script setup lang="ts">
import { getBookList, importBooks, removeBook, topBooks } from '@/chrome'
import { bookMenu } from '@/types/book'
import { onBeforeMount, ref } from 'vue'
import { useRouter } from 'vue-router'
import bookList from '../components/booklist.vue'
const bookmenus = ref<bookMenu[]>([])
const router = useRouter()
const open = (item: bookMenu) => {
  topBooks(item)
  router.push({
    name: 'read',
    query: {
      url: item.url
    }
  })
}
const remove = (item: bookMenu) => {
  bookmenus.value = removeBook(item)
}
const addBook = async () => {
  const d = (await importBooks()) as bookMenu
  if (d) {
    bookmenus.value.push(d)
  }
}
onBeforeMount(() => {
  bookmenus.value = getBookList()
})
</script>
<style lang="scss">
.list {
  overflow-y: scroll;
  height: 470px;
}

.list::-webkit-scrollbar {
  display: none;
}
</style>

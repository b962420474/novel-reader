import { content, menu } from '@/types/book'
import { onBeforeMount, ref } from 'vue'
import { loadBook } from './util'
const cacheData:Record<string, {menus: menu[], datas: content, title: string}> = {}
const getDatas = async (url:string) => {
  if (cacheData[url]) {
    return cacheData[url]
  }
  const content = await loadBook(url)
  cacheData[url] = content
  return content
}
const load = (url:string) => {
  const title = ref('')
  const menus = ref<menu[]>([])
  const contents = ref<content>({})
  onBeforeMount(async () => {
    console.log('加载数据')
    const datas = await getDatas(url)
    title.value = datas.title
    menus.value = datas.menus
    contents.value = Object.freeze(datas.datas)
    console.log('load over...')
  })
  return {
    title,
    menus,
    contents
  }
}

export { load }

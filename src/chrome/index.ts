import { BookMark, bookMenu } from '@/types/book'
import { importBook } from './util'
const getBookList = ():bookMenu[] => {
  const books = localStorage.getItem('books')
  if (books) {
    return JSON.parse(books) as bookMenu[]
  }
  return []
}
const saveBookList = (d:bookMenu) => {
  const books = localStorage.getItem('books')
  let bookList:bookMenu[] = []
  if (books) {
    bookList = JSON.parse(books) as bookMenu[]
  }
  const index = bookList.findIndex(item => item.url === d.url)
  if (index === -1) {
    bookList.push(d)
    localStorage.setItem('books', JSON.stringify(bookList))
    return d
  }
  return null
}
const importBooks = async ():Promise<bookMenu | null> => {
  const d = (await importBook()) as bookMenu
  if (d) {
    return saveBookList(d)
  }
  return null
}
const topBooks = (d:bookMenu) => {
  const { books, m } = removeBookItem(d)
  books.unshift(...m)
  localStorage.setItem('books', JSON.stringify(books))
}
const removeBookItem = (d:bookMenu) => {
  const books = getBookList()
  const i = books.findIndex(item => item.url === d.url)
  const m = books.splice(i, 1)
  return {
    books,
    m
  }
}
const removeBook = (d:bookMenu):bookMenu[] => {
  const { books } = removeBookItem(d)
  localStorage.setItem('books', JSON.stringify(books))
  removeBookmark(d.url)
  return books
}
const loadBookmark = (url:string):BookMark | null => {
  const bookmarks = localStorage.getItem('bookmark')
  if (bookmarks) {
    const data = JSON.parse(bookmarks) as Record<string, BookMark>
    return data[url]
  }
  return null
}
const saveBookmark = (url:string, params:BookMark):void => {
  const bookmarks = localStorage.getItem('bookmark')
  let data:Record<string, BookMark> = {}
  if (bookmarks) {
    data = JSON.parse(bookmarks) as Record<string, BookMark>
    data[url] = params
  }
  localStorage.setItem('bookmark', JSON.stringify(data))
}
const removeBookmark = (url:string) => {
  const bookmarks = localStorage.getItem('bookmark')
  let data:Record<string, BookMark> = {}
  if (bookmarks) {
    data = JSON.parse(bookmarks) as Record<string, BookMark>
    delete data[url]
  }
  localStorage.setItem('bookmark', JSON.stringify(data))
}
export { getBookList, importBooks, loadBookmark, saveBookmark, topBooks, removeBook }

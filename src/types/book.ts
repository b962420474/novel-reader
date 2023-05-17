interface bookMenu{
  name: string
  url: string
  imgurl: string
}
interface menu{
  id:number
  name:string
}
interface BookMark{
  id:number,
  cacheId:number
}
type content = Record<string, string>
export { bookMenu, menu, content, BookMark }

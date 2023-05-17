import { ipcRenderer } from 'electron'
import path from 'path'
import fs from 'fs'
import { content, menu } from '@/types/book'
const send = (event:string, params:any = null) => {
  return new Promise<any>((resolve) => {
    ipcRenderer.send(event, params)
    ipcRenderer.on(event, (event, params) => {
      console.log('receive', params)
      resolve(params)
    })
  })
}

const importBook = async () => {
  const dir = await send('opentext')
  console.log('receive', dir)
  if (dir) {
    const name = path.basename(dir as string, '.txt')
    return {
      name,
      url: dir,
      imgurl: ''
    }
  }
  return null
}

const isTitle = (line:string) => {
  const reg = /^第(.*?)章/
  if (reg.test(line)) {
    return true
  }
  if (line.length > 1 && line[0] === ' ' && line[1] !== ' ') {
    return true
  }
  return false
}
const loadBook = (dir:string) => {
  console.log('dir:', dir)
  if (!dir) {
    return {
      menus: [],
      title: '',
      datas: {}
    }
  }
  const name = path.basename(dir as string, '.txt')
  const menus:menu[] = []
  const datas:content = {}
  let contents:string[] = []
  let i = 0
  const buffer: number[] = []
  return new Promise<{menus:menu[], datas:content, title:string}>((resolve, reject) => {
    const readStream = fs.createReadStream(dir)
    let char
    readStream.on('readable', () => {
      while ((char = readStream.read(1)) !== null) {
        if (char[0] === 0x0a) {
          writeFileWithLine(Buffer.from(buffer).toString(), false)
          buffer.length = 0
        } else {
          buffer.push(char[0])
        }
      }
    })
    readStream.on('end', () => {
      writeFileWithLine(Buffer.from(buffer).toString(), true)
    })
    readStream.on('error', (err) => {
      reject(err)
    })
    const writeFileWithLine = (line:string, isover:boolean) => {
      if (menus.length < 1) {
        i++
        menus.push({
          id: i,
          name: line
        })
      } else if (isTitle(line)) {
        if (contents.length > 0) {
          datas[i] = contents.join('\n')
        }
        i++
        menus.push({
          id: i,
          name: line
        })
        contents = []
      } else {
        contents.push(line)
      }
      if (isover) {
        if (contents.length > 0) {
          datas[i] = contents.join('\n')
        }
        resolve({ datas, menus, title: name })
      }
    }
  })
}
export { send, importBook, loadBook }

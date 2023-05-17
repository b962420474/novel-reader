import { ipcRenderer } from 'electron'
import path from 'path'
import fs from 'fs'
import iconv from 'iconv-lite'
import { detect } from 'jschardet'
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
  return new Promise<{menus:menu[], datas:content, title:string}>((resolve, reject) => {
    const t = Date.now()
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
        console.log((Date.now() - t) / 1000, 's')
        resolve({ datas, menus, title: name })
      }
    }
    readLine(dir, writeFileWithLine, (err) => {
      reject(err)
    })
  })
}

const readLine = (dir:string, fn:(content:string, isOver:boolean)=>void, error:(err:Error)=>void):void => {
  // const readStream = fs.createReadStream(dir)
  // let char
  // const t = Date.now()
  // let last = ''
  // readStream.on('readable', () => {
  //   while ((char = readStream.read(1024)) !== null) {
  //     const m = Buffer.from(char).toString().split('\n')
  //     if (m.length === 1) {
  //       last = last + m[0]
  //     } else {
  //       m[0] = last + m[0]
  //       last = m.splice(m.length - 1, 1).join('')
  //     }
  //     m.forEach(item => fn(item, false))
  //   }
  // })
  // readStream.on('end', () => {
  //   fn(last, true)
  //   console.log((Date.now() - t) / 1000, 's')
  // })
  // readStream.on('error', (err) => {
  //   error(err)
  // })
  fs.readFile(dir, (err, data) => {
    if (err) {
      error(err)
    } else {
      const encoding = getEncoding(data)
      console.log('charset:', encoding)
      const str = iconv.decode(data, encoding)
      const lines = str.split(/\r?\n/)
      lines.forEach((line, index) => {
        fn(line, index === lines.length - 1)
      })
    }
  })
}
const getEncoding = (buff:Buffer) => {
  return detect(buff.slice(0, 128)).encoding
}
export { send, importBook, loadBook }

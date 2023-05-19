const rate = 4
const getPages = (text: string, offsetWidth: number, offsetHeight: number, fontSize: number, lineHeight: number, title: string): string[] | null => {
  if (!text) return null
  const fontPerLineNum = Math.floor(offsetWidth / fontSize) // 每行字数
  const colPerPageNum = Math.floor(offsetHeight / lineHeight) // 每页行数
  const textArray = [] // 分页结果数组
  const ds = text.split('\n')
  let result: string[] = []
  const nds: string[] = []
  const t = '<h4>' + title + '</h4>'
  nds.push(t)
  for (let i = 0; i < ds.length; i++) {
    // 段落添加空行
    if (nds[nds.length - 1].replaceAll(' ', '').length > 0 && ds[i].replaceAll(' ', '').length > 0) {
      nds.push('    ')
    }
    // 段首对齐
    ds[i] = '    ' + ds[i].replaceAll(' ', '').replaceAll('<p></p>', '')
    if (getStrWidth(ds[i], fontSize) <= offsetWidth) {
      nds.push(ds[i])
    } else {
      let m = ds[i]
      while (m.length) {
        let index = getSliceIndex(m, fontPerLineNum)
        let str = m.slice(0, index)
        if (getStrWidth(str, fontSize) > offsetWidth) {
          index--
        } else if (getStrWidth(str, fontSize) + fontSize <= offsetWidth) {
          index++
        }
        str = m.slice(0, index)
        nds.push(str)
        m = m.slice(index)
      }
    }
  }
  for (let i = 0; i < nds.length; i++) {
    result.push(nds[i])
    if (result.length >= colPerPageNum || (result.findIndex(item => item === t) !== -1 && result.length >= colPerPageNum - 1)) {
      const str = result.join('<br>').replaceAll(' ', '&nbsp;')
      textArray.push(str)
      result = []
    }
  }
  if (result.length > 0) {
    const str = result.join('<br>').replaceAll(' ', '&nbsp;')
    textArray.push(str)
  }
  return textArray
}

const isChinese = (temp: string) => {
  if (escape(temp).indexOf('%u') < 0) {
    return false
  } else {
    return true
  }
}
const isSpace = (temp: string) => {
  return temp === ' '
}
const getSliceIndex = (str: string, num: number) => {
  let len = 0
  for (let i = 0; i < str.length; i++) {
    len += getlength(str[i])
    if (num * rate === len) {
      return i + 1
    } else if (i + 1 < str.length && getlength(str[i + 1]) + len > num * rate) {
      return i + 1
    }
  }
  return num
}
const getlength = (str: string) => {
  let len = 0
  for (let i = 0; i < str.length; i++) {
    if (isSpace(str[i])) {
      len += 1
    } else if (!isChinese(str[i])) {
      len += 2
    } else {
      len += rate
    }
  }
  return len
}
const canvas = document.createElement('canvas')
const context = canvas.getContext('2d')
const getStrWidth = (text: string, fontSize: number, fontFace = 'arial') => {
  const font = `${fontSize}px ${fontFace}`
  if (context) {
    context.font = font
    const {
      width
    } = context.measureText(text)
    return width
  }
  return 0
}
export default getPages

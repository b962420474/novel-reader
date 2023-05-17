import EventTarget from '@/lib/EventTarget'
import Speech from 'speak-tts'
import { onBeforeUnmount, onMounted } from 'vue'
const bus = new EventTarget()

const play = (): void => {
  bus.emit('onPlay')
}
const pause = (): void => {
  bus.emit('onPause')
}
let isRemuse = false
const speech = new Speech()
speech.setLanguage('zh-CN')
speech.init()
const initTTS = (getText: () => string, next: () => Promise<void>): void => {
  const player = () => {
    console.log('play.......')
    if (isRemuse) {
      speech.resume()
    } else {
      const text = getText()
      console.log(text)
      speech.speak({
        text: text,
        listeners: {
          // 开始播放
          onstart: () => {
            console.log('Start utterance')
            isRemuse = false
          },
          // 判断播放是否完毕
          onend: async () => {
            console.log('End utterance')
            await next()
            play()
          },
          // 恢复播放
          onresume: () => {
            console.log('Resume utterance')
            isRemuse = false
          },
          onpause: () => {
            console.log('pause utterance')
            isRemuse = true
          }
        }
      }).then(() => {
        console.log('读取成功')
      })
    }
  }
  const pauser = () => {
    speech.pause()
  }
  onMounted(() => {
    bus.on('onPlay', player)
    bus.on('onPause', pauser)
  })
  onBeforeUnmount(() => {
    console.log('remove.....')
    speech.cancel()
    bus.remove('onPlay', player)
    bus.remove('onPause', pauser)
  })
}
export { pause, play, initTTS }

/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
declare module jquery {
}	
declare module '@/lib/turn.js' {
  export default ($)=>{}
}	
declare module 'speak-tts';
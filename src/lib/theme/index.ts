import path from 'path'
import cssVars from "css-vars-ponyfill"
import _default from './theme/default.js'
export const getThemes = async () => {
  const modules = require.context('./theme/', true, /\.js$/)
  const files: string[] = []
  for (const key of modules.keys()) {
    files.push(path.basename(key, '.js'))
  }
  const result: { mode: string, theme: Record<string, string> }[] = []
  for (let i = 0; i < files.length; i++) {
    const theme = (await getTheme(files[i])).default
    result.push({
      mode: files[i],
      theme: theme
    })
  }
  return result

}
const getTheme = (name: string) => {
  return import('./theme/' + name + '.js')
}


const key = "data-theme";

// 获取当前主题
export const getCurrentTheme = () => {
  const localTheme = localStorage.getItem(key);
  const dataTheme = localTheme
    ? JSON.parse(localTheme)
    : {
      mode: 'default',
      theme: _default
    }
  return dataTheme
}
// 初始化主题
export const initTheme = () => {
  const dataTheme = getCurrentTheme();
  document.documentElement.setAttribute("data-theme", dataTheme.mode);
  cssVars({
    watch: true,
    // 当添加，删除或修改其<link>或<style>元素的禁用或href属性时，ponyfill将自行调用
    variables: dataTheme.theme, // variables 自定义属性名/值对的集合
    onlyLegacy: false, // false  默认将css变量编译为浏览器识别的css样式  true 当浏览器不支持css变量的时候将css变量编译为识别的css
  });
};

// 变更主题
export const changeTheme = async (mode = 'default') => {
  const theme = (await getTheme(mode)).default
  const dataTheme = {
    theme,
    mode: mode,
  };
  localStorage.setItem(key, JSON.stringify(dataTheme));
  document.documentElement.setAttribute("data-theme", dataTheme.mode);
  cssVars({
    watch: true,
    variables: theme,
    onlyLegacy: false,
  })
}
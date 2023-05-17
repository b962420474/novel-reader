/* eslint-disable no-template-curly-in-string */
const webpack = require('webpack')
module.exports = {
  runtimeCompiler: true,
  publicPath: './',
  chainWebpack: config => {
    config.plugin('provide')
      .use(webpack.ProvidePlugin, [
        {
          $: "jquery",
          jQuery: "jquery",
          jquery: "jquery",
          "window.jQuery": "jquery"
        }
      ])
  },
  // electron 13 把"build":{}从package.json移除，在vue.config.js里写
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      builderOptions: {
        productName: 'reader', // 打包名称
        appId: 'cn.reader.app',
        copyright: 'Copyright © 2023',
        publish: [
          {
            provider: 'generic',
            url: ''
          }
        ],
        nsis: {
          allowToChangeInstallationDirectory: true,
          createDesktopShortcut: true,
          createStartMenuShortcut: true,
          shortcutName: 'reader',
          perMachine: true,
          oneClick: false
        },
        dmg: {
          contents: [
            {
              x: 410,
              y: 150,
              type: 'link',
              path: '/Applications'
            },
            {
              x: 130,
              y: 150,
              type: 'file'
            }
          ]
        },
        // productName 包名称 version 包版本(package.json)  ext后缀
        mac: {
          icon: 'public/icons/icon.icns',
          artifactName: '${productName}_setup_${version}.${ext}'
        },
        win: {
          icon: 'public/icons/icon.ico',
          artifactName: '${productName}_setup_${version}.${ext}'
        },
        linux: {
          icon: 'public/icons',
          artifactName: '${productName}_setup_${version}.${ext}'
        }
      }
    }
  }
}

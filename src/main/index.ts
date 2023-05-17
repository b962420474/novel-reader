import { app, dialog, ipcMain } from 'electron'

const register = () => {
  ipcMain.on('opentext', (event) => {
    console.log('optentext')
    dialog.showOpenDialog({
      defaultPath: app.getPath('userData'),
      properties: ['openFile'],
      filters: [
        { name: '文件', extensions: ['txt'] }
      ]
    })
      .then((data) => {
        if (!data.canceled) {
          event.sender.send('opentext', data.filePaths[0])
        } else {
          event.sender.send('opentext', null)
        }
      })
  })
}
export default register

const { app, BrowserWindow } = require('electron')
const path = require('node:path')

require('electron-reload')(__dirname, {
    electron: require(`${__dirname}/node_modules/electron`)
})

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 450,
        resizable: false,
        maximizable: false,
        minimizable: true,
        fullscreenable: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: true
        }
    })

    // win.webContents.openDevTools();
    win.loadFile('./views/index.html')
}

app.whenReady().then(() => {
    createWindow()
})
const { app, BrowserWindow } = require('electron')
require('electron-reload')(__dirname, {
    electron: require(`${__dirname}/node_modules/electron`)
})

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 450
    })

    win.loadFile('./views/index.html')
}

app.whenReady().then(() => {
    createWindow()
})
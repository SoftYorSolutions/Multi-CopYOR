const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const dialog = electron.dialog

global['appInfo'] =  {
    "name"  : app.getName(),
    "version" : app.getVersion(),
    "baseUrl" : "http://www.softyor.com",
    "emailId" : "knock@softyor.com"
};


let mainWindow

function createWindow () {
    const {width, height} = electron.screen.getPrimaryDisplay().workAreaSize;
    var w = 400;
    var h = 420;
    var x = width-w;
    var y = height-h;
    
    mainWindow = new BrowserWindow({
        width: w, 
        height: h,
        x: x,
        y: y,
        resizable : false,
        maximizable : false,
        alwaysOnTop : true,
        icon : __dirname + "/asset/img/app/logo.ico"

    })

  mainWindow.loadURL(`file://${__dirname}/index.html`)
  

 // mainWindow.webContents.openDevTools()

  mainWindow.on('closed', function () {
    mainWindow = null
  })
  
  mainWindow.on('close', function(e){
        var choice = dialog.showMessageBox(
            mainWindow,
            {
                type: 'question',
                buttons: ['Yes', 'No'],
                title: 'Quit?',
                message: 'Are you sure you want to quit?'
            });
        if(choice != 0){
            e.preventDefault();
        }
    });
       
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
    
  }
})

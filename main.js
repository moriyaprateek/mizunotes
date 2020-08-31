const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
//const {app, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')
const Menu = electron.Menu;
const ipcMain = electron.ipcMain;


let win;
let addWin;

function createWindow() {

  win = new BrowserWindow({ width: 1280, height: 720,
  
    webPreferences: {
      nodeIntegration: true
      // had to add this because of the following error: Uncaught ReferenceError: require is not defined
      //https://stackoverflow.com/questions/57505082/would-it-be-safe-to-enable-nodeintegration-in-electron-on-a-local-page-that-is-p
      // check this ^ 
  }
  
  })

  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));

  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);

  Menu.setApplicationMenu(mainMenu);
  win.on('closed', () => {
    win = null
  });


//If the main/parent window is closed, all the other child windows are closed
  win.on('closed', function(){
    app.quit();
  })





}
// Creating another window to add notes
function addWindow() {

 
  addWin = new BrowserWindow({ width: 600, 
    height: 800,
  title:"Add notes",
  webPreferences: {
    nodeIntegration: true
    // had to add this because of the following error: Uncaught ReferenceError: require is not defined
} });

  addWin.loadURL(url.format({
    pathname: path.join(__dirname, 'addItemWindow.html'),
    protocol: 'file:',
    slashes: true
  }));


  //Garbage Collection

  addWin.on('close', function(){
    addWin = null;
  })





  win.on('closed', () => {
    win = null
  });
}
//sending content from addItemWindow.html to main.js and then to index.html
ipcMain.on('item:add', function(e, item){
  win.webContents.send('item:add', item);
  addWin.close(); 
  // Still have a reference to addWindow in memory. (Grabage collection) -- > Added garbage collection L71
  //addWindow = null;
});

app.on('ready', createWindow);
//need to refactor the code below

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});


//Menu template

const mainMenuTemplate = [
  {
    label:'File',
    submenu:[
    {
      label: 'Add Note',
      accelerator: 'Ctrl+N',
      click() {
        addWindow();
      }
    },
    {
      label: 'Clear All Notes',
      click(){
        win.webContents.send('item:clear');
      }
    },
    {
      label: 'Quit',
      click(){
        app.quit();
      }
    }]
  }
];


//dev tools addition
if(process.env.NODE_ENV !== 'production'){
  mainMenuTemplate.push({
    label: 'Developer Tools',
    submenu:[
      {
        role: 'reload'
      },
      {
        label: 'Toggle DevTools',
        accelerator:process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
        click(item, focusedWindow){
          focusedWindow.toggleDevTools();
        }
      }
    ]
  });



  
}
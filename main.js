const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
//const {app, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')
const Menu = electron.Menu;


let win;

function createWindow () {

  win = new BrowserWindow({width: 800, height: 600})

  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));

 //Setting the main menu 
  //Build main menu

  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  
  // Insert the menu

  Menu.setApplicationMenu(mainMenu);


 
  

  win.on('closed', () => {
    win = null
  });
}

app.on('ready', createWindow);



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
      label: 'Add Note'
    },
    {
      label: 'Clear All Notes' 
    },
    {
      label: 'Quit',
      click(){
        app.quit();
      }
    }]
  }
];
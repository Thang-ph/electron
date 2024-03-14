
const path=require('path')
const {app,BrowserWindow,Menu,ipcMain,shell} = require('electron');
const isMac=process.platform==='darwin';
// process.env.NODE_ENV= 'production';
const {mainMenu,popupMenu} = require('./menumaker');
const isDev=process.env.NODE_ENV !== 'production';
const os=require('os');
const fs=require('fs');
const resizeImg=require('resize-img');
let mainWindow;
// create main menu
function createMainWindow(){
    mainWindow=new BrowserWindow({
        title: 'Main Window',
        width: isDev?1000:500,
        height: 600,
        webPreferences:{
            contextIsolation: true,
            nodeIntegration: true,
            preload: path.join(__dirname,'preload.js')
        }
});

//open devtools if in dev env 
if(isDev){
    mainWindow.webContents.openDevTools();
}
mainWindow.loadFile(path.join(__dirname,"./renderer/index.html"));

}
// Create about window
function createAboutWindow(){
    const aboutWindow=new BrowserWindow({
        title: 'About Window',
        width: 300,
        height: 300
});


aboutWindow.loadFile(path.join(__dirname,"./renderer/about.html"));
    
}
// App is ready
app.on('ready', ()=>{
    createMainWindow();
   //const mainMenu=Menu.buildFromTemplate(menu);
   // Menu.setApplicationMenu(mainMenu);
   Menu.setApplicationMenu(mainMenu);
   mainWindow.webContents.on('context-menu',()=>{
    popupMenu.popup(mainWindow.webContents)
   })
    mainWindow.on('closed',()=>(mainWindow=null))
});
// implement menu
// Menu template 
const menu=[
    ...(isMac?[{
        label: app.name,
        submenu: [{
            label:'About',
            click: createAboutWindow
        }]
    }]:[]),
    {
    role:'fileMenu',
},
...(!isMac?[{
    label: "Help",
    submenu: [{
        label:'About',
        click: createAboutWindow
    }]
}]:[])
];
// Respond to ipcRenderer resize
ipcMain.on('image:resize',(e,options)=>{
    options.dest=path.join(os.homedir(),'imageresizer');
    resizeImage(options)
})
async function resizeImage({imgPath,width,height,dest}) {
    try{
        const newPath=await resizeImg(fs.readFileSync(imgPath),{
            width: +width,
            height: + height
        })
        const filename=path.basename(imgPath);
        //create destination folder if not exist 
        if(!fs.existsSync(dest)){
            fs.mkdirSync(dest);
        }
        //write file to destination
        fs.writeFileSync(path.join(dest,filename),newPath);
        // send success to renderer
        mainWindow.webContents.send('image:done');
        //open the destination folder
        shell.openPath(dest)
    }catch(e){
        console.log('Error')
    }
}

//remove mainWindow from memory on close

app.on('activate',()=>{
    if(BrowserWindow.getAllWindows().length===0){
        createMainWindow();
    }
})
app.on('window-all-closed',()=>{
    if(!isMac){
        app.quit();
    }
})


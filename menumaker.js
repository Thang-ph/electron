const{app,Menu}=require('electron')
const isMac=process.platform ==='darwin'
const template=[
    //role appMenu
    ...(isMac ? [{
        label:app.name,
        submenu:[
            {role:'about'},
            {type:'separator'},
            {role:'quit'}
        ]
    }]:[]),
    {
        label:"File",
        submenu: [{
            label:"Open File",
            click:()=>{
              console.log("Open File")
            },
            accelerator:"CmdOrCtrl+Q"
        }]
    },
    { // edit menu
        label:"Edit",
        submenu: [
            {role:'undo'},
            {role:'redo'},
            {role:'separator'},
            {role:'cut'},
            {role:'copy'},
            {role:'paste'},
            ...(isMac ? [
                {role:'pasteAndMatchStyle'},
                {role:'delete'},
                {role:'selectAll'},
                {type:'separator'},
                {
                    label:'Speech',
                    submenu: [
                        {role:'startSpeaking'},
                        {role:'stopSpeaking'}
                    ]
                }
            ]:[
                {role:'delete'},
                {type:'separator'},
                {role:'selectAll'}
            ])
        ]
    },// view menu
    {
        label:'View',
        submenu:[
            {role:'reload'},
            {role:'forceReload'}
        ]
    },//window menu
    {
        label:'My Menu',
        submenu:[
            {role:'minimize'},
            {role:'zoom'},
            ...(isMac?[
                {type:'separator'},
                {role:'front'},
                {type:'separator'},
                {role:'window'}
            ]:[
                {role:'close'}
            ])
        ]
    }
]
const contextTemplate=[{
    label:"Options",
    submenu: [{
        label:"Do something",
        click:()=>{console.log("hihi")}
    },{
        label:"some more options"
    }]
}]
module.exports.mainMenu=Menu.buildFromTemplate(template)
module.exports.popupMenu=Menu.buildFromTemplate(contextTemplate)
module.exports=[{
    label: "App",
    submenu: [
        { role: "about"},
        { type: 'separator'},
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideothers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
    ]
},{
    label: "File",
    submenu: [{
        label: "load",
        accelerator: "CmdOrCtrl+F",
        click: (item,focusedWindow)=>{
            console.log("clicked")
        }
    }]
},{
    label: "Options",
    submenu:[{
        label: "test",
        click: (item,window)=>{
            console.log("test")
        }
    }]
}]
const {app, BrowserWindow} = require('electron')

let win;

createWindow=()=>{
	win=new BrowserWindow({
		width:640,
		height: 480
	})
	win.loadFile("index.html")
	win.on('closed',()=>{
		win=null
	})
}

app.on("ready",createWindow)
app.on("wondow-all-closed",()=>{
	app.quit()
})

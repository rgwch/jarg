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
	win.on("resize",()=>{
		resize(win.getBounds())
	})
	win.on("move", ()=>{
		resize(win.getBounds())
	})
}
resize=bounds=>{
	console.log(bounds)
}
app.on("ready",createWindow)
app.on("wondow-all-closed",()=>{
	app.quit()
})

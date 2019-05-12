
/**
 * Thos is the code for the "main" Thread of electron 
 */
const { app, BrowserWindow } = require('electron')
const cfg = new (require('conf'))()

let win;

createWindow = () => {
	const bounds = cfg.get("bounds") || { width: 640, height: 480 }
	win = new BrowserWindow({
		width: bounds.width,
		height: bounds.height,
		x: bounds.x,
		y: bounds.y,
		webPreferences: {
			nodeIntegration: true
		}
	})
	win.loadFile("index.html")
	win.on('closed', () => {
		win = null
	})
	win.on("resize", () => {
		resize(win.getBounds())
	})
	win.on("move", () => {
		resize(win.getBounds())
	})
}
resize = bounds => {
	cfg.set("bounds", bounds)
}
app.on("ready", createWindow)
app.on("wondow-all-closed", () => {
	app.quit()
})

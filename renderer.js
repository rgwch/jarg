/**
 * This is the code for the "renderer" thread of the electron app
 */

const { spawn } = require('child_process')
const { dialog } = require('electron').remote
const fixPath = require('fix-path');
const Conf = require('electron-store')
const cfg = new Conf()
/* Load the configuration data */
let setname = cfg.get("set") || "default"
let set = Object.assign({}, {
	name: setname,
	repoaddress: "~/restic_repo".replace("~", require('os').homedir()),
	repopwd: "topsecret",
	repodirs: __dirname
}, cfg.get(setname))
cfg.set(set.name, set)
cfg.set("set", set.name)
let restic = cfg.get("restic") || "restic"
fixPath()

/**
 * Set the GUI display to nthe values stored in the configuration
 */
const setValues = () => {
	let el = document.getElementById("disp_reponame")
	el.textContent = set.repoaddress
	el = document.getElementById("setname")
	el.textContent = setname
	el = document.getElementById("repourl")
	el.value = set.repoaddress
	el = document.getElementById('repopwd')
	el.value = set.repopwd
	el = document.getElementById("disp_dirs")
	el.textContent = set.repodirs
	el = document.getElementById('repodirs')
	el.value = set.repodirs
	el = document.getElementById("s3key")
	el.value = set.s3key
	el = document.getElementById("s3secret")
	el.value = set.s3secret
	el = document.getElementById('setnames')
	const store = cfg.store
	const sel = el.selectedIndex
	for (k in store) {
		const o = store[k]
		if (typeof (o) === 'object' && o.name) {
			addOption(o.name)
		}
	}
	addOption("new...", "new...")
	for (let i = 0; i < el.options.length; i++) {
		if (el.options[i].text === setname) {
			el.options.selectedIndex = i
		}
	}
	function addOption(n) {
		for (let i = 0; i < el.options.length; i++) {
			if (el.options[i].text === n) {
				return
			}
		}
		const option = document.createElement("option")
		option.value = n
		option.text = n
		el.appendChild(option)

	}
}
/**
 * Get the selected/entered vakues from the GUI and store them in the configuration
 */
const getValues = () => {
	el = document.getElementById("repourl")
	set.repoaddress = el.value
	el = document.getElementById('repopwd')
	set.repopwd = el.value
	el = document.getElementById('repodirs')
	set.repodirs = el.value
	el = document.getElementById("s3key")
	set.s3key = el.value
	el = document.getElementById("s3secret")
	set.s3secret = el.value
	//el = document.getElementById('setnames')
	cfg.set(setname, set)

}

/**
 * Save a new backup set
 */
function save() {
	const inp = document.getElementById("newsetname")
	setname = inp.value
	if (setname) {
		set.name = setname
		cfg.set("set", setname)
		getValues()
		toggle()
		setValues()
		inp.value = ""
		inp.style.display = "none"
	} else {
		alert("Please enter a name for this backupset")
		inp.focus()
	}
}

/**
 * The user changed the backupt set in the <select> dropdown, Either it's the name of
 * an existing backup set or the last entry, which is "new...". If so, we create a new backup set.
 */
function changeset() {
	const sel = document.getElementById("setnames")
	const backupset = sel.selectedOptions[0].value
	if (backupset === "new...") {
		set = {
			name: "",
			repoaddress: "",
			repopwd: "",
			s3key: "",
			s3secret: "",
			repodirs: ""
		}
		setname = ""
		const inp = document.getElementById("newsetname")
		inp.style.display = "inline"
		inp.focus()
	} else {
		set = cfg.get(backupset)
		setname = backupset
		document.getElementById("newsetname").style.display = "none"
		cfg.set("set", setname)
	}
	setValues()
}
/**
 * The user clicked the icon to display either the execute panel or the edit panel
 */
function toggle() {
	const exec = document.getElementById("exec")
	const edit = document.getElementById("edit")
	if (exec.style.display === "none") {
		exec.style.display = "block"
		edit.style.display = "none"
	} else {
		exec.style.display = "none"
		edit.style.display = "block"
	}
}

/**
 * Run a restic-command 
 * @param  {...any} cmd 
 */
function do_spawn(...cmd) {
	const vconsole = document.getElementById('console')
	vconsole.value += `\nCommand: restic -r ${set.repoaddress} ${cmd.join(" ")}\n`
	const env = Object.assign({}, process.env)
	env.RESTIC_PASSWORD = set.repopwd
	const args = ["-r", set.repoaddress, ...cmd]
	const proc = spawn(restic, args, { env })
	proc.on("error", err => {
		if (err.code == "ENOENT") {
			dialog.showMessageBox({
				type: "error",
				title: "Restic not found",
				message: "The restic executable was not found. Please make sure, restic is installed and on the Path."
			})
		}
	})
	proc.stdout.on('data', chunk => {
		vconsole.value += chunk;
	})
	proc.stderr.on('data', err => {
		vconsole.value += "!!!! " + err
		console.log("err: " + err)
	})
	proc.on("close", exitcode => {
		const x = exitcode === 0 ? "no errors." : "Command returned error code: " + exitcode
		vconsole.value += `\n${x}\n----------------\n`

	})
}
function init() {
	do_spawn("init")
}

function list() {
	do_spawn("snapshots")
}
function backup() {
	do_spawn("backup", set.repodirs)
}

function restore() {
	do_spawn("xrestore", "latest", "--target", set.repodirs)
}

setValues()

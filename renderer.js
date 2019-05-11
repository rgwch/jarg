const { spawn } = require('child_process')
const cfg = new (require('conf'))()
const set = Object.assign({}, {
	repoaddress: "~/restic_repo".replace("~", require('os').homedir()),
	repopwd: "topsecret",
	repodirs: __dirname
}, cfg.get("default"))

const setValues = () => {
	let el = document.getElementById("disp_reponame")
	el.textContent = set.repoaddress
	el = document.getElementById("repourl")
	el.value = set.repoaddress
	el = document.getElementById('repopwd')
	el.value = set.repopwd
	el = document.getElementById("disp_dirs")
	el.textContent = set.repodirs
	el = document.getElementById('repodirs')
	el.value = set.repodirs
}

const getValues = () => {
	let el = document.getElementById("disp_reponame")
	set.reponame = el.textContent
	el = document.getElementById("repourl")
	set.repoaddress = el.value
	el = document.getElementById('repopwd')
	set.repopwd = el.value
	el = document.getElementById('repodirs')
	set.repodirs = el.value

}

function toggle(elem) {
	const el = document.getElementById(elem)
	if (el.style.display === "none") {
		el.style.display = "block"
	} else {
		el.style.display = "none"
	}
}

function do_spawn(...cmd) {
	const vconsole=document.getElementById('console')
	vconsole.value+=`\nCommand: ${cmd.join(" ")}\n`
	const env = Object.assign({}, process.env)
	env.RESTIC_PASSWORD = set.repopwd
	const args = ["-r", set.repoaddress, ...cmd]
	const proc = spawn("restic", args, { env })
	proc.stdout.on('data', chunk => {
		vconsole.value+=chunk;
	})
	proc.stderr.on('data', err => {
		console.log("err: " + err)
	})
	proc.on("close", exitcode => {
		vconsole.value+=`\nExitcode: ${exitcode}\n----------------\n`
		
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

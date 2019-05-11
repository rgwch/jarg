const { spawn } = require('child_process')
const cfg = new (require('conf'))()
const setname = cfg.get("setname") || "default"
const set = Object.assign({}, {
	name: setname,
	repoaddress: "~/restic_repo".replace("~", require('os').homedir()),
	repopwd: "topsecret",
	repodirs: __dirname
}, cfg.get(setname))
cfg.set(set.name,set)
cfg.set("set",set.name)

const setValues = () => {
	let el = document.getElementById("disp_reponame")
	el.textContent = set.repoaddress
	el = document.getElementById("setname")
	el.textContent = setname
	el = document.getElementById("ed_setname")
	el.value = setname

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
	el=document.getElementById('setnames')
	const store=cfg.store
	for(k in store){
		const o=store[k]
		if(typeof(o) === 'object' && o.name){
			addOption(o.name,o)
		}
	}
	addOption("new...",{})
	function addOption(n,o){
		const option=document.createElement("option")
		option.value=o
		option.text=n
		el.appendChild(option)
	}
}

const getValues = () => {
	let el = document.getElementById("disp_reponame")
	set.repaddress = el.textContent
	el = document.getElementById("repourl")
	set.repoaddress = el.value
	el = document.getElementById('repopwd')
	set.repopwd = el.value
	el = document.getElementById('repodirs')
	set.repodirs = el.value

}

function toggle(mode) {
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

function do_spawn(...cmd) {
	const vconsole = document.getElementById('console')
	vconsole.value += `\nCommand: restic -r ${set.repoaddress} ${cmd.join(" ")}\n`
	const env = Object.assign({}, process.env)
	env.RESTIC_PASSWORD = set.repopwd
	const args = ["-r", set.repoaddress, ...cmd]
	const proc = spawn("restic", args, { env })
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

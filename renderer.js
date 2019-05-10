const {exec,spawn} = require('child_process')
const path=require('path')
const cfg = new (require('conf'))()

let reponame = cfg.get("reponame") || "local"
let repoaddress = (cfg.get("repoaddr") || "~/restic_repo").replace("~",require('os').homedir())
let repopwd = cfg.get("repopwd") || "topsecret"
let repodirs = cfg.get("repdirs") || __dirname


const setValues = () => {
	let el = document.getElementById("disp_reponame")
	el.textContent = reponame
	el = document.getElementById("repourl")
	el.value = repoaddress
	el = document.getElementById('repopwd')
	el.value = repopwd
	el = document.getElementById("disp_dirs")
	el.textContent = repodirs
	el = document.getElementById('repodirs')
	el.value = repodirs
}

const getValues = () => {
	let el = document.getElementById("disp_reponame")
	reponame = el.textContent = reponame
	el = document.getElementById("repourl")
	el.value = repoaddress
	el = document.getElementById('repopwd')
	el.value = repopwd
	el = document.getElementById("disp_dirs")
	el.textContent = repodirs
	el = document.getElementById('repodirs')
	el.value = repodirs
}
const callback = (err, stdout, stderr) => {
	if (err) {
		console.log(`exec error: ${err}`);
		return;
	} else {
		console.log(`${stdout}`);
	}
}

function toggle(elem) {
	const el = document.getElementById(elem)
	if (el.style.display === "none") {
		el.style.display = "block"
	} else {
		el.style.display = "none"
	}
}

function do_spawn(...cmd){
	const env = Object.assign({}, process.env)
	env.RESTIC_PASSWORD = repopwd
	const args=["-r",repoaddress,...cmd]
	console.log(args)
	const proc=spawn("restic",args,{env} )
	proc.stdout.on('data',chunk=>{
		console.log("stdout: "+chunk)
	})
	proc.stderr.on('data',err=>{
		console.log("err: "+err)
	})
	proc.on("close",exitcode=>{
		console.log("exit: "+exitcode)
	})
}
function init(repo, pwd) {
	const r = repo || repoaddress
	const p = pwd || repopwd
	const env = Object.assign({}, process.env)
	env.RESTIC_PASSWORD = p
	exec(`restic -r ${r} init`, { env }, callback);
}

function list(){
	do_spawn("snapshots")
}
function backup() {
	do_spawn("backup",repodirs)
}

function restore() {
	const env = Object.assign({}, process.env)
	env.RESTIC_PASSWORD = pwdlementById("searchTxt").value;
	exec(`restic -r ${repo} restore latest --target ${dirs}`, { env }, callback);
}

setValues()

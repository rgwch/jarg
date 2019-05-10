const exec = require('child_process').exec
const cfg = new (require('conf'))()

const reponame=cfg.get("reponame") || "local"
const repoaddress=cfg.get("repoaddr") || "~/restic_repo"
const repopwd=cfg.get("repopwd") || "topsecret"
const repodirs=cfg.get("repdirs") || __dirname


const setValues=()=>{
	let el=document.getElementById("disp_reponame")
	el.textContent=reponame
	el=document.getElementById("reponame")
	el.value=reponame
	console.log(el+", "+reponame)
}
const callback = (err, stdout, stderr) => {
	if (err) {
		console.log(`exec error: ${err}`);
		return;
	} else {
		console.log(`${stdout}`);
	}
}

function toggle(elem){
	const el=document.getElementById(elem)
	if(el.style.display==="none"){
		el.style.display="block"
	}else{
		el.style.display="none"
	}
}

function init(repo, pwd) {
	const env = Object.assign({}, process.env)
	env.RESTIC_PASSWORD = pwd
	exec(`restic init -r ${repo}`, { env }, callback);
}

function backup(repo, pwd, dirs) {
	const env = Object.assign({}, process.env)
	env.RESTIC_PASSWORD = pwd
	exec(`restic -r ${repo} backup ${dirs}`, { env }, callback);
}

function restore() {
	const env = Object.assign({}, process.env)
	env.RESTIC_PASSWORD = pwdlementById("searchTxt").value;
	exec(`restic -r ${repo} restore latest --target ${dirs}`, { env }, callback);
}

setValues()

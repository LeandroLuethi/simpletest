const fs = require('fs').promises
const {existsSync} = require('fs')
const path = require('path')

async function createDirIfNotExists(dirname) {
	return fs.mkdir(dirname, {recursive: true}).catch(e => {
		if(e.code !== 'EEXIST') {throw e}
	})
}

function doesItemExist(filepath){
	filepath = path.join("data", filepath)
	return existsSync(filepath)
}

async function createFolder(folderpath) {
	folderpath = path.join("data", folderpath)
	return await createDirIfNotExists(folderpath)
}

async function save(filepath, jsondata) {
	filepath = path.join("data", filepath)
	if(!path.extname(filepath)) {
		filepath = filepath + ".json"
	}
	const folder = path.dirname(filepath)
	await createDirIfNotExists(folder)
	await fs.writeFile(filepath, JSON.stringify(jsondata))
}

async function load(filepath) {
	filepath = path.join("data", filepath)
	const stat = await fs.stat(filepath)
	if(stat.isDirectory()) {
		return await fs.readdir(filepath)
	}
	const raw = await fs.readFile(filepath, {encoding: "utf8"})
	return JSON.parse(raw)
}

async function loadAllOfDirectory(filepath) {
	filepath = path.join("data", filepath)
	if(!existsSync(filepath)) return []
	const stat = await fs.stat(filepath)
	if(stat.isDirectory()) {
		var files = await fs.readdir(filepath)
		var list = []
		for(var f of files.filter(f=>f.endsWith(".json"))) {
			const raw = await fs.readFile(filepath + "/" + f, {encoding: "utf8"})
			var data = JSON.parse(raw)
			data.id = data.id || f
			list.push(data)
		}
		return list
	}
}

async function findUsers(emails) {
	const userfolders = await fs.readdir("data")
	const users = []
	for(let userfolder of userfolders) {
		const p = userfolder + "/userdata.json"
		if(doesItemExist(p)) {
			data = await load(p)
			if(emails.includes(data.email)) {
				users.push(userfolder)
			}
		}
	}
	return users
}

async function distributeTest(teacher, id, emails) {
	let users = await findUsers(emails)
	console.log(emails, users);
	let test = await load(`${teacher}/create/edit/${id}`)
	for(var q of test.questions) {
		for(var a of q.answers) {
			delete a.correct
		}
	}
	for(let user of users) {
		console.log(user);
		await createFolder(`${user}/complete`)
		await save(`${user}/complete/${id}`, test)
	}
	console.log(users);
}

async function deleteFile(filepath) {
	filepath = path.join("data", filepath)
	await fs.unlink(filepath)
}

createFolder(`adrian1/complete`)

module.exports = {save, load, doesItemExist, createFolder, loadAllOfDirectory, distributeTest, deleteFile}
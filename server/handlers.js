// const {pbkdf2Sync} = require('crypto');
const { parseJsonBody } = require("./parsers");
const { respondWithJson } = require("./responders");
const { load, save, doesItemExist, createFolder, loadAllOfDirectory, distributeTest, deleteFile } = require("./datastore");
const bcrypt = require('bcryptjs');

const salt = "cz6rtbf7uth8iuoiuzg6rdx4rweas4tf3rtefi87ujoiznhg6u5ted53fewrdtguz"

// const key = pbkdf2Sync('secret', 'salt', 100000, 64, 'sha512');
// console.log(key.toString('hex'));  // '3745e48...08d59ae'

async function createToken(user) {
	const token = String(Math.round(Math.random() * 1e15))
	await save(`${user}/token.json`, {token, date: Date.now()})
	return token
}
async function verifyToken(user, token, res) {
	const savedToken = await load(`${user}/token.json`)
	if(token == savedToken.token) {
		return true
	}
	respondWithJson(res, {ok: false, info: "token mismatch"})
	return false
}

async function signUp(req, res) {
	const {user, pw, pw2, email} = await parseJsonBody(req)
	if(!user) {
		return respondWithJson(res, {ok: false, info: "user must not be empty"})
	}
	if(doesItemExist(user)) {
		return respondWithJson(res, {ok: false, info: "user already exists"})
	}
	if(pw !== pw2) {
		return respondWithJson(res, {ok: false, info: "passwords do not match"})
	}

	const hash = await bcrypt.hash(pw + salt, 10)

	//console.log(hash);

	await save(`${user}/userdata.json`, {hash, email, user})
	await createFolder(`${user}/create`)
	await createFolder(`${user}/complete`)
	await createFolder(`${user}/evaluation`)
	await createFolder(`${user}/correct`)
	await createFolder(`${user}/create/edit`)
	await createFolder(`${user}/create/finished`)
	const token = await createToken(user)
	respondWithJson(res, {ok: true, data: {user, email, token}})
}

async function signIn(req, res) {
	const {user, pw} = await parseJsonBody(req)
	if(doesItemExist(`${user}/userdata.json`)) {
		const userdata = await load(`${user}/userdata.json`)
		const {email} = userdata

		const passwordIsCorrect = await bcrypt.compare(pw + salt, userdata.hash)
		if(passwordIsCorrect) {
			const token = await createToken(user)
			respondWithJson(res, {ok: true, data: {user, email, token}})
		} 
		else {
			respondWithJson(res, {ok: false, info: "Password is not correct"})
		}
	}
	else {
		respondWithJson(res, {ok: false, info: "User does not exist"})
	}

}

async function saveData(req, res) {
	const {path, data, user, token} = await parseJsonBody(req)
	console.log(data);
	if(!await verifyToken(user, token, res)) return
	await save(path, data)
	respondWithJson(res, {ok: true})
}

async function loadData(req, res) {
	const {path,user,token} = await parseJsonBody(req)
	if(!await verifyToken(user, token, res)) return
	respondWithJson(res, await load(path))
}

async function loadAll(req, res) {
	const {path, user, token} = await parseJsonBody(req)
	if(!await verifyToken(user, token, res)) return
	await new Promise(r=>setTimeout(r, 1000))
	respondWithJson(res, await loadAllOfDirectory(path))
}

async function loadTest(req, res) {
	const {path, user, token} = await parseJsonBody(req)
	if(!await verifyToken(user, token, res)) return
	var test = await load(path)
	for(var q of test.questions) {
		for(var a of q.answers) {
			delete a.correct
		}
	}
	respondWithJson(res, test)
}

async function distribute(req, res) {
	const {teacher, id, users, user, token} = await parseJsonBody(req)
	if(!await verifyToken(user, token, res)) return
	//console.log({teacher, id, users});
	distributeTest(teacher, id, users)
}

async function finishTest(req, res){
	const {teacher, user, testid, data, token} = await parseJsonBody(req)
	if(!await verifyToken(user, token, res)) return
	await save(`${teacher}/create/finished/${user}-${testid}`, data)
	await deleteFile(`${user}/complete/${testid}`)
	respondWithJson(res, {ok: true}) 
}

async function solution(req, res) {
	const {teacher, id, user, token} = await parseJsonBody(req)
	if(!await verifyToken(user, token, res)) return
	console.log({teacher, id});
	const usertests = (await loadAllOfDirectory(`${teacher}/create/finished`))
		.filter(item=>item.id.endsWith(id))
	var {questions, title, subject} = await load(`${teacher}/create/edit/${id}`); //path??
	let users = []
	for(let usertest of usertests) {
		const points = [];
		const pointsmax = [];
		let allpoints=0;
		let allpointsmax=0;
		const user = usertest.id.slice(0, usertest.id.indexOf("-"))
		for(let nr = 0; nr < usertest.length; nr++) {
			let p = 0
			const userselected = usertest[nr].selected;
			const correct = questions[nr].answers.map(a=>a.correct);
			console.log({userselected, correct});
			for(let i=0; i<userselected.length; i++){
				if(userselected[i] == correct[i]){
					p++;
				} else{
					p = p;
				}
			}
			points.push(p / correct.length * questions[nr].points);
			pointsmax.push(questions[nr].points);
			allpoints= allpoints+(p/correct.length * questions[nr].points);
			allpointsmax=allpointsmax+Number(questions[nr].points);
		}
		console.log(usertest);
		console.log(user);
		const percentage = allpoints/allpointsmax*100;
		let grade;
		if(percentage<=25){
			grade= 1;
		}
		else if(percentage>25 && percentage < 50){
			grade=1.5;
		}
		else if(percentage>50 && percentage < 55.56){
			grade=2;
		}
		else if(percentage>55.6 && percentage<61.1 ){
			grade=2.5;
		}
		else if(percentage>61.1 && percentage<66.65 ){
			grade=3;
		}
		else if(percentage>66.65 && percentage<72.2 ){
			grade=3.5;
		}
		else if(percentage>72.2 && percentage<77.75 ){
			grade=4;
		}
		else if(percentage>77.75 && percentage<83.3 ){
			grade=4.5;
		}
		else if(percentage>83.3 && percentage<88.85 ){
			grade=5;
		}
		else if(percentage>88.85 && percentage<94.4 ){
			grade=5.5;
		}
		else if(percentage>94.4 && percentage<=100){
			grade=6;
		}
		console.log(allpoints, allpointsmax, percentage);
		users.push({user, points, percentage, grade})
		await save(`${user}/evaluation/${id}`, {points, percentage, grade, subject, title} );
	}
	await save(`${teacher}/results/${id}`, {users, subject, title} );
	respondWithJson(res, {ok: true, users}) 
}

module.exports = {
	signUp,
	signIn,
	saveData,
	loadData,
	loadTest,
	loadAll,
	distribute,
	finishTest,
	solution
}
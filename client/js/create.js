var userData = checkAuth()
var nexthelp = 0
var timestamp = Date.now()
var path = userData.user + "/create/edit/" + timestamp + ".json"
var data = {}
currentIndex = 0


function testtitle(){
	var all = document.getElementById("all");
	var documentElement = document.getElementById("documentElement");
	if(all.style.display !== "block"){
		var form = document.getElementById("documentname")
		var datatitle = collectFormData(form);
		data.title = datatitle.documenttitle
		data.subject = datatitle.subject
		data.teacher = userData.user 
		data.questions = []
		all.style.display = "block";
		documentElement.style.display = "none";
		return true;
	}
	return false
}

async function savequestion(){
	var form = document.querySelector(".createTask")
	var rawdata = collectFormData(form)
	var questiondata = {
		question: rawdata.question,
		points: rawdata.points,
		answers: []
	}
	for(i = 0; i < 100; i++) {
		if(rawdata["answer"+i] && rawdata["answer"+i] != "") {
			questiondata.answers.push({
				answer: rawdata["answer"+i],
				correct: rawdata["isCorrect"+i]
			})
		}
	} 
	data.questions[currentIndex] = questiondata
	const r = await postDataWithToken("saveData", {path, data})
	form.reset();
	return r
}

function refillForm(question) {
	var title = data.questions[currentIndex].question
	var points = data.questions[currentIndex].points
	document.querySelector("input[name=question]").value=title
	document.querySelector("input[name=points]").value=points
	var answerindex = 1
	for(var a of  data.questions[currentIndex].answers) {
		document.querySelector(`input[name=answer${answerindex}]`).value = a.answer
		document.querySelector(`input[name=isCorrect${answerindex}]`).checked = a.correct
		answerindex += 1
	}
}

async function add(){
	var wasTitle = testtitle()
	if(wasTitle) return
	
	await savequestion()
	currentIndex += 1
	nexthelp += 1
}

async function back(){
	var form = document.querySelector(".createTask")
	var rawdata = collectFormData(form)
	if(currentIndex == 0) {
		return
	}
	else if(currentIndex==nexthelp){
		if(rawdata.question != ""){
			await savequestion()
		}
	}
	else {
		await savequestion()
	}
	form.reset();
	currentIndex -= 1
	refillForm(data.questions[currentIndex]) 
}

async function next(){
	var form = document.querySelector(".createTask")
	if(currentIndex >= nexthelp){
		return
	}
	await savequestion()
	form.reset();
	currentIndex += 1
	refillForm(data.questions[currentIndex])
}

async function save(){
	const r = await savequestion()
	if(r.ok) location.assign("maincreate.html");
} 
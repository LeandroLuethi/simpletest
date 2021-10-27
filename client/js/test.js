var userData = checkAuth()
var currentIndex = 0;
var test
var questionstate = []
var testid = getQueryVariable("id")
var teacher = getQueryVariable("teacher")

async function loadTest() {
   test = await postDataWithToken("loadTest", {path: `${teacher}/create/edit/${testid}`})
   loadQuestionstate(test)
   loadQuestion(test.questions[currentIndex]);
}

function loadQuestionstate(test) {
	var stored = localStorage[`simpletest-questionstate-${testid}`]
	if(stored) {
		questionstate = JSON.parse(stored)
	}
	else {
		for(var q of test.questions) {
			questionstate.push({
				marked: false,
				selected: []
			})
		}
	}
}

loadTest()

var n;
n=0;
function mark(){
	questionstate[currentIndex].marked = !questionstate[currentIndex].marked
	savestate()
	loadQuestion(test.questions[currentIndex])
}

function savestate() {
	var form = document.querySelector("#answers")
	var data = collectFormData(form)
	questionstate[currentIndex].selected = Object.values(data);
	localStorage[`simpletest-questionstate-${testid}`] = JSON.stringify(questionstate);
}

async function finish(){
   if(window.confirm("Willst du den Test wirklich beenden?")){
		var r = await postDataWithToken("finishTest", {teacher, user: userData.user, testid, data: questionstate})
		location.assign("../Startseite2.html");
   }
}

function loadQuestion(question){
    var title = question.question
	var points = question.points+" Pt."
	if(questionstate[currentIndex].marked) {
		document.body.classList.add("marked")
	}
	else {
		document.body.classList.remove("marked")
	}
	document.querySelector("#question").textContent = title
	document.querySelector("#points").textContent = points
	var answerindex = 1
	var answertable = document.querySelector(".answertable")
	answertable.innerHTML = ""
	var answerindex = 0
	for(var a of  question.answers) { 
		var wasChecked = questionstate[currentIndex].selected[answerindex] ? "checked" : ""
		answertable.innerHTML += ` 
			<tr>
				<td><input name="isCorrect${answerindex}" onchange="savestate()" class="answerinput isCorrect${answerindex}" type="checkbox" ${wasChecked}></td> 
				<td class="answer answer${answerindex}">${a.answer}</td>
			</tr>
		`
		answerindex += 1
	}
}

function back(){
	if(currentIndex == 0) {
		return
	}
	currentIndex -= 1
	loadQuestion(test.questions[currentIndex]) 
}

function next(){
	if(currentIndex >= test.questions.length - 1){
		return
	}
	currentIndex += 1
	loadQuestion(test.questions[currentIndex]) 
}
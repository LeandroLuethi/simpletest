const BASEURL = ["127", "localhost"].some(p=>location.href.includes(p)) ? "http://localhost:8080/" : "https://simpletest.3e8.ch/"

function checkAuth() {
	var hasUserData = localStorage.simpletest_userdata
  
	if(hasUserData) {
	  var userData = JSON.parse(hasUserData)
	  var userDisplay = document.querySelector(".userDisplay")
	  if(userDisplay) {
		userDisplay.innerHTML = userData.email
	  }
	}
	else {
	  location.href="/html/login.html"
	}
	return userData
  }

async function postDataWithToken(url, data) {
	const userData = checkAuth()
	const dataWithToken = {...data, user: userData.user, token: userData.token}
	r = await postData(url, dataWithToken)
	if(!r.ok && r.info == "token mismatch") {
		location.assign("login.html")
		return false
	}
	return r
}

async function postData(url, data) {
	const response = await fetch(BASEURL + url, {
	method: 'POST', 
		mode: 'cors', 
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		referrerPolicy: 'no-referrer',
		body: JSON.stringify(data)
	});
	return response.json();
}

function collectFormData(formElement) {
	var data = {}
	formElement.querySelectorAll("input, select").forEach(input=>{
		if(input.type=="checkbox") {
			data[input.name] = input.checked
		}
		else {
			data[input.name] = input.value
		}
	})
	return data
}

function checkFormResponse(response) {
	if(response.ok) {
		Object.assign(window.datastore, response.data)
		localStorage.dailyflowdata = JSON.stringify(window.datastore)
		return true
	}
	else {
		form.innerHTML += `<div>${response.info || "Unbekannter Fehler"}</div>`
		return false
	}
}

function getQueryVariable(variable){
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}

subjLongNames = {
    de: "Deutsch",
    bg: "Bil. Gestalten",
    fr: "Französisch",
    ma: "Mathematik",
    ge: "Geo. & Gesch.",
    en: "Englisch",
    nw: "NaWi",
    mu: "Musik",
    in: "Informatik",
    hw: "Hauswirtschaft"
}

function loadSubject() {
    const urlParams = new URLSearchParams(window.location.search);
    const subjShort = urlParams.get('subject');
    const subject =subjLongNames[subjShort]
    document.title = subject
    document.querySelector("h1").textContent = subject
    return subject
}
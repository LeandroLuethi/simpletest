var userData = checkAuth();

async function displayItems(){
    var itemsElements = document.querySelectorAll(".displayItems");
    for(var itemsElement of itemsElements) {
        var category = itemsElement.dataset.what
        var {user} = userData
        var items = await postDataWithToken("loadAll", {
            path: user+"/create/edit"
        })
        for(var item of items) {
            itemsElement.innerHTML += displayItem(item, category)
        }
    }
}

function displayItem(item, category){
   if(category === "edit"){
       var link = "facher/complete"
       return `<div class='item test'>
       <button onclick='distribute("${userData.user}", "${item.id}")' class="distribute"></button>
        <button onclick='solution("${userData.user}", "${item.id}")' class="solution"></button>
        <b> ${item.title + ' - ' + item.subject} </b>
        </div>`
   }  
}

async function distribute(teacher, id) {
    var form = document.querySelector(".studentsinformation");
    var rawdata = collectFormData(form);
    var users = rawdata.students.split(/[\s,;]+/).map(address=>address.toLowerCase())
    await postDataWithToken("distribute", {teacher, id, users})
    form.reset();
}

async function solution(teacher, id){
    const result = await postDataWithToken("solution", {teacher, id})
}

function grade() {
    location.assign("../html/results.html");
}

function home() {
    location.assign("../html/Startseite2.html");
}

function create(){
 location.assign("../html/create.html");
}

displayItems();


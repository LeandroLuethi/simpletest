var userData = checkAuth()
function home(){
    location.assign("../html/Startseite2.html");
   }

async function back(){
    location.assign("../html/maincreate.html")
}

async function displayItems(){
    
    var itemsElements = document.querySelectorAll(".displayItems");
    for(var itemsElement of itemsElements) {
        var {user} = userData
        var items = await postDataWithToken("loadAll", {
            path: user+"/results"
        })
        console.log(items);
        for(var item of items) {
            itemsElement.innerHTML += displayItem(item)
        }
    }
}

function displayItem(item){
    var link = "facher/complete"
    let table = "<table>"
    for(user of item.users) {
        table += `<tr><td ><b>-${user.user}</b></td><td>${'Note: '+user.grade+' | '+user.percentage.toFixed(1)+'%'}</td></tr>`
    }
    table += "</table>"

    return `<div class='item test'>
    <b class="testtitle" style=" margin-top: 1.5rem;"> ${item.title + ' - ' + item.subject} </b>
        ${table}
    </div>`
}

displayItems()
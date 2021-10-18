async function displayItems(subject){
var itemsElements = document.querySelectorAll(".displayItems");
for(var itemsElement of itemsElements) {
    var {user} = userData
    console.log(user)

    var items = await postDataWithToken("loadAll", {
        path: user+"/evaluation" 
    });
    console.log(items)
    for(var item of items) {
        itemsElement.innerHTML += displayItem(item, subject)
    }
}
}

function displayItem(item, subject){
    if(item.subject == subject) {
        var link = "facher/evaluation"
        console.log(`facher/test.html?id=${item.id}&teacher=${item.teacher}`);
        return `<div class='item test'>
        <b class="test"> ${item.title + ' ' + item.subject} </b>
        - <b class="test"> ${' '+item.percentage.toFixed(1)+'% Note: '+item.grade}</b>
        </div>`  
    }
    return ""
}

const subject = loadSubject()
displayItems(subject)
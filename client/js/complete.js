

async function displayItems(subject){
    var itemsElements = document.querySelectorAll(".displayItems");
    for(var itemsElement of itemsElements) {
        var category = itemsElement.dataset.what
        var {user} = userData
        var items = await postDataWithToken("loadAll", {
            path: user+"/complete"
        });
        for(var item of items) {
            itemsElement.innerHTML += displayItem(item, subject)
        }
    }
}
            
    function displayItem(item, subject){
        if(item.subject == subject) {
            var link = "facher/complete"
            return `<div class='item test'>
            <b class="test""> ${item.title + ' ' + item.subject} </b>
            - <a href="../test.html?id=${item.id}&teacher=${item.teacher}">Los</a> 
            </div>`  
        }
        return ""
    }


const subject = loadSubject()
displayItems(subject)
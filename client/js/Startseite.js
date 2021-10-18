var userData = checkAuth()
var n;

function complete(){
  n=1;
    document.querySelectorAll(".fach, .zeile").forEach(element=>{
    element.style.display = "block";
    })
    document.querySelectorAll(".start").forEach(element=>{
      element.style.display = "none";
      })
    document.getElementById("home").style.display = "block";  
} 

function evaluation(){
  n=2;
  document.querySelectorAll(".fach, .zeile").forEach(element=>{
    element.style.display = "block";
    })
  document.querySelectorAll(".start").forEach(element=>{
      element.style.display = "none";
    })
  document.getElementById("home").style.display = "block";
}

function create(){
  location.assign("../html/maincreate.html");
}

function home(){
    document.querySelectorAll(".fach, .zeile").forEach(element=>{
    element.style.display = "none";
    })
    document.querySelectorAll(".start").forEach(element=>{
      element.style.display = "block";
      })
    document.getElementById("home").style.display= "none";
}

function menu(){
  localStorage.removeItem("simpletest_userdata")
  location.href = "login.html";
}

function help(fach){
    if(n==1){
      location.assign("../html/facher/complete/complete.html?subject=" + fach);
  }else if (n==2){
    location.assign("../html/facher/evaluation/evaluation.html?subject=" + fach);
  }
}
  
document.addEventListener("DOMContentLoaded", checkAuth)
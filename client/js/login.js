var help = 0;
function setFormMessage(formElement, type, message){
    const messageElement = formElement.querySelector(".form_message");

    messageElement.textContent = message;
    messageElement.classList.remove("form_message-success", "form_message-error");
    messageElement.classList.add(`form_message-${type}`);
};

function setInputError(inputElement, message){
    inputElement.classList.add("form_input-error");
    inputElement.parentElement.querySelector(".form_input-error-message").textContent = message;
};

function clearInputError(inputElement){
    inputElement.classList.remove("form_input-error");
    inputElement.parentElement.querySelector(".form_input-error-message").textContent = "";
}

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.querySelector("#login");
    const createAccountForm = document.querySelector("#createAccount");

    document.querySelector("#linkcreateAccount").addEventListener("click", e =>{
        e.preventDefault();
        loginForm.classList.add("form-hidden");
        createAccountForm.classList.remove("form-hidden");
    });
    document.querySelector("#linkLogin").addEventListener("click", e => {
        e.preventDefault();
        loginForm.classList.remove("form-hidden");
        createAccountForm.classList.add("form-hidden");
    });

    loginForm.addEventListener("submit", e => {
        e.preventDefault(); 
        var data = collectFormData(e.target)
        signIn(data)
    });

    createAccountForm.addEventListener("submit", e => {
        e.preventDefault();
        var data = collectFormData(e.target)
        signUp(data)
    });


    document.querySelectorAll(".form_input").forEach(inputElement => {

           inputElement.addEventListener("blur", e=> {
            
            console.log(143);
            if(e.target.id==="signupUsername" && !e.target.value.match(/^[A-z0-9_]{3,20}$/)){
                setInputError(inputElement, "Username must be 3-20 characters long and cannot contain any special characters");
            }
            if(e.target.id==="signupEmail" && !e.target.value.match(/^[A-z0-9._%+-]+@[A-z0-9.-]+\.[a-z]{2,}$/)){
                setInputError(inputElement, "No email address recognized");
            }
            if(e.target.id==="signupPassword" && e.target.value.length>= 0 && e.target.value.length < 7){
                setInputError(inputElement, "Password must be at least 7 characters in length")
            }
        }); 
       
        inputElement.addEventListener("input", e => {
            clearInputError(inputElement);
        }); 
    });
});


async function signUp(data) {
    data.email = data.email.toLowerCase();
    var response = await postData("signUp", data)
    if(response.ok) {
        localStorage.simpletest_userdata = JSON.stringify(response.data)
        location.href = "Startseite2.html";
    }
    else {
        setFormMessage(document.querySelector("#createAccount"), "error", response.info);
    }
}

async function signIn(data) {
    var response = await postData("signIn", data)
    console.log(response);
    if(response.ok) {
        localStorage.simpletest_userdata = JSON.stringify(response.data)
        location.href = "Startseite2.html";
    }
    else {
        setFormMessage(document.querySelector("#login"), "error", response.info);
    }
}

function forgpassword(){
    window.alert("Melde dich bei: leandro.luethi@gymburgdorf.ch");
}
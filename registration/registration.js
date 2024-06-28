"use strict"

const fullNameInputBox = document.getElementById('fullNameInputBox');
const usernameInputBox = document.getElementById('usernameInputBox');
const enterPasswordInputBox = document.getElementById('enterPasswordInputBox');
const confirmPasswordInputBox = document.getElementById('confirmPasswordInputBox');
const termsOfServiceCheckbox = document.getElementById('termsOfServiceCheckbox');
const emailNotificationCheckbox = document.getElementById('emailNotificationCheckbox');
const loginButton = document.getElementById('loginButton');
const errorOutput = document.getElementById("errorOutput");
//test
// let bodydata = {
//     "username": "testuser0102012301",
//     "fullName": "testuser0102012301",
//     "password": "turningupthisweekend"
//   }

  //for the errors
let p = document.createElement("p");
 p.classList.add("text-danger", "h5", "text-center");


window.onload = () =>{

    loginButton.onclick = (event) =>{
        event.preventDefault();
      let bodyData = {
        "username" : usernameInputBox.value,
        "fullName" : fullNameInputBox.value,
        "password" : enterPasswordInputBox.value,
      }  
      registerUser(bodyData)
    }
}

//should just work now :D
//TODO: Have this scroll down to the login section
function registerUser(bodydata){
    fetch(apiBaseURL + "/api/users",
        {
            method: "POST",
            body: JSON.stringify(bodydata), //always remember to stringify the body
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
    .then(response => {
        // console.log(response.status) //TODO: use this to add catches, throw err and do err code
        if(response.status == 400){
            p.innerHTML = "Hoot! That request ruffled our feathers. Please contact our owlmin team for assistance—they might just make it worse!";
            errorOutput.appendChild(p);
            return null
        } else if(response.status == 409){
            p.innerHTML  = "Uh-oh! Looks like that nest is already taken. Please create a new account and try again!";
            errorOutput.appendChild(p);
            return null
        }
        else {
            return response.json()
        }
        })
    .then(data => {
        if(data){
            p.classList.remove("text-danger");
            p.classList.add("text-success");
            p.innerHTML = "Congratulations! Your nest is ready. Registration successful—welcome to Owlder!";
            console.log(data);
            window.location.replace("../")
            //add a wait maybe
        }
    })
    .catch(err => { //catch the fetch error
        p.innerHTML = "Yikes! Our owls are overwhelmed with new nesters. Registration is down for now—please or try again later!";
        errorOutput.appendChild(p);
    })


}
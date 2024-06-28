"use strict"

// const fullNameInputBox = document.getElementById('fullNameInputBox');
// const usernameInputBox = document.getElementById('usernameInputBox');
const passwordInput = document.getElementById('password');
const confirmPasswordInputBox = document.getElementById('confirmPasswordInputBox');
// const termsOfServiceCheckbox = document.getElementById('termsOfServiceCheckbox');
const emailNotificationCheckbox = document.getElementById('emailNotificationCheckbox');
const loginButton = document.getElementById('loginButton');
const errorOutput = document.getElementById("errorOutput");



let p = document.createElement("p");
p.classList.add("text-danger", "h5", "text-center");


// window.onload = () => {

//     loginButton.onclick = (event) => {
//         if (validation()) {
            
//             event.preventDefault();
//             let bodyData = {
//                 "username": usernameInputBox.value,
//                 "fullName": fullNameInputBox.value,
//                 "password": enterPasswordInputBox.value,
//             }
//             registerUser(bodyData)
//         }
//         else {
//             p.innerHTML = "There was a problem with your signup! Please edit your info"
//             errorOutput.appendChild(p);
//         }
//     }



// }


//WORKS ENOUGH 
registration.onsubmit = function (event) {
    // Prevent the form from refreshing the page,
    // as it will do by default when the Submit event is triggered:
    event.preventDefault();
    if(passwordInput.value == confirmPasswordInputBox.value){
        const loginData = {
            username: registration.username.value,
            fullName: registration.fullName.value,
            password: registration.password.value,
        }
    
        // Disables the button after the form has been submitted already:
        registration.loginButton.disabled = true;
    
        // Time to actually process the login using the function from auth.js!
        registerUser(loginData);
    } else {
        p.innerHTML = "Make sure your passwords match"
        errorOutput.appendChild(p);
    }
    // We can use loginForm.username (for example) to access
    // the input element in the form which has the ID of "username".
   
};




function validation(){
    if(
        usernameInputBox.value.length > 3
        &&
        enterPasswordInputBox.value.length > 5
        &&
        enterPasswordInputBox.value == confirmPasswordInputBox.value 
    ){
        return true
    }
}

//should just work now :D
function registerUser(bodydata) {
    fetch(apiBaseURL + "/api/users",
        {
            method: "POST",
            body: JSON.stringify(bodydata),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        .then(response => {

            if (response.status == 400) {
                p.innerHTML = "Hoot! That request ruffled our feathers. Please contact our owlmin team for assistance—they might just make it worse!";
                errorOutput.appendChild(p);
                return null
            } else if (response.status == 409) {
                p.innerHTML = "Uh-oh! Looks like that nest is already taken. Please create a new account and try again!";
                errorOutput.appendChild(p);
                return null
            }
            else {
                return response.json()
            }
        })
        .then(data => {
            if (data) {
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
"use strict"

const emailTextBox = document.getElementById('emailTextBox');
const usernameTextBox = document.getElementById('usernameTextBox');
const passwordTextBox = document.getElementById('passwordTextBox');
const passwordConfirmTextBox = document.getElementById('passwordConfirmTextBox');
const termsOfServiceCheckbox = document.getElementById('termsOfServiceCheckbox');
const emailNotificationCheckbox = document.getElementById('emailNotificationCheckbox');
const loginButton = document.getElementById('loginButton');

//test
let bodydata = {
    "username": "testuser0102012301",
    "fullName": "testuser0102012301",
    "password": "turningupthisweekend"
  }

window.onload = () =>{
    console.log("connected");
    // console.log(apiBaseURL);
    registerUser();
}


function registerUser(){
    fetch("http://microbloglite.us-east-2.elasticbeanstalk.com/api/users",
        {
            method: "POST",
            body: JSON.stringify(bodydata), //always remember to stringify the body
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
    .then(response => {
        console.log(response.status) //TODO: use this to add catches, throw err and do err code
        if(response.status == 409){
            console.log("some catch")
        } else if(response.status == 400){
            console.log("some code")
        }
        response.json()})
    .then(data => {
        console.log(data);
    })
    .catch(err => {
        console.log(err);
    })
}
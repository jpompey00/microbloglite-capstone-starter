"use strict"

const profileImageElement = document.getElementById("profileImageElement");
const profileFullNameTextBox = document.getElementById("profileFullNameTextBox");
const postsOutputContainer = document.getElementById("postsOutputContainer");
const likedPostsOutputContainer = document.getElementById("likedPostsOutputContainer");
const bioOutputTextBox = document.getElementById("bioOutputTextBox");
const editProfileInfoButton = document.getElementById("editProfileInfoButton");
const saveEditedInfoButton = document.getElementById("saveEditedInfoButton");
const memberSinceTextBox = document.getElementById("memberSinceTextBox");
const bioInputDiv = document.getElementById("bioInputDiv");
const passwordInputDiv = document.getElementById("passwordInputDiv");
const fullNameInputDiv = document.getElementById("fullNameInputDiv");

//the span is what holds the info
const profileUsernameSpan = document.getElementById("profileUsernameSpan");
//this only holds the @ lmao
const profileUsernameTextbox = document.getElementById("profileUsernameTextbox");

//input fields
const profileFullNameInputBox = document.getElementById("profileFullNameInputBox");
const bioInputBox = document.getElementById("bioInputBox");
const profileUserNameInputBox = document.getElementById("profileUserNameInputBox");
const changePasswordInputBox = document.getElementById("changePasswordInputBox");
const confirmChangePasswordInputBox = document.getElementById("confirmChangePasswordInputBox");

let currentUsername = JSON.parse(window.localStorage.getItem("login-data")).username;
let currentUserFullName;
// let testUser = "DonnyA";

let option = {
    method: "GET",
    headers: {
        Authorization: `Bearer ${JSON.parse(window.localStorage.getItem("login-data")).token}`,
    }
}

//TODO:
//Fix the posts not updating when I like or unlike a post.
//Edit the profile 
window.onload = () => {
    //not sure why i need "false" here
    window.addEventListener("reloadPosts", loadPosts, false);
    // console.log(testUsername);
    console.log("connected");
    loadFullName();
    loadPersonalInfo();
    loadPosts();
    loadLikedPosts();


    //button events
    editProfileInfoButton.onclick = onEditProfileInfoButtonClick;
    saveEditedInfoButton.onclick = onSaveEditedInfoButtonClick;
}


function onEditProfileInfoButtonClick() {
    fullNameInputDiv.style = "display: block";
    profileFullNameInputBox.value = profileFullNameTextBox.innerHTML;
    profileFullNameInputBox.style = "display: block";
    profileFullNameTextBox.style = "display: none";


    passwordInputDiv.style = "display: block"
    changePasswordInputBox.style = "display: block";
    confirmChangePasswordInputBox.style = "display: block";

    bioInputDiv.style = "display: block";

    bioInputBox.value = bioOutputTextBox.innerHTML;
    bioOutputTextBox.style = "display:none"

    editProfileInfoButton.style = "display: none";
    saveEditedInfoButton.style = "display: inline-block"
}

function onSaveEditedInfoButtonClick() {
    let body = {
        "password": `${changePasswordInputBox.value}`,
        "fullName": `${profileFullNameInputBox.value}`,
        "bio" : `${bioInputBox.value}`
    }
    updateUser(currentUsername, body);
    //need a function to update the page.
}



async function updateUser(username, body){
    fetch(apiBaseURL + "/api/users/" + username , {
        method: "PUT",
        body: JSON.stringify(body),
        headers: {
            Authorization: `Bearer ${JSON.parse(window.localStorage.getItem("login-data")).token}`,
            "Content-type": "application/json; charset=UTF-8"
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
    }) 
}







//so other functions can access the firstName without needing to call this API themselves or looping
//through the user array to find it.
async function loadFullName() { 
    let users = await getUsersAPI();
    for (let u of users) {
        if (u.username == currentUsername) {
            currentUserFullName = u.fullName;
            console.log(currentUserFullName);
        }
    }
}

async function loadPersonalInfo() {
    let data = await callAPIGetSpecificUser();
    console.log(typeof (data.fullName));
    profileFullNameTextBox.innerHTML = data.fullName;
    //maybe have this an achor to take you to other pages.
    profileUsernameSpan.innerHTML = `${data.username}`;
    memberSinceTextBox.innerHTML = data.createdAt;

    // console.log(data.bio);
    bioOutputTextBox.innerHTML = data.bio;

}

async function loadPosts() {
    postsOutputContainer.innerHTML = "";
    let data = await callAPIGetPosts();

    for (let d of data) {
        if (d.username == currentUsername) {

            postsOutputContainer.appendChild(
                createCard(d, currentUserFullName)
            );
        }
    }
}

async function loadLikedPosts() {
    likedPostsOutputContainer.innerHTML = ""
    let data = await callAPIGetPosts();
    for (let d of data) {
        for (let l of d.likes) {
            if (l.username == currentUsername) {
                //will need its own card for this too
                likedPostsOutputContainer.appendChild(createCard(d, currentUserFullName));

            }
        }
    }
}

function callAPIGetPosts() {
    return fetch(apiBaseURL + `/api/posts`, option)
        .then(response => response.json())
        .then(data => data)
}

function callAPIGetSpecificUser() { //i'd prefer to separate the api calls like this for all of them
    return fetch(apiBaseURL + `/api/users/${currentUsername}`, option)
        .then(response => response.json())
        .then(data => data);
}

async function getUsersAPI() {
    return await fetch(apiBaseURL + '/api/users', option)
        .then(response => response.json())
        .then(data => data)
}



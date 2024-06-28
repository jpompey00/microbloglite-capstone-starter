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

const profileErrorOutputMessage = document.getElementById("profileErrorOutputMessage");
const createPostButton = document.getElementById("createPostButton");

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



let option = {
    method: "GET",
    headers: {
        Authorization: `Bearer ${JSON.parse(window.localStorage.getItem("login-data")).token}`,
    }
}

//TODO:
//NOT STYLING HOW I WANT IT. ASK! 
//LAST ROUND OF FORMATTING!
//Fix the posts not updating when I like or unlike a post.
//Edit the profile 
window.onload = () => {
    //not sure why i need "false" here
    window.addEventListener("reloadPosts", loadPosts, false);
    // console.log(testUsername);
    console.log("connected");
    loadFullName();
    loadPersonalInfo();

    setTimeout(loadPosts, 300);
    setTimeout(loadLikedPosts, 300);


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
    .then(response => {
        if(response.status >=200 && response.status < 300){
            return response.json();       
        } else {
            throw error;
        }
    })
    .then(data => {
        errorOutputMessage.style = "display: none";
        console.log(data);

    }) 
    .catch(error => { //doesn't tell you what the issue is entirely
        errorOutputMessage.style = "display: block";
        errorOutputMessage.innerHTML = "Trouble Updating User";

    })
}


//so other functions can access the firstName without needing to call this API themselves or looping
//through the user array to find it.
async function loadFullName() { 
    let users = await getUsersAPI();
    if(!users){
        // console.log("test?")
        errorOutputMessage.style = "display: block";
        errorOutputMessage.innerHTML = "Whoops! Our owls are having trouble finding your name. It might be hiding in the treetops—try again later!";
        return
    }
    for (let u of users) {
        if (u.username == currentUsername) {
            currentUserFullName = u.fullName;
            console.log(currentUserFullName);
        }
    }
}


async function loadPersonalInfo() {
    let data = await callAPIGetSpecificUser();
    if(!data){
        profileFullNameTextBox.innerHTML = "";
        profileUsernameTextbox.innerHTML = "";
        memberSinceTextBox.innerHTML = "";
        bioOutputTextBox.innerHTML = "";
        profileErrorOutputMessage.style = "display: block"
        profileErrorOutputMessage.innerHTML = "Uh-oh! Your personal info might have flown the coop. It’s probably out there somewhere. Try again later!";

        editProfileInfoButton.disabled = true;
        return
    }
    // console.log(typeof (data.fullName));
    profileFullNameTextBox.innerHTML = data.fullName;
    //maybe have this an achor to take you to other pages.
    profileUsernameSpan.innerHTML = `${data.username}`;
    let time = Date.parse(data.createdAt);
    const date = new Date(time);
    const twelveHourTimeString = date.toLocaleTimeString('en-US',
        {
            timeZone: 'ETC/GMT+4', //odd
            hour12: true,
            hour: 'numeric',
            minute: 'numeric'
        });
    const dateString = `${months[date.getMonth()]}/${date.getDate()}/${date.getFullYear()}`
    let createdAt = `${dateString} ${twelveHourTimeString}`;

    memberSinceTextBox.innerHTML =`Joined:  ${createdAt}` ;

    // console.log(data.bio);
    bioOutputTextBox.innerHTML = data.bio;

}

async function loadPosts() {
    
    let data = await callAPIGetPosts();
    postsOutputContainer.innerHTML = "";
    if(!data){
        let p = document.createElement("p");
        p.classList.add("text-danger", "h5")
        p.innerHTML = "Whoops-a-daisy! Your post got tangled in the owl's nest. Give it another hoot!";
        postsOutputContainer.appendChild(p);
        return
    }
    for (let d of data) {
        
        if (d.username == currentUsername) {

            postsOutputContainer.appendChild(
                createCard(d, currentUserFullName)
            );
        }
    }
}

async function loadLikedPosts() {
    
    let data = await callAPIGetPosts();
    likedPostsOutputContainer.innerHTML = "";
    if(!data){
        let p = document.createElement("p");
        p.classList.add("text-danger", "h5")
        p.innerHTML = "Whoops-a-daisy! Your post got tangled in the owl's nest. Give it another hoot!";
        likedPostsOutputContainer.appendChild(p);
        return
    }
    for (let d of data) {
        for (let l of d.likes) {
            if (l.username == currentUsername) {
                //will need its own card for this too
                likedPostsOutputContainer.appendChild(createCard(d, currentUserFullName));

            }
        }
    }
}

async function callAPIGetPosts() {
    return await fetch(apiBaseURL + `/api/posts`, option)
        .then(response => {
            if(response.status >=200 && response.status < 300){
                return response.json();       
            } else {
                throw error;
            }
        })
        .then(data => {
           
           
            return data})
        .catch(error => {
            return null;
        })
}

async function callAPIGetSpecificUser() { //i'd prefer to separate the api calls like this for all of them
    return await fetch(apiBaseURL + `/api/users/${currentUsername}`, option)
        .then(response => {
            if(response.status >=200 && response.status < 300){
                return response.json();       
            } else {
                throw error;
            }
        })
        .then(data => data)
        .catch(error => {
            return null
        })
}

async function getUsersAPI() {
    return await fetch(apiBaseURL + '/api/users', option)
        .then(response => {
            if(response.status >=200 && response.status < 300){
                return response.json();       
            } else {
                throw error;
            }
        })
        .then(data =>data)
        .catch(error => {
            return null
        })
}



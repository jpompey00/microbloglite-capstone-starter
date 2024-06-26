/* Posts Page JavaScript */

//TODO: DELETE WHEN DONE
//TEST TOKEN, IMPORTANT, DELETE
//"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3R1c2VyMDEwMjAxMjMwMSIsImlhdCI6MTcxOTE0ODUwNywiZXhwIjoxNzE5MjM0OTA3fQ.Pkr0BTK-1Lbx8xnIIG1ckt8jTUIrHC8PS1kH3EPvnfo"



"use strict";
const cardOutput = document.getElementById("cardOutput");
const attatchmentButton = document.getElementById("attatchmentButton");
const sendButton = document.getElementById("sendButton");
const xIconElement = document.getElementById("xIconElement");
const postTextInput = document.getElementById("postTextInput");
const objectScrollDiv = document.getElementById("objectScrollDiv");
const filterDropdown = document.getElementById("filterDropdown");
//API Values
// const API_BASE_URL = "http://microbloglite.us-east-2.elasticbeanstalk.com";


window.onload = async () => {
    console.log("connected");
    window.addEventListener("reloadPosts", getPostsApiCall, false);
    // console.log(JSON.parse(window.localStorage.getItem("login-data")).token);

    populatePosts();

    //FIXME: This needs to scroll to the bottom, it only does that if save this document
    //when i'm not on the page. See Solution in PopulatePostAPICall
    //FIXME: the display of the posts in reverse when this is resolved
    scrollToBottom(objectScrollDiv);


    xIconElement.onmouseenter = onXIconElementMouseEnter;
    xIconElement.onmouseleave = onXIconElementMouseLeave;
    // createPostApiCall("TestPost3");
    sendButton.onclick = onSendButtonClick;
    filterDropdown.onchange = onFilterDropdownChange;

}


function onXIconElementMouseEnter() {
    xIconElement.src = "../assets/x-circle-fill.svg";
}

function onXIconElementMouseLeave() {
    xIconElement.src = "../assets/x-circle.svg";
}


async function populatePosts(sortedData = null) {
    cardOutput.innerHTML = "";
    let users = await getUsersAPICall();
    let postsData;
        //for (let d of data.slice().reverse())
    let recentcard;
    if(sortedData != null){
        postsData = sortedData;
    } else {
        postsData = await getPostsApiCall();
    }
    for (let d of postsData) {
        let noMatches = true;
        // //may convert this to 24 hours
        // let time = Date.parse(d.createdAt);
        // const date = new Date(time);
        // console.log(`${date.getHours()}:${date.getMinutes()} ${date.getDay()}-${date.getMonth()}-${date.getFullYear()}`);
        for (let u of users) {
            // console.log(u);
            //TODO:getting an odd behavior there
            /*
            It should be printing it all out cause every post should have a username?
            */
            if (d.username == u.username) { 
                recentcard = createCard(d, u.fullName);
                cardOutput.appendChild(recentcard);
                noMatches = false;
                
            }
        }
        if(noMatches){
            recentcard = createCard(d);
            cardOutput.appendChild(recentcard);
        }
    }

}

//I think this works
async function getPostsApiCall() {
    let dataToReturn;
    await fetch(apiBaseURL + "/api/posts",
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${JSON.parse(window.localStorage.getItem("login-data")).token}`,
            }
        }
    )
        .then(response => response.json())
        .then(data => {

            dataToReturn = data;
        })

    return dataToReturn;
}


function createPostApiCall(postString) {
    let postJson = {
        "text": `${postString}`
    }

    fetch(apiBaseURL + "/api/posts", {
        method: "POST",
        body: JSON.stringify(postJson),
        headers: {
            Authorization: `Bearer ${JSON.parse(window.localStorage.getItem("login-data")).token}`,
            "Content-type": "application/json; charset=UTF-8"
        }
    }).then(response => response.json())
        .then(data => {
            console.log(data);
        })
}

//have this activate on pressing enter as well
async function onSendButtonClick() {
    //add more catches for when its blank, like if they add a bunch of spaces with no
    //characters
    if (postTextInput.value.trim() !== "") {
        await createPostApiCall(postTextInput.value);
        postTextInput.value = "";
        populatePosts(await getPostsApiCall());
    }
}


function scrollToBottom(element) {
    requestAnimationFrame(() => {
        element.scrollTop = element.scrollHeight;
    });
}

async function onFilterDropdownChange() {
    let sortedData = await getPostsApiCall();
    switch (filterDropdown.value) {
        case "numberOfLikes":
            sortedData.sort((a, b) => b.likes.length - a.likes.length);
            populatePosts(sortedData);
            break;
        case "timePostedAscending":
            sortedData.sort((a,b) => a.createdAt.localeCompare(b.createdAt));
            populatePosts(sortedData);
            break;
        case "timePostedDescending":
            sortedData.sort((a,b) => b.createdAt.localeCompare(a.createdAt));
            populatePosts(sortedData);
            break;
    }

}



async function getUsersAPICall() {
    let dataToReturn;
    await fetch(apiBaseURL + "/api/users",
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${JSON.parse(window.localStorage.getItem("login-data")).token}`,
            }
        }
    )
        .then(response => response.json())
        .then(users => {
            dataToReturn = users;
        })

    return dataToReturn;
}
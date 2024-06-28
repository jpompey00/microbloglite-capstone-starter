/* Posts Page JavaScript */

"use strict";
//this was harder than I expected
new EmojiPicker({
    trigger: [
        {
            selector: "#emojiButton",
            insertInto: "#postTextInput"
        }
    ],
    closeButton : true,
});

const cardOutput = document.getElementById("cardOutput");
// const attatchmentButton = document.getElementById("attatchmentButton");
const sendButton = document.getElementById("sendButton");
const xIconElement = document.getElementById("xIconElement");
const postTextInput = document.getElementById("postTextInput");

//yea
const timeDescending = document.getElementById("timeDescending");
const timeAscending = document.getElementById("timeAscending");
const numberOfLikes = document.getElementById("numberOfLikes");


window.onload = async () => {
    console.log("connected");
    


    //TODO:how does this work again
    window.addEventListener("reloadPosts", getPostsApiCall, false);
    window.addEventListener("replyText", (e) => {
        replyToMessage(e.detail.id);
    } , false )
  
    //This works, add 300ms wait.
   setTimeout(populatePosts, 300);
  
    //FIXME: Scroll function works really weird

    sendButton.onclick = onSendButtonClick;

    timeDescending.onclick = () => filterChange("timePostedDescending")
    timeAscending.onclick = () => filterChange("timePostedAscending")
    numberOfLikes.onclick = () => filterChange("numberOfLikes")

}


function replyToMessage(replyingToString){
    postTextInput.value = `@${replyingToString} ${postTextInput.value}`;
    // console.log(replyingToString);
}


//Fixed
async function populatePosts(sortedData = null) {
    let placeholderImage = "../images/default-avatar-photo-placeholder-profile-picture-vector-3708684430.jpg";
    let users = await getUsersAPICall();
    let postsData;
    let recentcard;
    if (sortedData != null) {
        postsData = sortedData;
    } else {
        postsData = await getPostsApiCall();

    }
    cardOutput.innerHTML = "";
    for (let d of postsData.slice().reverse()) {

        let noMatches = true;
        for (let u of users) {
            if (d.username == u.username) {
                recentcard = createCard(d, u.fullName, placeholderImage);
                cardOutput.appendChild(recentcard);
                noMatches = false;

            }
        }
        if (noMatches) {
            
            recentcard = createCard(d, d.username, placeholderImage);
            cardOutput.appendChild(recentcard);
        }

    }

    //issue: Is scrolling once, then again when reloaded. Its a bit jarring.
    //issue: scrolls halfway the first time?
    console.log("scrolled");
    scrollToBottom();
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
        })
        .then(response => {
            if (response.status == 400) {
                throw error;
            } else {
                return response.json()
            }
        })
        .then(data => {
            dataToReturn = data;
        })
        .catch(error => {
            let p = document.createElement("p")
            p.classList.add("text-danger", "h4");
            p.innerHTML = "Oops! Looks like our owls are taking a nap. Please perch yourself elsewhere and try hooting again later!"
            cardOutput.appendChild(p);
        })


    return dataToReturn;
}


async function createPostApiCall(postString) {
    errorOutputMessage.style = "display: none;";
    let boolOutput;
    let postJson = {
        "text": `${postString}`
    }

    await fetch(apiBaseURL + "/api/posts", {
        method: "POST",
        body: JSON.stringify(postJson),
        headers: {
            Authorization: `Bearer ${JSON.parse(window.localStorage.getItem("login-data")).token}`,
            "Content-type": "application/json; charset=UTF-8"
        }
    }).then(response => {
        if (response.status != 201) {
            throw error
        } else {
            return response.json()
        }
    })
        .then(data => {
            boolOutput = true;
           
        })
        .catch(error => {
            errorOutputMessage.style = "display: block;";
            errorOutputMessage.innerHTML = "Whoops-a-daisy! Your post got tangled in the owl's nest. Give it another hoot!";
            boolOutput = false;
        })

    return boolOutput;
}

//TODO: have this activate on pressing enter as well
async function onSendButtonClick() {
    //add more catches for when its blank, like if they add a bunch of spaces with no
    //characters
    if (postTextInput.value.trim() !== "") {
        if (await createPostApiCall(postTextInput.value)) { //makes sure the fetch has worked before reloading page.
            postTextInput.value = "";
            populatePosts(await getPostsApiCall());
        }
    }
}

//TODO: MOTION SICKNESS WARNING
function scrollToBottom() {

    window.scrollTo(0, document.body.scrollHeight);
}

//TODO: make sure works
async function filterChange(value) {
    let sortedData = await getPostsApiCall();
    switch (value) {
        case "numberOfLikes":
            sortedData.sort((a, b) => b.likes.length - a.likes.length);
            populatePosts(sortedData);
            break;
        case "timePostedAscending":
            sortedData.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
            populatePosts(sortedData);
            break;
        case "timePostedDescending":
            sortedData.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
            populatePosts(sortedData);
            break;
    }

}


//works
async function getUsersAPICall() {
    let nullData = [
        {
            fullname: null,
            bio: null,
            createdAt: null,
            username: null,
            updatedAt: null,
        },
        {
            fullname: null,
            bio: null,
            createdAt: null,
            username: null,
            updatedAt: null,
        },
        {
            fullname: null,
            bio: null,
            createdAt: null,
            username: null,
            updatedAt: null,
        },
    ]
    let dataToReturn;
    await fetch(apiBaseURL + "/api/users",
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${JSON.parse(window.localStorage.getItem("login-data")).token}`,
            }
        })
        .then(response => {
            if (response.status != 200) {
                throw error;
            } else {
                return response.json();
            }
        })
        .then(users => {

            dataToReturn = users;
        })
        .catch(error => {
            dataToReturn = nullData;
        })

    return dataToReturn;
}



//replying to posts
//add an anchor with a FA reply icon
//when you click on it, it puts the @[string] in the input box
//When the message is sent, if the message has @[] and whatever is inside the []
//will be read as a link that sends you to that message. Use Message ID or the like for this. 

//uploading attatchment
//upload image to separate folder then display that

//view other profiles
//load their info in the profile page maybe using the URL bullshit


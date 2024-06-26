//BUG, url search param doesn't work with the name #FreeToryLanez? 
//Name isn't searchable in postman either As far as I can tell
//It returns every user??

const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const errorOutputMessage = document.getElementById("errorOutputMessage");


//I hate this
function createCard(data, fullName = null, imageSrc = "...") {

    let imageAnchor = document.createElement("a");
    imageSrc = assignPicture(data.username);
    currentUserUsername = JSON.parse(window.localStorage.getItem("login-data")).username;

    const cardDiv = document.createElement("div");
    cardDiv.classList.add("card", "border-0", "myCardColor");
    cardDiv.id = data._id;

    const cardBodyDiv = document.createElement("div");
    cardBodyDiv.classList.add("card-body");
    cardDiv.appendChild(cardBodyDiv);

    const rowDiv1CardBody = document.createElement("div");
    rowDiv1CardBody.classList.add("row");
    cardBodyDiv.appendChild(rowDiv1CardBody);

    const colDiv1RowDiv1 = document.createElement("div");
    colDiv1RowDiv1.classList.add("col-2");
    rowDiv1CardBody.appendChild(colDiv1RowDiv1);


    //Profile Images
    const profileImg = document.createElement("img");
    imageAnchor.appendChild(profileImg);
    //sends to the specific users profile
    imageAnchor.href = `../profile/?username=${data.username}`

    profileImg.classList.add("card-img-top");
    profileImg.src = imageSrc;
    profileImg.alt = "...";
    colDiv1RowDiv1.appendChild(imageAnchor);


    const colDiv2RowDiv1 = document.createElement("div");
    colDiv2RowDiv1.classList.add("col");
    rowDiv1CardBody.appendChild(colDiv2RowDiv1);

    const rowDiv1ColDiv2 = document.createElement("div");
    rowDiv1ColDiv2.classList.add("row");
    colDiv2RowDiv1.appendChild(rowDiv1ColDiv2);

    const colDiv1RowDiv1ColDiv2 = document.createElement("div");
    colDiv1RowDiv1ColDiv2.classList.add("col");
    rowDiv1ColDiv2.appendChild(colDiv1RowDiv1ColDiv2);

    const posterName = document.createElement("p");
    posterName.classList.add("card-title");
    posterName.id = "cardTitle";
    const posterFullName = document.createElement("span");
    posterFullName.classList.add("h5");
    posterFullName.innerHTML = fullName;
    posterName.appendChild(posterFullName);
    posterName.innerHTML += ` @${data.username}`;
    colDiv1RowDiv1ColDiv2.appendChild(posterName);

    const colDiv2RowDiv1ColDiv2 = document.createElement("div");
    colDiv2RowDiv1ColDiv2.classList.add("col");
    rowDiv1ColDiv2.appendChild(colDiv2RowDiv1ColDiv2);

    const timeOfCreation = document.createElement("p");
    timeOfCreation.classList.add("fst-italic");

    //Converts the Date to a readable format
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
    timeOfCreation.innerHTML = `${createdAt}`;
    colDiv2RowDiv1ColDiv2.appendChild(timeOfCreation);

    const colDiv3RowDiv1ColDiv2 = document.createElement("div");
    colDiv3RowDiv1ColDiv2.classList.add("col");
    rowDiv1ColDiv2.appendChild(colDiv3RowDiv1ColDiv2);


    const heartLink = document.createElement("a");
    heartLink.href = "#";
    colDiv3RowDiv1ColDiv2.appendChild(heartLink);



    const heartImage = document.createElement("img");
    // heartImage.src = "../assets/heart.svg";

    (function () {
        for (let l of data.likes) {
            if (l.username == currentUserUsername) {
                heartImage.setAttribute("data-liked", true);
                heartImage.src = "../assets/heart-fill.svg"
                return 0;
            }
        }
        heartImage.setAttribute("data-liked", false);
        heartImage.src = "../assets/heart.svg"
    })();

    heartImage.width = 25;
    heartImage.height = 25;
    heartLink.appendChild(heartImage);


    const numberOfLikesElement = document.createElement("span");
    numberOfLikesElement.classList.add("fs-5");
    numberOfLikesElement.innerHTML = ` ${data.likes.length}`;
    colDiv3RowDiv1ColDiv2.appendChild(numberOfLikesElement);


    let editedPostId;
    //controls the logic behind accepting a like
    heartImage.onclick = async () => {
        editedPostId = data._id;
        if (heartImage.dataset.liked == "false") {
            ``
            heartImage.src = "../assets/heart-fill.svg"
            heartImage.setAttribute("data-liked", true);
            await addLikeCall(data);
        } else {
            console.log(heartImage);
            heartImage.src = "../assets/heart.svg"
            heartImage.setAttribute("data-liked", false);
            await removeLikeCall(data);
        }
        data = await getPostById(editedPostId);
        updateLike(data, numberOfLikesElement);
    }


    const rowDiv2ColDiv2 = document.createElement("div");
    rowDiv2ColDiv2.classList.add("row");
    colDiv2RowDiv1.appendChild(rowDiv2ColDiv2);

    const colDiv1RowDiv2ColDiv2 = document.createElement("div");
    colDiv1RowDiv2ColDiv2.classList.add("col-9");
    rowDiv2ColDiv2.appendChild(colDiv1RowDiv2ColDiv2);

    //Reply function, not exactly working
    // let replyAnchor = createReplyAnchor(data);

    const postTextElement = document.createElement("p");
    postTextElement.classList.add("card-text");
    postTextElement.id = "cardBody";

    // if (typeof replyAnchor == "Node") {
    //     postTextElement.appendChild(replyAnchor);
    // }
    let text = document.createTextNode(data.text);
    postTextElement.appendChild(text);
    colDiv1RowDiv2ColDiv2.appendChild(postTextElement);

    const colDiv2RowDiv2ColDiv2 = document.createElement("div");
    colDiv2RowDiv2ColDiv2.classList.add("col-3");
    let replyButton = document.createElement("img");
    replyButton.src = "/assets/reply.svg";
    replyButton.width = 30;
    replyButton.height = 30;
    //logic behding the reply button.
    replyButton.onmouseenter = () => {
        replyButton.src = "/assets/reply-fill.svg"
    }
    replyButton.onmouseleave = () => {
        replyButton.src = "/assets/reply.svg"
    }
    replyButton.onclick = () => {
        //need an event listener here
        let replyTextEvent = new CustomEvent("replyText", {
            detail: {
                id: data.username
            }
        })
        dispatchEvent(replyTextEvent);
    }

    colDiv2RowDiv2ColDiv2.appendChild(replyButton);
    rowDiv2ColDiv2.appendChild(colDiv2RowDiv2ColDiv2);

    //Logic Behind Delete Button
    if (data.username == currentUserUsername) {
        const xIconLink = document.createElement("a");
        xIconLink.href = "#";
        xIconLink.onclick = () => {
            //put this into its own function maybe
            fetch(apiBaseURL + `/api/posts/${data._id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${JSON.parse(window.localStorage.getItem("login-data")).token}`,

                }
            })
                .then(response => response.json())
                .then(data => {
                    console.log("deleted");
                    //YEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
                    let reloadPostsEvent = new CustomEvent("reloadPosts");
                    dispatchEvent(reloadPostsEvent);
                })

        }
        colDiv2RowDiv2ColDiv2.appendChild(xIconLink);

        const xIconElement = document.createElement("img");
        xIconElement.id = "xIconElement";
        xIconElement.classList.add("icon");
        xIconElement.src = "../assets/x-circle.svg";
        xIconElement.width = 25;
        xIconElement.height = 25;
        xIconLink.appendChild(xIconElement);
        xIconElement.onmouseenter = () => {
            xIconElement.src = "../assets/x-circle-fill.svg";
        }
        xIconElement.onmouseleave = () => {
            xIconElement.src = "../assets/x-circle.svg";
        }
        //end of button
    }
    return cardDiv;
}


async function addLikeCall(data) { 
    let bodyData = {
        "postId": `${data._id}`
    }
    await fetch(apiBaseURL + "/api/likes",
        {
            method: "POST",
            body: JSON.stringify(bodyData),
            headers: {
                Authorization: `Bearer ${JSON.parse(window.localStorage.getItem("login-data")).token}`,
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        .then(response => {
            if (response.status != 201) {
                throw error;
            } else {
                return response.json();
            }
        })
        .then(result => {
            console.log("completed")
        })
        .catch(error => {
            errorOutputMessage.style = "display: block";
            errorOutputMessage.innerHTML = "Oops! Looks like our owl got cold feet. Try liking again later!"
        })

}

async function removeLikeCall(data) {
    currentUserUsername = JSON.parse(window.localStorage.getItem("login-data")).username;

    for (l of data.likes) {
        if (l.username == currentUserUsername) {
            // console.log(l._id);
            await fetch(apiBaseURL + `/api/likes/${l._id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${JSON.parse(window.localStorage.getItem("login-data")).token}`,
                    }
                })
                .then(response => {
                    if (response.status != 202) {
                        throw error;
                    } else {
                        return response.json();
                    }
                })
                .then(data => {
                    console.log(data);
                })
                .catch(error => {
                    errorOutputMessage.style = "display: block";
                    errorOutputMessage.innerHTML = "Uh-oh! That like must be stuck like an owl on a branch. We'll try to pry it off later!";
                })
        }
    }



}

function updateLike(data, numberOfLikesElement) {

    numberOfLikesElement.innerHTML = ` ${data.likes.length}`;
}


async function getPostById(postId) {
    let returnData;
    await fetch(apiBaseURL + `/api/posts/${postId}`, {

        method: "GET",
        headers: {
            Authorization: `Bearer ${JSON.parse(window.localStorage.getItem("login-data")).token}`,
            "Content-type": "application/json; charset=UTF-8"
        }
    })
        .then(response => {
            if (response.status != 200) {
                throw error;
            } else {
                return response.json();
            }
        })
        .then(data => {
            console.log("completed");
            returnData = data;
        })
        .catch(error => {
            errorOutputMessage.style = "display: block";
            errorOutputMessage.innerHTML = "Oops! Looks like the data took flight. It might be lost in the night—please try again later!";
        })

    return returnData;
}


//proud of this one
function assignPicture(username) {
    //take the first letter of the username
    //conver it to the ascii value
    //if the value is between 0 and 9 assign a value
    //if its over 9, mod the number by 9 then assign it a value

    let number = username.charCodeAt(0) % 9
    let image = `../images/placeholder_profile_images/image${number}.jpeg`
    return image;
}




//find index of space after the first character if
//the first character is an @
//record that into a string
//thats the post id
//set the post id to the href of the anchor
//set the post id to the innerhtml of the anchor
//set the rest of the message to the textNode
//not working as intended Would fix
async function createReplyAnchor(data) {
    let option = {
        method: "GET",
        headers: {
            Authorization: `Bearer ${JSON.parse(window.localStorage.getItem("login-data")).token}`,
            "Content-type": "application/json; charset=UTF-8"
        }
    };
    let replyAnchor = document.createElement("a");
    let postMessage = data.text;
    if (postMessage[0] == '@' && postMessage.indexOf(" ") != -1) {
        let string = postMessage.slice(0, postMessage.indexOf(" "));

        let messageId = string.slice(1);

        replyAnchor.href = `#${messageId}`;

        // console.log(apiBaseURL + `/api/posts/${messageId}`);
        let messageUsername = await fetch(apiBaseURL + `/api/posts/${messageId}`, option)
            .then(response => {
                if (response.status != 200) {
                    throw error;
                } else {
                    return response.json();
                }
            })
            .then(data => {
                // console.log("completed");
                returnData = data;

            })
            .catch(error => {
                return
            })

            console.log(messageUsername);
        replyAnchor.innerHTML = `@TestPlease `

    }

    console.log(replyAnchor);
    return replyAnchor;

}
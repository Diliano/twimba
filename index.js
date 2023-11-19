import { tweetsData } from "./data.js";
import { v4 as uuidv4 } from "https://jspm.dev/uuid";

document.addEventListener("click", function(event) {
    if (event.target.dataset.like) {
       handleLikeClick(event.target.dataset.like); 
    } else if (event.target.dataset.retweet) {
        handleRetweetClick(event.target.dataset.retweet);
    } else if (event.target.dataset.reply) {
        handleReplyClick(event.target.dataset.reply);
    } else if (event.target.id === "tweet-btn") {
        handleTweetBtnClick();
    }
});
 
function handleLikeClick(tweetId) { 
    const targetTweetObj = tweetsData.find(function(tweet) {
        return tweet.uuid === tweetId
    });

    targetTweetObj.isLiked ? targetTweetObj.likes-- : targetTweetObj.likes++;

    targetTweetObj.isLiked = !targetTweetObj.isLiked;

    render();
}

function handleRetweetClick(tweetId){
    const targetTweetObj = tweetsData.find(function(tweet) {
        return tweet.uuid === tweetId;
    });
    
    targetTweetObj.isRetweeted ? targetTweetObj.retweets-- : targetTweetObj.retweets++;

    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted;

    render(); 
}

function handleReplyClick(tweetId) {
    document.getElementById(`replies-${tweetId}`).classList.toggle("hidden");
}

function handleTweetBtnClick(){
    const tweetInput = document.getElementById("tweet-input");

    if (tweetInput.value.trim() !== "") {
        tweetsData.unshift({
            handle: "@Scrimba",
            profilePic: "images/scrimbalogo.png",
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        });

        render();
    }

    tweetInput.value = "";
}

function getFeedHTML() {
    let feedHTML = ``;
    
    tweetsData.forEach(function(tweet) {
        
        const likeIconClass = tweet.isLiked ? "liked" : "";
        
        const retweetIconClass = tweet.isRetweeted ? "retweeted" : "";

        const {profilePic, handle, tweetText, uuid, replies, likes, retweets} = tweet;
        
        let repliesHTML = "";
        
        if (tweet.replies.length > 0) {
            tweet.replies.forEach(function(reply) {

                const {profilePic, handle, tweetText} = reply;

                repliesHTML += `
                    <div class="tweet-reply">
                        <div class="tweet-inner">
                            <img src="${profilePic}" class="profile-pic">
                                <div>
                                    <p class="handle">${handle}</p>
                                    <p class="tweet-text">${tweetText}</p>
                                </div>
                            </div>
                    </div>
                `;
            });
        }
        
          
        feedHTML += `
            <div class="tweet">
                <div class="tweet-inner">
                    <img src="${profilePic}" class="profile-pic">
                    <div>
                        <p class="handle">${handle}</p>
                        <p class="tweet-text">${tweetText}</p>
                        <div class="tweet-details">
                            <span class="tweet-detail">
                                <i class="fa-regular fa-comment-dots"
                                data-reply="${uuid}"
                                ></i>
                                ${replies.length}
                            </span>
                            <span class="tweet-detail">
                                <i class="fa-solid fa-heart ${likeIconClass}"
                                data-like="${uuid}"
                                ></i>
                                ${likes}
                            </span>
                            <span class="tweet-detail">
                                <i class="fa-solid fa-retweet ${retweetIconClass}"
                                data-retweet="${uuid}"
                                ></i>
                                ${retweets}
                            </span>
                        </div>   
                    </div>            
                </div>
                <div class="hidden" id="replies-${uuid}">
                    ${repliesHTML}
                </div>   
            </div>
        `;
   })

    return feedHTML; 
}

function render() {
    document.getElementById("feed").innerHTML = getFeedHTML();
}

render();
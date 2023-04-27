'use strict';
const logout = document.querySelector("#logout");
import { url } from '../../utils/url.js';

const getUserinfo = async () => {
  const sessionToken = sessionStorage.getItem('user');
  const user = JSON.parse(sessionToken);
  return user;
};

// Call the function to get the user ID
var user = await getUserinfo();
const postForm = document.querySelector('#post-form');
const dropdown = document.querySelector('select[name="dog_id"]');
const fetchOptions = {
  headers: {
    Authorization: 'Bearer ' + sessionStorage.getItem('token'),
  },
};
//Logout
logout.addEventListener("click", (evt) => {
  (async () => {
    try {
      const response = await fetch(url + '/auth/logout');
      const json = await response.json();
      console.log(json);
      // remove token
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      alert('You have logged out');
      location.href = 'login.html';
    } catch (e) {
      console.log(e.message);
    }
  })();
});

//Hakee kaikki postaukset ja laittaa ne UI
const response = await fetch(url + '/post', fetchOptions);
const posts = await response.json();
const postListDiv = document.getElementById('postList');
postListDiv.innerHTML = '';

posts.forEach(async (post) => {
  const response = await fetch(url + `/post/media/${post.post_id}`, fetchOptions);
  const images = await response.json();
  const response2 = await fetch(url + `/post/comments/${post.post_id}`, fetchOptions);
  const comments = await response2.json();
  const postArticle = document.createElement('article');
  postArticle.setAttribute('class', 'post');
  postArticle.setAttribute('id', post.post_id);
  postArticle.innerHTML = `
  <h2 style="display: none;">Postaus</h2>
  <article id="content">
    <h3 style="display: none;">Content</h3>
    <div class="slideshow-container">
      ${images.map((image, index) => `
        <div class="mySlides fade ${index > 0 ? 'hidden' : ''}">
          <img src="../../uploads/${image.media_name}" style="width:100%">
          <div class="text">${image.media_name}</div>
        </div>
      `).join('')}
      <a class="prev" onclick="plusSlides(-1, ${post.post_id})">❮</a>
      <a class="next" onclick="plusSlides(1, ${post.post_id})">❯</a>
    </div>
    <br>
    <div style="text-align:center">
      ${images.map((_, index) => `
        <span class="dot" onclick="currentSlide(${index + 1}, ${post.post_id})"></span>
      `).join('')}
    </div>
    <p>${post.content}</p>
    <div>
    <form id="likePost">
      <button type="submit" id="likeButton">Like</button>
      </form>
      <form id="comment-form">
        <input type="text" id="comment-field" placeholder="Add a comment">
        <button type="submit">Post comment</button>
      </form>
    </div>
    <div id="comment-section">
      ${comments.map(comment => `
      <div class="comment">
        <div class="commenter">
          <img src= "/../thumbnails/${comment.profile_image}">
          <p>${comment.username}</p>
        </div>
        <p class="comment-text">${comment.content}</p>
      </div>
      `).join('')}
    </div>
  </article>
`;
  postListDiv.appendChild(postArticle);
  const slideshowContainers = postArticle.querySelectorAll(".slideshow-container");
  slideshowContainers.forEach(container => {
    const slides = container.querySelectorAll(".mySlides");
    for (let i = 1; i < slides.length; i++) {
      slides[i].style.display = "none";
    }
  });
  //Lähettää kommentin
  const commentForm = postArticle.querySelector('#comment-form');
  commentForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const commentField = document.getElementById('comment-field');
    const commentText = commentField.value;
    commentField.value = '';
    try {
      const response = await fetch(url + `/post/postComment/${post.post_id}`, {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem('token'),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: commentText, user_id: user.user_id })
      });
      const commentSection = document.getElementById('comment-section');
      const newComment = `
      <div class="comment">
        <div class="commenter">
          <img src="/../thumbnails/${user.profile_image}">
          <p>${user.username}</p>
        </div>
        <p class="comment-text">${commentText}</p>
      </div>
    `;
      commentSection.insertAdjacentHTML('beforeend', newComment);
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  });
  const likePost = postArticle.querySelector('#likePost');
  //Liken lisääminen
  likePost.addEventListener('submit', async (evt) => {
    evt.preventDefault();
    const post_id = post.post_id;
    try {
      const response = await fetch(url + `/post/like/${user_id, post_id}`, {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem('token'),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user_id: user.user_id, post_id: post_id })
      });
      const like = await response.json();
      console.log(like);
    } catch (error) {
      console.error('Error adding comment:', error);
    }
    if (condition) {
      try {
        const response = await fetch(url + `/post/like/${post_id}`, {
          method: 'POST',
          headers: {
            Authorization: 'Bearer ' + sessionStorage.getItem('token'),
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ user_id: user.user_id, post_id: post_id })
        });
      } catch (error) {
        console.error('Error adding comment:', error);
      }
    } else {

    }

  });
});

//Hakee kaikki käyttäjän koirat listaa varten
const fetchUserDogs = async () => {
  try {
    const response = await fetch(url + `/dog/user/${user.user_id}`, fetchOptions);
    const dogs = await response.json();

    // add each dog to the dropdown menu
    dogs.forEach(dog => {
      const option = document.createElement('option');
      option.value = dog.dog_id;
      option.textContent = dog.name;
      dropdown.appendChild(option);
    });
  } catch (error) {
    console.error(error);
  }
};

fetchUserDogs();

// Create a new post and fetch all posts
postForm.addEventListener('submit', async (evt) => {
  evt.preventDefault();
  const formData = new FormData(postForm);
  const fetchOptions = {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + sessionStorage.getItem('token'),
    },
    body: formData,
  };
  const response = await fetch(url + '/post/' + user_id, fetchOptions);
  if (response.ok) {
    const newPost = await response.json();
    console.log('New post:', newPost);
    alert("New Post created!");
    window.location.reload();
  } else {
    console.error('Failed to create post');
  }
});
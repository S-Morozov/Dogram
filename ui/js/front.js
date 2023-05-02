'use strict';
const logout = document.querySelector("#logout");
import { url } from '../../utils/url.js';
var openModalBtn = document.getElementById("open-modal-btn");
var openProfile = document.getElementById("open-profile");
var modal = document.querySelector(".modal");
var closeModalBtn = document.querySelector("#close-modal-btn");


openModalBtn.addEventListener("click", () => {
  modal.classList.add("show-modal");
});

closeModalBtn.addEventListener("click", () => {
  modal.classList.remove("show-modal");
});
const formInputs = modal.querySelectorAll('input, textarea');

openProfile.addEventListener("click", () => {
  window.location.href = `./profile-page.html?id=${user.user_id}`;
});


//Poistaa ja lisää required kentiiin (Oli random error chromessa aina ko sulki modalin)
modal.addEventListener('click', (event) => {
  if (event.target.id === 'close-modal-btn' || event.target.classList.contains('modal')) {
    formInputs.forEach(input => {
      input.setAttribute('required', '');
    });
    formInputs.forEach(input => {
      input.removeAttribute('required');
    });
  }
});

//Hakee käyttäjän tiedot tokenista
const getUserinfo = async () => {
  const sessionToken = sessionStorage.getItem('user');
  const user = JSON.parse(sessionToken);
  return user;
};
var user = await getUserinfo();

const postForm = document.querySelector('#post-form');
const dropdown = document.querySelector('select[name="dog_id"]');
const fetchOptions = {
  headers: {
    Authorization: 'Bearer ' + sessionStorage.getItem('token'),
  },
};

//Registeröi koiran
const addDogForm = document.querySelector("#add-dog-form");
addDogForm.addEventListener('submit', async (evt) => {
  evt.preventDefault();
  const fd = new FormData(addDogForm);
  const fetchOptions = {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + sessionStorage.getItem('token'),
    },
    body: fd,
  };
  const response = await fetch(url + '/dog', fetchOptions);
  if (response.ok) {
    const json = await response.json();
    console.log('add response', json);
    location.href = 'front.html';
  }
});

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
      location.href = '../index.html';
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
  const response2 = await fetch(url + `/comment/${post.post_id}`, fetchOptions);
  const comments = await response2.json();
  const response3 = await fetch(url + `/like/${post.post_id}`, fetchOptions);
  const likes = await response3.json();
  const postArticle = document.createElement('article');
  postArticle.setAttribute('class', 'post fade-in');
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
      <a class="prev" onclick="plusSlides(-1, ${post.post_id})">⬅️</a>
      <a class="next" onclick="plusSlides(1, ${post.post_id})">➡️</a>
    </div>
    <br>
    <div style="text-align:center">
      ${images.map((_, index) => `
        <span class="dot" onclick="currentSlide(${index + 1}, ${post.post_id})"></span>
      `).join('')}
    </div>
    <p id="postText">${post.content}</p>
    <div>
    <form id="likePost">
    <button type="submit" id="likeButton">
    <span id="likeCount${post.post_id}">${likes}</span> Likes
    </button>
    </form>
      <form id="comment-form-${post.post_id}">
        <input type="text" id="comment-field-${post.post_id}" placeholder="Add a comment" required>
        <button type="submit">Post comment</button>
      </form>
    </div>
    <div id="comment-section-${post.post_id}">
      ${comments.map(comment => `
      <div class="comment">
        <div class="commenter">
          <img src= "/../thumbnails/${comment.profile_image}">
          <p><a href="./profile-page.html?id=${comment.user_id}">${comment.username}</a></p>
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
  // Lähettää kommentin
  const commentForm = postArticle.querySelector(`#comment-form-${post.post_id}`);
  const commentField = postArticle.querySelector(`#comment-field-${post.post_id}`);
  commentForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const commentText = commentField.value;
    commentField.value = '';
    try {
      const response = await fetch(url + `/comment/${post.post_id}`, {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem('token'),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: commentText, user_id: user.user_id })
      });
      if (response.ok) {
        const commentSection = document.getElementById(`comment-section-${post.post_id}`);
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
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  });
  //Lisää ja poistaa tykkäyksen
  const likePost = postArticle.querySelector('#likePost');
  const likeCount = postArticle.querySelector(`#likeCount${post.post_id}`);
  likePost.addEventListener('submit', async (evt) => {
    evt.preventDefault();
    try {
      const response = await fetch(url + `/like/${user.user_id},${post.post_id}`, {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem('token'),
          'Content-Type': 'application/json'
        }
      });
      const like = await response.json();
      if (like.length === 0) {
        try {
          const response = await fetch(url + `/like/${post.post_id},${user.user_id}`, {
            method: 'POST',
            headers: {
              Authorization: 'Bearer ' + sessionStorage.getItem('token'),
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user_id: user.user_id, post_id: post.post_id })
          });
          if (response.ok) {
            likeCount.textContent = parseInt(likeCount.textContent) + 1;
            alert("Like added!");
          }
        } catch (error) {
          console.error('Error adding comment:', error);
        }
      } else {
        try {
          const response = await fetch(url + `/like/${post.post_id},${user.user_id}`, {
            method: 'DELETE',
            headers: {
              Authorization: 'Bearer ' + sessionStorage.getItem('token'),
              'Content-Type': 'application/json'
            }
          });
          if (response.ok) {
            likeCount.textContent = parseInt(likeCount.textContent) - 1;
            alert("Like removed!");
          }
        } catch (error) {
          console.error('Error removing like:', error);
        }
      }
    } catch (error) {
      console.error('Error checking like status:', error);
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

// Luo uuden postauksen
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
  const response = await fetch(url + '/post/' + user.user_id, fetchOptions);
  if (response.ok) {
    const newPost = await response.json();
    console.log('New post:', newPost);
    alert("New Post created!");
    window.location.reload();
  } else {
    console.error('Failed to create post');
  }
});
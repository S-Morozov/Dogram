import { url } from '../../utils/url.js';
import * as userRoute from './check-login.js';

const postForm = document.querySelector('#post-form');
const dropdown = document.querySelector('select[name="dog_id"]');
let user_id = 0;
const fetchOptions = {
  headers: {
    Authorization: 'Bearer ' + sessionStorage.getItem('token'),
  },
};
//Hakee kaikki postaukset ja laittaa ne UI
const response = await fetch(url + '/post', fetchOptions);
const posts = await response.json();
const postListDiv = document.getElementById('postList');
postListDiv.innerHTML = '';
let mones = 0;
posts.forEach(async (post) => {
  const response2 = await fetch(url + `/post/media/${post.post_id}`, fetchOptions);
  const images = await response2.json();
  const postArticle = document.createElement('article');
  postArticle.setAttribute('class', 'post');
  postArticle.setAttribute('id', mones);

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
      <a class="prev" onclick="plusSlides(-1, ${mones})">❮</a>
      <a class="next" onclick="plusSlides(1, ${mones})">❯</a>
    </div>
    <br>
    <div style="text-align:center">
      ${images.map((_, index) => `
        <span class="dot" onclick="currentSlide(${index + 1}, ${mones})"></span>
      `).join('')}
    </div>
    <p>${post.content}</p>
  </article>
`;

  mones++;
  postListDiv.appendChild(postArticle);
  // hide all slides except the first one
  const slideshowContainers = postArticle.querySelectorAll(".slideshow-container");
  slideshowContainers.forEach(container => {
    const slides = container.querySelectorAll(".mySlides");
    for (let i = 1; i < slides.length; i++) {
      slides[i].style.display = "none";
    }
  });
});


// Fetch the user's dogs and add them to the dropdown menu
const fetchUserDogs = async () => {
  try {
    const sessionToken = sessionStorage.getItem('user');
    const user = JSON.parse(sessionToken);
    const username = user.username;
    const email = user.email;
    user_id = await userRoute.checkUserId(username, email);

    const response = await fetch(url + `/dog/user/${user_id}`, fetchOptions);
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
const createPost = async (data) => {
  const formData = new FormData();
  formData.append('content', data.content);
  const fileInput = document.querySelector('input[type="file"]');

  if (fileInput.files.length > 0) {
    for (let i = 0; i < fileInput.files.length; i++) {
      formData.append('file', fileInput.files[i]);
    }
  }

  const dogId = dropdown.value;
  formData.append('dog_id', dogId);
  formData.append('user_id', user_id);

  const response = await fetch(url + '/post', {
    method: 'POST',
    body: formData,
    ...fetchOptions,
  });
  console.log(formData);
  if (response.ok) {
    const newPost = await response.json();
    console.log('New post:', newPost);
    window.location.reload();
  } else {
    console.error('Failed to create post');
  }
};

postForm.addEventListener('submit', async (evt) => {
  evt.preventDefault();
  const formData = new FormData(postForm);
  await createPost(Object.fromEntries(formData.entries()));
});;
import { url } from '../../utils/url.js';
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");

//Hakee käyttäjän tiedot tokenista
const getUserinfo = async () => {
    const sessionToken = sessionStorage.getItem('user');
    const user = JSON.parse(sessionToken);
    return user;
};
var user = await getUserinfo();
console.log(user);

const galleryContainer = document.querySelector('.gallery');
const fetchOptions = {
    headers: {
        Authorization: 'Bearer ' + sessionStorage.getItem('token'),
    }
};
//Haetaan käyttäjän postaamat kuvat
const response = await fetch(url + '/post/user/' + id, fetchOptions);
const galleryItems = await response.json();
galleryItems.forEach(async (post) => {
    const response2 = await fetch(url + `/comment/${post.post_id}`, fetchOptions);
    const comments = await response2.json();
    const response3 = await fetch(url + `/like/${post.post_id}`, fetchOptions);
    const likes = await response3.json();
    const response = await fetch(url + `/post/media/${post.post_id}`, fetchOptions);
    const images = await response.json();
    console.log(images);
    const html = images.map(image => `
        <div class="gallery-item" tabindex="0">
            <img src="../../uploads/${image.media_name}" class="gallery-image" alt="${image.media_name}">
            <div class="gallery-item-info">
                <ul>
                    <li class="gallery-item-likes"><span class="visually-hidden">Likes:</span><i class="fas fa-heart" aria-hidden="true"></i> ${likes}</li>
                    <li class="gallery-item-comments"><span class="visually-hidden">Comments:</span><i class="fas fa-comment" aria-hidden="true"></i> ${comments.length}</li>
                </ul>
            </div>
        </div>
    `).join('');
    galleryContainer.innerHTML += html;
});

const container = document.querySelector('.container');

//Feikki dataa ei ollut aikaa
const followerCount = 188;
//Feikki dataa ei ollut aikaa
const followingCount = 206;

const html = `
  <div class="profile">
    <div class="profile-image">
      <img src="../../uploads/${user.profile_image}" alt="">
    </div>
    <div class="profile-user-settings">
      <h1 class="profile-user-name">${user.username}</h1>
      <button class="btn profile-edit-btn">Edit Profile</button>
      <button class="btn profile-settings-btn" aria-label="profile settings"><i class="fas fa-cog" aria-hidden="true"></i></button>
    </div>
    <div class="profile-stats">
      <ul>
        <li><span class="profile-stat-count">${galleryItems.length}</span> posts</li>
        <li><span class="profile-stat-count">${followerCount}</span> followers</li>
        <li><span class="profile-stat-count">${followingCount}</span> following</li>
      </ul>
    </div>
    <div class="profile-bio">
      <p><span class="profile-real-name">${user.username}</span> ${user.bio}</p>
    </div>
  </div>
`;

container.innerHTML = html;

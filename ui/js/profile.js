import { url } from '../../utils/url.js';
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");
console.log("Id on :", id);
const galleryContainer = document.querySelector('.gallery');

const fetchOptions = {
    headers: {
        Authorization: 'Bearer ' + sessionStorage.getItem('token'),
    }
};
const response = await fetch(url + '/post/' + id, fetchOptions);
const posts = await response.json();
if (posts.length > 0) {
    console.log("Yeah boy");
}
const galleryHTML = galleryItems.map(item => `
    <div class="gallery-item" tabindex="0">
        <img src="${item.imageUrl}" class="gallery-image" alt="${item.imageAlt}">
        <div class="gallery-item-info">
            <ul>
                <li class="gallery-item-likes"><span class="visually-hidden">Likes:</span><i class="fas fa-heart" aria-hidden="true"></i> ${item.likes}</li>
                <li class="gallery-item-comments"><span class="visually-hidden">Comments:</span><i class="fas fa-comment" aria-hidden="true"></i> ${item.comments}</li>
            </ul>
        </div>
    </div>
`).join('');

// Add the generated HTML to the gallery container
galleryContainer.innerHTML = galleryHTML;

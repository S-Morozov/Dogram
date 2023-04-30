const galleryContainer = document.querySelector('.gallery-container');

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

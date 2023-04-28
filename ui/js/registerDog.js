'use strict';
import { url } from '../../utils/url.js';
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
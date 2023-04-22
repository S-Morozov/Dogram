'use strict';
import { url } from '../../utils/url.js';
const addDogForm = document.querySelector("#add-dog-form");
addDogForm.addEventListener('submit', async (evt) => {
    evt.preventDefault();
    const data = serializeJson(addDogForm);
    const fetchOptions = {
        method: 'POST',
        headers: {
            Authorization: 'Bearer ' + sessionStorage.getItem('token'),
        },
        body: fd,
    };
    const response = await fetch(url + '/auth/registerDog', fetchOptions);
    const json = await response.json();
    if (json.error) {
        alert(json.error.message);
    } else {
        alert(json.message);
        //location.href = 'front.html';
    }
});
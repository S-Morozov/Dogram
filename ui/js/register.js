'use strict';
import {url} from '../../utils/url.js';
const addUserForm = document.querySelector("#add-user-form");
addUserForm.addEventListener('submit', async (evt) => {
    evt.preventDefault();
    const data = serializeJson(addUserForm);
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };
    const response = await fetch(url + '/auth/register', fetchOptions);
    const json = await response.json();
    if (json.error) {
      alert(json.error.message);
    } else {
      alert(json.message);
    }
  });
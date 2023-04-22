'use strict';
import { url } from '../../utils/url.js';
const addUserForm = document.querySelector("#add-user-form");
addUserForm.addEventListener('submit', async (evt) => {
  evt.preventDefault();
  const formData = new FormData(addUserForm);
  const fetchOptions = {
    method: 'POST',
    body: formData,
  };
  const response = await fetch(url + '/auth/register', fetchOptions);
  const json = await response.json();
  if (json.error) {
    alert(json.error.message);
  } else {
    alert(json.message);
  }
});
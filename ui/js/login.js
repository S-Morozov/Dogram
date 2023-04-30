'use strict';
import { url } from '../../utils/url.js';
const loginForm = document.querySelector('#login-form');
const addUserForm = document.querySelector("#add-user-form");
var openModalBtn = document.getElementById("open-modal-btn");
var modal = document.querySelector(".modal");
var closeModalBtn = document.querySelector("#close-modal-btn");

//Register formin käsittely
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
//Login formin käsittely
loginForm.addEventListener('submit', async (evt) => {
  evt.preventDefault();
  const data = serializeJson(loginForm);
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  };

  const response = await fetch(url + '/auth/login', fetchOptions);
  const json = await response.json();
  if (!json.user) {
    alert("Username / password wrong");
  } else {
    // save token and user
    sessionStorage.setItem('token', json.token);
    sessionStorage.setItem('user', JSON.stringify(json.user));
    location.href = "/ui/front.html";
  }
});

openModalBtn.addEventListener("click", function () {
  modal.classList.add("show-modal");
});

closeModalBtn.addEventListener("click", function () {
  modal.classList.remove("show-modal");
});

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

(async () => {
  // check sessionStorage
  if (!sessionStorage.getItem('token') || !sessionStorage.getItem('user')) {
    return;
  }
  // check if token valid
  try {
    const fetchOptions = {
      headers: {
        Authorization: 'Bearer ' + sessionStorage.getItem('token'),
      },
    };
    const response = await fetch(url + '/user/token', fetchOptions);
    if (!response.ok) {
      location.href = 'login.html';
    } else {
      const json = await response.json();
      sessionStorage.setItem('user', JSON.stringify(json.user));
    }
  } catch (e) {
    console.log(e.message);
  }
})();
(async () => {
  if (sessionStorage.getItem('token') || sessionStorage.getItem('user')) {
    location.href = 'front.html';
  }
})();

openModalBtn.addEventListener("click", function () {
  modal.classList.add("show-modal");
});

closeModalBtn.addEventListener("click", function () {
  modal.classList.remove("show-modal");
});

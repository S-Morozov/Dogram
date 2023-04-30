'use strict';
import { url } from '../../utils/url.js';
const loginForm = document.querySelector('#login-form');
const logout = document.querySelector("#logout");
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

const token = sessionStorage.getItem("token");
const user = sessionStorage.getItem("user");

//Logout
logout.addEventListener("click", (evt) => {
  (async () => {
    try {
      const response = await fetch(url + '/auth/logout');
      const json = await response.json();
      console.log(json);
      // remove token
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      alert('You have logged out');
      location.href = '../index.html';
    } catch (e) {
      console.log(e.message);
    }
  })();
});
//Piilottaa nappeja
if (token && user) {
  // show the logout menu item
  document.getElementById("logout").style.display = "block";
  document.getElementById("open-modal-btn").style.display = "none";
} else {
  // hide the logout menu item
  document.getElementById("logout").style.display = "none";
  document.getElementById("open-modal-btn").style.display = "block";
}

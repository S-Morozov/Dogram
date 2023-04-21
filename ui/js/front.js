'use strict';
const logout = document.querySelector("#logout")
import {url} from '../../utils/url.js';

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
    location.href = 'login.html';
  } catch (e) {
    console.log(e.message);
  }
})();
})

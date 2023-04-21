'use strict';
import {url} from '../../utils/url.js';
const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', async (evt) => {
    console.log("test");
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
    console.log(fetchOptions);
    const json = await response.json();
    console.log('login response', json);
    if (!json.user) {
      alert(json.message);
    } else {
      const user = {
        user_id: json.user.user_id,
        username: json.user.username,
        email: json.user.email
      };
      // save token
      sessionStorage.setItem('token', json.token);
      sessionStorage.setItem('user', JSON.stringify(user));  
      location.href = 'front.html';
    }
  });
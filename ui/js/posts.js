'use strict';
const logout = document.querySelector("#logout");
import { url } from '../../utils/url.js';

logout.addEventListener("click", (evt) => {
  (async () => {
    try {
      const response = await fetch(url + '/auth/logout');
      const json = await response.json();
    } catch (e) {
      console.log(e.message);
    }
  })();
});
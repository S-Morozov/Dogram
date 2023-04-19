'use strict';
const url = 'http://localhost:3000'; // change url when uploading to server

const ul = document.querySelector('ul');

const getCat = async () => {
  const response = await fetch(url + '/cat');
  const cats = await response.json();
  for (const cat of cats) {
    const user = await getUser(cat.owner);
    ul.innerHTML += `
    <li>
        <h2>${cat.name}</h2>
        <figure>
        <img src="../../uploads/${cat.filename}" class="resp">
        </figure>
        <p>Birthdate: ${cat.birthdate.substring(0,10)}</p>
        <p>Weight: ${cat.weight}kg</p>
        <p>Owner: ${cat.ownername}</p>
    </li>
    `;
  }
};

const getUser = async (id) => {
  const response = await fetch(url + '/user/' + id);
  const user = await response.json();
  return user;
};

getCat();
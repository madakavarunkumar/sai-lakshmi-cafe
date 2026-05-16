import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

const firebaseConfig = {
  apiKey: "AIzaSyDb5iLgpVampkzP1G2Y1lLEZDwEw0dhYUM",
  authDomain: "sai-lakshmi-cafe.firebaseapp.com",
  projectId: "sai-lakshmi-cafe",
  storageBucket: "sai-lakshmi-cafe.firebasestorage.app",
  messagingSenderId: "602856320749",
  appId: "1:602856320749:web:b60b9af0f9e0aa7e2aa6e4"
};

const app = initializeApp(firebaseConfig);

console.log("Firebase Connected");const sheetID = "1EKM11SlVZV8WnXFuc8a5gxaB3ccQN8u_z7b8ExvyKeg";

const url = `https://opensheet.elk.sh/${sheetID}/Sheet1`;

fetch(url)
  .then(res => res.json())
  .then(data => {

    const menuContainer = document.getElementById("menu-container");

    menuContainer.innerHTML = "";

    data.forEach(item => {

      menuContainer.innerHTML += `
        <div class="menu-card">
          <div class="menu-content">
            <h3>${item.Item}</h3>
            <p>₹${item.Price}</p>
          </div>
        </div>
      `;

    });

  });
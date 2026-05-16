import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore,
  collection,
  onSnapshot,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDb5iLgpVampkzP1G2Y1lLEZDwEw0dhYUM",
  authDomain: "sai-lakshmi-cafe.firebaseapp.com",
  projectId: "sai-lakshmi-cafe",
  storageBucket: "sai-lakshmi-cafe.firebasestorage.app",
  messagingSenderId: "602856320749",
  appId: "1:602856320749:web:b60b9af0f9e0aa7e2aa6e4"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const ordersContainer =
  document.getElementById("orders-container");

onSnapshot(collection(db, "orders"), (snapshot) => {

  ordersContainer.innerHTML = "";

  snapshot.forEach((docData) => {

    const order = docData.data();

    ordersContainer.innerHTML += `

      <div class="menu-card">

        <div class="menu-content">

          <h3>${order.item}</h3>

          <p>Name: ${order.customerName}</p>

          <p>Bench: ${order.bench}</p>

          <p>${order.requirements}</p>

          <p>Status: ${order.status}</p>

          <button onclick="acceptOrder('${docData.id}')">
            Accept
          </button>

        </div>

      </div>

    `;

  });

});

window.acceptOrder = async (id) => {

  const orderRef = doc(db, "orders", id);

  await updateDoc(orderRef, {

    status:"Accepted"

  });

};
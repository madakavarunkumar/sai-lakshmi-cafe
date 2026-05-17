import { initializeApp }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore,
  collection,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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

const orderSound =
  document.getElementById("newOrderSound");

let firstLoad = true;

onSnapshot(collection(db, "orders"), (snapshot) => {

  ordersContainer.innerHTML = "";

  if(!firstLoad){

    orderSound.play();

  }

  firstLoad = false;

  snapshot.forEach((docSnap) => {

    const data = docSnap.data();

    ordersContainer.innerHTML += `

      <div class="menu-card">

        <div class="menu-content">

          <h3>${data.item}</h3>

          <p>Customer: ${data.customerName}</p>

          <p>Bench: ${data.bench}</p>

          <p>Status: ${data.status}</p>

          <p>${data.requirements}</p>

          <button onclick="acceptOrder('${docSnap.id}')">
            Accept
          </button>

          <button onclick="rejectOrder('${docSnap.id}')">
            Reject
          </button>

          <button onclick="deleteOrder('${docSnap.id}')">
            Delete
          </button>

        </div>

      </div>

    `;

  });

});

window.acceptOrder = async (id) => {

  await updateDoc(doc(db, "orders", id), {

    status:"Accepted ✅"

  });

};

window.rejectOrder = async (id) => {
  
  const reason = prompt(
    "Enter Reject Reason"
  );
  
  await updateDoc(doc(db, "orders", id), {
    
    status: "Rejected ❌",
    reason: reason
    
  });
  
};

window.deleteOrder = async (id) => {

  const confirmDelete =
    confirm("Delete Order?");

  if(confirmDelete){

    await deleteDoc(doc(db, "orders", id));

  }

};
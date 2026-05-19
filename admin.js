const password =
prompt("Enter Admin Password");

if(password !== "12345"){

  document.body.innerHTML = `

    <h1 style="
      color:white;
      text-align:center;
      margin-top:100px;
      font-family:Poppins,sans-serif;
    ">

      Access Denied ❌

    </h1>

  `;

  throw new Error("Wrong Password");

}


/* FIREBASE IMPORTS */

import { initializeApp }

from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {

  getFirestore,

  collection,

  onSnapshot,

  updateDoc,

  deleteDoc,

  doc,

  query,

  orderBy

}

from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


/* FIREBASE CONFIG */

const firebaseConfig = {

  apiKey:
  "AIzaSyDb5iLgpVampkzP1G2Y1lLEZDwEw0dhYUM",

  authDomain:
  "sai-lakshmi-cafe.firebaseapp.com",

  projectId:
  "sai-lakshmi-cafe",

  storageBucket:
  "sai-lakshmi-cafe.firebasestorage.app",

  messagingSenderId:
  "602856320749",

  appId:
  "1:602856320749:web:b60b9af0f9e0aa7e2aa6e4"

};


/* INITIALIZE */

const app =
initializeApp(firebaseConfig);

const db =
getFirestore(app);


/* ELEMENTS */

const ordersContainer =
document.getElementById("orders-container");

const orderSound =
document.getElementById("newOrderSound");

const totalOrders =
document.getElementById("totalOrders");


/* VARIABLES */

let firstLoad = true;


/* LIVE ORDERS QUERY */

const ordersQuery =
query(

  collection(db, "orders"),

  orderBy("time", "desc")

);


/* LIVE ORDERS */

onSnapshot(ordersQuery,

(snapshot) => {

  ordersContainer.innerHTML = "";


  /* TOTAL ORDERS */

  if(totalOrders){

    totalOrders.innerText =
    snapshot.size;

  }


  /* SOUND */

  if(!firstLoad && snapshot.size > 0){

    orderSound.play();

  }

  firstLoad = false;


  /* NO ORDERS */

  if(snapshot.empty){

    ordersContainer.innerHTML = `

      <h2 style="
        color:white;
        text-align:center;
        width:100%;
      ">

        No Live Orders 📭

      </h2>

    `;

    return;

  }


  /* LOOP ORDERS */

  snapshot.forEach((docSnap) => {

    const data =
    docSnap.data();


    const quantity =
    data.quantity || 1;


    const statusClass =

      data.status.includes("Accepted")

      ? "accepted"

      : data.status.includes("Rejected")

      ? "rejected"

      : data.status.includes("Completed")

      ? "accepted"

      : "waiting";


    ordersContainer.innerHTML += `

      <div class="menu-card">

        ${
          data.image
          ?

          `<img
            src="${data.image}"
            alt="${data.item}"
          >`

          : ""
        }

        <div class="menu-content">

          <h3>

            ${data.item}

          </h3>

          <p>

            Quantity:
            ${quantity}

          </p>

          <p>

            Customer:
            ${data.customerName}

          </p>

          <p>

            Bench:
            ${data.bench}

          </p>

          <p class="${statusClass}">

            ${data.status}

          </p>

          ${
            data.requirements

            ?

            `<p>
              Extra:
              ${data.requirements}
            </p>`

            :

            ""
          }

          ${
            data.reason

            ?

            `<p>
              Reason:
              ${data.reason}
            </p>`

            :

            ""
          }

          <div style="
            display:flex;
            flex-wrap:wrap;
            gap:10px;
            margin-top:15px;
          ">

            <button
            onclick="acceptOrder('${docSnap.id}')">

              Accept

            </button>

            <button
            onclick="rejectOrder('${docSnap.id}')">

              Reject

            </button>

            <button
            onclick="completeOrder('${docSnap.id}')">

              Complete

            </button>

            <button
            onclick="deleteOrder('${docSnap.id}')">

              Delete

            </button>

          </div>

        </div>

      </div>

    `;

  });

});


/* ACCEPT ORDER */

window.acceptOrder =
async (id) => {

  try{

    await updateDoc(
      doc(db, "orders", id),
      {

        status: "Accepted ✅",

        reason: ""

      }
    );

  }

  catch(error){

    console.log(error);

    alert("Error accepting order");

  }

};


/* REJECT ORDER */

window.rejectOrder =
async (id) => {

  const reason =
  prompt("Enter Reject Reason");


  if(reason === null){

    return;

  }


  try{

    await updateDoc(
      doc(db, "orders", id),
      {

        status: "Rejected ❌",

        reason:
        reason || "Not Available"

      }
    );

  }

  catch(error){

    console.log(error);

    alert("Error rejecting order");

  }

};


/* COMPLETE ORDER */

window.completeOrder =
async (id) => {

  try{

    await updateDoc(
      doc(db, "orders", id),
      {

        status: "Completed ✅"

      }
    );


    setTimeout(async () => {

      try{

        await deleteDoc(
          doc(db, "orders", id)
        );

      }

      catch(error){

        console.log(error);

      }

    }, 5000);

  }

  catch(error){

    console.log(error);

    alert("Error completing order");

  }

};


/* DELETE ORDER */

window.deleteOrder =
async (id) => {

  const confirmDelete =
  confirm("Delete Order?");


  if(confirmDelete){

    try{

      await deleteDoc(
        doc(db, "orders", id)
      );

    }

    catch(error){

      console.log(error);

      alert("Error deleting order");

    }

  }

};
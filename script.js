import { initializeApp }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  doc,
  onSnapshot
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


const firebaseConfig = {

  apiKey: "AIzaSyDb5iLgpVampkzP1G2Y1lLEZDwEw0dhYUM",

  authDomain: "sai-lakshmi-cafe.firebaseapp.com",

  projectId: "sai-lakshmi-cafe",

  storageBucket:
  "sai-lakshmi-cafe.firebasestorage.app",

  messagingSenderId:
  "602856320749",

  appId:
  "1:602856320749:web:b60b9af0f9e0aa7e2aa6e4"

};


const app = initializeApp(firebaseConfig);

const db = getFirestore(app);


/* SHEET */

const sheetID =
"1EKM11SlVZV8WnXFuc8a5gxaB3ccQN8u_z7b8ExvyKeg";

const url =
`https://opensheet.elk.sh/${sheetID}/Sheet1`;


/* ELEMENTS */

const popup =
document.getElementById("popup");

const menuContainer =
document.getElementById("menu-container");

const ordersStatus =
document.getElementById("ordersStatus");

const benchSelect =
document.getElementById("benchNumber");

const customBenchInput =
document.getElementById("customBench");

const searchInput =
document.getElementById("searchInput");

const orderCount =
document.getElementById("orderCount");


/* VARIABLES */

let selectedItem = "";

let selectedQty = 1;


/* LOAD MENU */

/* LOAD MENU */

function loadMenu() {
  
  fetch(url)
    
    .then(res => res.json())
    
    .then(data => {
      
      displayMenu(data);
      
    })
    
    .catch(error => {
      
      console.log(error);
      
    });
  
}

/* FIRST LOAD */

loadMenu();

/* AUTO REFRESH */

setInterval(() => {
  
  if (
    popup.style.display !== "flex"
  ) {
    
    loadMenu();
    
  }
  
}, 10000);
/* DISPLAY MENU */

function displayMenu(data){

  menuContainer.innerHTML = "";

  data.forEach(item => {

    menuContainer.innerHTML += `

      <div class="menu-card">

        <img
        src="${item.Image}"
        alt="${item.Item}">

        <div class="menu-content">

          <h3>${item.Item}</h3>

          <p>₹${item.Price}</p>

          <div class="quantity-box">

            <button class="qty-btn minus">
              -
            </button>

            <span class="qty">
              1
            </span>

            <button class="qty-btn plus">
              +
            </button>

          </div>

          <button
          class="order-btn">

            Order Now

          </button>

        </div>

      </div>

    `;

  });

}


/* BENCH SELECT */

benchSelect.addEventListener("change", () => {

  if(benchSelect.value === "Other"){

    customBenchInput.style.display =
    "block";

  }

  else{

    customBenchInput.style.display =
    "none";

  }

});


/* QUANTITY BUTTONS */

document.addEventListener("click", (e) => {

  if(e.target.classList.contains("plus")){

    const qtyElement =
    e.target.parentElement
    .querySelector(".qty");

    let qty =
    Number(qtyElement.innerText);

    qty++;

    qtyElement.innerText = qty;

  }


  if(e.target.classList.contains("minus")){

    const qtyElement =
    e.target.parentElement
    .querySelector(".qty");

    let qty =
    Number(qtyElement.innerText);

    if(qty > 1){

      qty--;

      qtyElement.innerText = qty;

    }

  }

});


/* OPEN POPUP */

document.addEventListener("click", (e) => {

  if(e.target.classList.contains("order-btn")){

    popup.style.display = "flex";

    const parent =
    e.target.parentElement;

    selectedItem =
    parent.querySelector("h3").innerText;

    selectedQty =
    Number(
      parent.querySelector(".qty")
      .innerText
    );

  }

});


/* CLOSE POPUP */

document.getElementById("closePopup")

.addEventListener("click", () => {

  popup.style.display = "none";

});


/* SUBMIT ORDER */

document.getElementById("submitOrder")

.addEventListener("click", async () => {

  const customerName =
  document.getElementById("customerName").value;

  let bench =
  document.getElementById("benchNumber").value;

  const customBench =
  document.getElementById("customBench").value;

  const requirements =
  document.getElementById("requirements").value;


  if(bench === "Other"){

    bench = customBench;

  }


  if(customerName === "" || bench === ""){

    alert("Please fill all details");

    return;

  }


  try{

    const orderRef =
    await addDoc(collection(db, "orders"), {

      customerName,

      bench,

      requirements,

      item: selectedItem,

      quantity: selectedQty,

      status: "Waiting ⏳",

      time: new Date()

    });


    let savedOrders =
    JSON.parse(
      localStorage.getItem("myOrders")
    ) || [];


    savedOrders.push(orderRef.id);


    localStorage.setItem(
      "myOrders",
      JSON.stringify(savedOrders)
    );


    alert(
      "Order Submitted Successfully 🔥"
    );


    popup.style.display = "none";


    document.getElementById(
      "customerName"
    ).value = "";

    document.getElementById(
      "benchNumber"
    ).value = "";

    document.getElementById(
      "customBench"
    ).value = "";

    document.getElementById(
      "requirements"
    ).value = "";


    customBenchInput.style.display =
    "none";

  }

  catch(error){

    console.log(error);

    alert("Error submitting order");

  }

});


/* SHOW CUSTOMER ORDERS */

function listenMyOrders(){

  const savedOrders =
  JSON.parse(
    localStorage.getItem("myOrders")
  ) || [];


  if(orderCount){

    orderCount.innerText =
    savedOrders.length;

  }


  if(savedOrders.length === 0){

    ordersStatus.innerHTML =
    "<p>No Active Orders</p>";

    return;

  }


  ordersStatus.innerHTML = "";


  savedOrders.forEach((orderId) => {

    const orderRef =
    doc(db, "orders", orderId);

    const orderBox =
    document.createElement("div");

    orderBox.style.marginBottom =
    "15px";

    orderBox.style.borderBottom =
    "1px solid #444";

    orderBox.style.paddingBottom =
    "10px";


    ordersStatus.appendChild(orderBox);


    onSnapshot(orderRef, (snapshot) => {

  if(!snapshot.exists()){

    orderBox.remove();

    return;

  }
        const data =
        snapshot.data();


        orderBox.innerHTML = `

          <p>

            <b>${data.item}</b>

          </p>

          <p>

            Quantity:
            ${data.quantity || 1}

          </p>

          <p class="${
            data.status.includes("Accepted")
            ? "accepted"

            : data.status.includes("Rejected")
            ? "rejected"

            : "waiting"
          }">

            ${data.status}

          </p>

          ${
            data.reason
            ?

            `<p>
              Reason:
              ${data.reason}
            </p>`

            : ""
          }

          <p class="order-time">

            Live Status Updating...

          </p>

        `;

      }

    });

  });

}


/* START */

listenMyOrders();
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  doc,
  onSnapshot
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

const sheetID = "1EKM11SlVZV8WnXFuc8a5gxaB3ccQN8u_z7b8ExvyKeg";

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

            <button class="order-btn">
              Order Now
            </button>

          </div>

        </div>
      `;

    });

  });
  const popup = document.getElementById("popup");
  const benchSelect =
  document.getElementById("benchNumber");

const customBench =
  document.getElementById("customBench");

benchSelect.addEventListener("change", () => {

  if(benchSelect.value === "Other"){

    customBench.style.display = "block";

  }else{

    customBench.style.display = "none";

  }

});

document.getElementById("closePopup")
.addEventListener("click", () => {

  popup.style.display = "none";

});
let selectedItem = "";

document.addEventListener("click", (e) => {

  if(e.target.classList.contains("order-btn")){

    popup.style.display = "flex";

    selectedItem =
      e.target.parentElement.querySelector("h3").innerText;

  }

});

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

  if(
    customerName === "" ||
    bench === ""
  ){
    alert("Please fill all details");
    return;
  }

  try{

    const orderRef = await addDoc(collection(db, "orders"), {

      customerName,
      bench,
      requirements,
      item:selectedItem,
      status:"Waiting",
      time:new Date()

    });

    alert("Order Submitted Successfully 🔥");
    localStorage.setItem("orderId", orderRef.id);
    listenMyOrder(orderRef.id);


    popup.style.display = "none";
document.getElementById("customerName").value = "";

document.getElementById("benchNumber").value = "";

document.getElementById("customBench").value = "";

document.getElementById("requirements").value = "";

customBench.style.display = "none";
  }catch(error){

    alert("Error submitting order");

    console.log(error);

  }

});


const ordersStatus =
  document.getElementById("ordersStatus");

function listenMyOrder(orderId){

  const orderRef =
    doc(db, "orders", orderId);

  onSnapshot(orderRef, (snapshot) => {

    if(snapshot.exists()){

      const data = snapshot.data();

      ordersStatus.innerHTML = `

        <div style="
          margin-bottom:15px;
          border-bottom:1px solid #444;
          padding-bottom:10px;
        ">

          <p>
            <b>${data.item}</b>
          </p>

          <p>
            ${data.status}
          </p>

          ${
            data.reason
            ?
            `<p>Reason: ${data.reason}</p>`
            :
            ""
          }

        </div>

      `;

    }

  });

}
const savedOrderId =
  localStorage.getItem("orderId");

if(savedOrderId){

  listenMyOrder(savedOrderId);

}
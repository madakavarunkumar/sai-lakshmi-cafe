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
          </div>
        </div>
      `;

    });

  });
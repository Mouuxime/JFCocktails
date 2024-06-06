let usedState = false;
let isConnected = false;

const boissons = [
  "Sunrise Splash",
  "Tropical Breeze",
  "Apple Pine Delight",
  "Cranberry Sunset",
  "Island Orchid",
  "Tropical CranApple",
];

const ingredients = {
  "Sunrise Splash":
    "50% de jus d'orange, 25% de jus d'ananas, 25% de jus de cranberry",
  "Tropical Breeze":
    "Même quantité de jus d'ananas, jus d'orange et de jus de pomme",
  "Apple Pine Delight":
    "25% de jus d'orange, 25% de jus d'ananas puis 50% de jus de pomme",
  "Cranberry Sunset":
    "25% de jus d'orange, 25% de jus d'ananas, 50% de jus de cranberry",
  "Island Orchid":
    "Même quantité de jus d'ananas, jus de pomme et jus de cranberry",
  "Tropical CranApple":
    "Même quantité de jus d'ananas, jus de pomme et jus de cranberry",
};

const images = {
  "Sunrise Splash": "../images/cocktail1.jpg",
  "Tropical Breeze": "../images/cocktail2.jpg",
  "Apple Pine Delight": "../images/cocktail3.jpg",
  "Cranberry Sunset": "../images/cocktail4.png",
  "Island Orchid": "../images/cocktail5.png",
  "Tropical CranApple": "../images/cocktail6.png",
};

var popup = document.getElementById("loginPopup");
popup.style.display = "none";

document.addEventListener("DOMContentLoaded", function () {
  var buttons = document.querySelectorAll(".btn-primary");

  buttons.forEach(function (button, index) {
    button.addEventListener("click", function () {
      if (usedState == false) {
        var info;
        switch (index) {
          case 0:
            info = "Sunrise Splash";
            break;
          case 1:
            info = "Tropical Breeze";
            break;
          case 2:
            info = "Apple Pine Delight";
            break;
          case 3:
            info = "Cranberry Sunset";
            break;
          case 4:
            info = "Island Orchid";
            break;
          case 5:
            info = "Tropical CranApple";
            break;
          default:
            info = "None";
        }

        // Send the information to Node-RED using AJAX
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "http://localhost:1880/endpoint", true);
        xhr.setRequestHeader("Content-Type", "application/json");
        alert("Commande envoyée.");
        usedState = true;
        xhr.onload = function () {
          if (xhr.status >= 200 && xhr.status < 300) {
            // Success! Handle the response from the server
            var response = JSON.parse(xhr.responseText);
            alert("Boisson prête");
            usedState = false;
          } else {
            // Request failed
            alert("Request failed with status:", xhr.status);
            usedState = false;
          }
        };

        xhr.onerror = function () {
          alert("Network error occurred");
          usedState = false;
        };

        // Send the request with the JSON payload
        xhr.send(JSON.stringify({ cocktail: info, user: "ardox" }));
      } else {
        alert("une commande est deja en cours");
      }
    });
  });
});

function toggleLogin() {
  var popup = document.getElementById("loginPopup");
  if (popup.style.display === "block") {
    popup.style.display = "none";
  } else {
    popup.style.display = "block";
  }
}

function submitLogin() {
  var username = document.getElementById("username").value;
  var password = document.getElementById("password").value;

  // Create a JSON object with username and password
  var credentials = {
    user: username,
    passwd: password,
  };

  // Make an HTTP POST request to your Node-RED server
  fetch("http://localhost:1880/login-endpoint", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.data == "success") {
        console.log(data);
        alert("Login successful!");
        toggleLogin();
        isConnected = true;
        showName(data.name, data.favdrink);
      } else {
        alert("Invalid username or password. Please try again.");
        console.log(data);
        isConnected = false;
        showName(null);
      }
    });
}

function submitRegister() {
  var username = document.getElementById("username").value;
  var password = document.getElementById("password").value;

  // Create a JSON object with username and password
  var credentials = {
    user: username,
    passwd: password,
  };
  // Make an HTTP POST request to your Node-RED server
  fetch("http://localhost:1880/register-endpoint", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.data == "success") {
        console.log(data);
        alert("Profil créé!");
        toggleLogin();
        isConnected = true;
        showName(data.name, data.favdrink);
      } else {
        alert("Identifiants invalides.");
        console.log(data);
        isConnected = false;
        showName(null);
      }
    });
}


function showName(name, favdrink) {
  var text = document.getElementById("nameHeaderText");
  if (name) text.innerText = "Bienvenue, " + name;
  if (favdrink) {
    var favcard = document.createElement("div");
    favcard.innerHTML = `
    <div class="food-menu-box";">
        <div class="food-menu-img">
            <img src="${images[favdrink]}"
                alt=""
                class="img-responsive img-curve">
        </div>

        <div class="food-menu-desc">
            <h4 style="color: #ff6b81;">Favoris: ${favdrink}</h4>
            <p class="food-price"></p>
            <p class="food-detail">
                ${ingredients[favdrink]}
            </p>
            <br>

            <a href="#" class="btn btn-primary">Commander</a>
        </div>`;
    document.getElementById("favCard").appendChild(favcard);
  }

  const random = Math.floor(Math.random() * boissons.length);
  const recommended = boissons[random];
  if (favdrink && name) {
    var recocard = document.createElement("div");
    recocard.innerHTML = `
    <div class="food-menu-box";">
        <div class="food-menu-img">
            <img src="${images[recommended]}"
                alt=""
                class="img-responsive img-curve">
        </div>

        <div class="food-menu-desc">
            <h4 style="color: #70cc81;">Recommandé: ${recommended}</h4>
            <p class="food-price"></p>
            <p class="food-detail">
                ${ingredients[recommended]}
            </p>
            <br>

            <a href="#" class="btn btn-primary">Commander</a>
        </div>`;
    document.getElementById("recoCard").appendChild(recocard);
  }
}

function logout() {
  var text = document.getElementById("nameHeaderText");
  text.innerText = null;
  var favcard = document.createElement("div");
  favcard.innerHTML = null;
  document.getElementById("favCard").replaceWith(favcard);
  var recocard = document.createElement("div");
  recocard.innerHTML = null
  document.getElementById("recoCard").replaceWith(recocard)
  isConnected = false;
}

showName(null);

// declare variables
let username = localStorage.getItem("username") || "";
let signedIn = username !== "";

// Makes verible useable anywhere
window.playerName = username;

// popup 
const popup = document.createElement("div");
popup.style = `
  position: fixed;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  background: #222;
  color: white;
  padding: 20px;
  border-radius: 10px;
  width: 240px;
  text-align: center;
  display: none;
  z-index: 9999;
`;

popup.innerHTML = `
  <h3 style="margin-bottom:10px;">Sign In</h3>
  <input id="popupInput" maxlength="8" placeholder="Username" 
         style="width:90%;padding:6px;border-radius:5px;border:none;text-align:center;">
  <br>
  <button id="popupSubmit" 
          style="margin-top:12px;padding:6px 15px;background:#0d6efd;color:white;border:none;border-radius:5px;cursor:pointer;">
    Submit
  </button>
`;

document.body.appendChild(popup);

const input = popup.querySelector("#popupInput");
const submit = popup.querySelector("#popupSubmit");

// saves button to variable
const button = document.getElementById("signin-btn");

function updateIcon() {
  if (signedIn) {
    button.innerHTML = '<i class="bi bi-box-arrow-right fs-3 text-danger"></i>';
  } else {
    button.innerHTML = '<i class="bi bi-person-circle fs-3 text-white"></i>';
  }
}

updateIcon();

// if clicked, runs function
function signInLogic(){
  if (!signedIn) {
    popup.style.display = "block";
    input.value = "";
    input.focus();
  } else {
    // ask if they want to sign out
    if (confirm("Do you want to sign out, " + username + "?")) {
      signedIn = false;
      username = "";
      window.playerName = "";

      localStorage.removeItem("username");

      updateIcon();
    }
  }
}

submit.onclick = function () {
  let name = input.value.trim();

  if (name === "") {
    alert("Username cannot be empty!");
    return;
  }

  // Save user
  username = name;
  signedIn = true;
  window.playerName = name;

  localStorage.setItem("username", name);

  popup.style.display = "none";
  updateIcon();
};

// adds event listener to button
button.addEventListener("click", signInLogic);

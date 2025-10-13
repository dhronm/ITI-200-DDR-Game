// declare variables
let signedIn = false;
let username = "";

// saves button to variable
const button = document.getElementById("signin-btn");

// if clicked, runs function
function signInLogic(){
  if (!signedIn) {
    // ask for the user's name
    username = prompt("Enter your name to sign in:");
    if (username){
      alert("Welcome, " + username + "!");
      signedIn = true;
      // changes signin logo to visually indicate they're signed in
      this.innerHTML = '<i class="bi bi-box-arrow-right fs-3 text-danger"></i>';
    }
  } else {
    // ask if they want to sign out
    let confirmSignOut = confirm("Do you want to sign out, " + username + "?");
    if (confirmSignOut) {
      alert("Goodbye, " + username + "!");
      signedIn = false;
      username = "";
      // reset icon back to default
      this.innerHTML = '<i class="bi bi-person-circle fs-3 text-white"></i>';
    }
  }
};

// adds event listener to button
button.addEventListener("click", signInLogic);

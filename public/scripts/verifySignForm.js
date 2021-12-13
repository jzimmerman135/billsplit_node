function validateSignUp() {
     err = false;
     var user = /^[a-z0-9]+$/i;
     var emailCheck = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
     // Verification for sign up text boxes
     username = document.data.username.value;
     pass = document.data.pass.value;
     first = document.data.fname.value;
     last = document.data.lname.value;
     email = document.data.email.value;
     if (username == "" || !user.test(username) || username.includes(" ")) {
          err = true;
          show("usernameVerify");
     } else {
          hide("usernameVerify");
     }
     if (pass == "" || (pass.length < 8) || pass.includes(" ")) {
          err = true;
          show("passVerify");
     } else {
          hide("passVerify");
     }
     if (first == "" || first.includes(" ")) {
          err = true;
          show("fnameVerify");
     } else {
          hide("fnameVerify");
     }
     if (last == "" || last.includes(" ")) {
          err = true;
          show("lnameVerify");
     } else {
          hide("lnameVerify");
     }
     if (email == "" || !emailCheck.test(email) || email.includes(" ")) {
          err = true;
          show("emailVerify");
     } else {
          hide("emailVerify");
     }

     return !err
}

function validateSignIn() {
     err = false;
     user = document.data.username.value;
     pass = document.data.pass.value;
     // Verification for sign in text boxes
     if (user == "" || pass == "" || user.includes(" ") || pass.includes(" ")) {
          err = true;
          show("logVal1");
     } else {
          hide("logVal1");
     }
     return !err
}

function validateContact() {
     err = false;
     // Verification for sign in text boxes
     var user = /^[a-z0-9]+$/i;
     var emailCheck = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
     username = document.data.username.value;
     email = document.data.email.value;
     msg = document.data.message.value;
     // Verification for sign up text boxes
     if (username == "" || !user.test(username) || username.includes(" ")) {
          err = true;
          show("usernameVerify");
     } else {
          hide("usernameVerify");
     }
     if (email == "" || !emailCheck.test(email) || email.includes(" ")) {
          err = true;
          show("emailVerify");
     } else {
          hide("emailVerify");
     }
     if (msg == "") {
          err = true;
          show("messVerify");
     } else {
          hide("messVerify");
     }

     return !err
}

// These functions show the error message associated with the id
function hide(id) {
     document.getElementById(id).style.display = "none";
}

function show(id) {
     document.getElementById(id).style.display = "inline-block";
}


// MongoDB interactions
function insertInfo(jsonInfo) {
     alert(jsonInfo);
}

function checkLogin(username, password) {
     alert(username + " " + password);
}

function insertMsg(jsonMsg) {
     alert(jsonMsg);
}

function showPassword() {
     var x = document.getElementsByName("pass")[0];
  if (x.type === "password") {
    x.type = "text";
  } else {
    x.type = "password";
  }
}
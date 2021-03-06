function validateSignUp() {
     err = false;
     var user = /^[a-z0-9]+$/i;
     var emailCheck = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
     // Verification for sign up text boxes
     username = sanitize(document.data.username.value);
     pass = sanitize(document.data.pass.value);
     first = sanitize(document.data.fname.value);
     last = sanitize(document.data.lname.value);
     email = sanitize(document.data.email.value);
     if (username == "" || !user.test(username)) {
          err = true;
          show("usernameVerify");
     } else {
          hide("usernameVerify");
     }
     if (pass == "" || (pass.length < 8)) {
          err = true;
          show("passVerify");
     } else {
          hide("passVerify");
     }
     if (first == "") {
          err = true;
          show("fnameVerify");
     } else {
          hide("fnameVerify");
     }
     if (last == "") {
          err = true;
          show("lnameVerify");
     } else {
          hide("lnameVerify");
     }
     if (email == "" || !emailCheck.test(email)) {
          err = true;
          show("emailVerify");
     } else {
          hide("emailVerify");
     }

     return !err
}

function validateSignIn() {
     err = false;
     user = sanitize(document.data.username.value);
     pass = sanitize(document.data.pass.value);
     // Verification for sign in text boxes
     if (user == "" || pass == "") {
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
     username = sanitize(document.data.username.value);
     email = sanitize(document.data.email.value);
     msg = sanitize(document.data.message.value);
     // Verification for sign up text boxes
     if (username == "" || !user.test(username)) {
          err = true;
          show("usernameVerify");
     } else {
          hide("usernameVerify");
     }
     if (email == "" || !emailCheck.test(email)) {
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
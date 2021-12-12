var express = require('express');
const ejs = require('ejs');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const encrypt = require('./SHAcrypt.js');

const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://user:db1@billsplit.6feyv.mongodb.net/billsplit?retryWrites=true&w=majority";

const port = 8080;

const app = express();
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.listen(port);

/*******************************
 *        static links
 *******************************/

app.get('/', function (req, res) {
     res.render('pages/index');
});

app.get('/calculator', function (req, res) {
     res.render('./pages/fullCalculator');
});

app.get('/pro', function (req, res) {
     res.render('./pages/pro');
});

app.get('/about', function (req, res) {
     res.render('./pages/aboutUs');
});

app.get('/signIn', function (req, res) {
     res.render('./pages/signIn');
});

app.get('/signUp', function (req, res) {
     res.render('./pages/signup');
});

app.get('/contact', function (req, res) {
     res.render('./pages/contactUs');
});

/*******************************
 *    cookie dependent links
 *******************************/

// app.get('/history', function (req, res) {
//     cookieUser = "jzimm135" // get the hashed user cookie
//     MongoClient.connect(url, { useUnifiedTopology: true }, function (err, db) {
//         if (err) {
//             return "Error: not found";
//         }

//         var dbo = db.db("billsplit");
//         var coll = dbo.collection('receiptInfo');
//         theQuery = {}

//         coll.find(theQuery).toArray(function (err, items) {
//             if (err) {
//                 console.log("Error: " + err); // render error page
//             }
//             for (i = 0; i < items.length; i++) {
//                 for (y = 0; y < items[i].people.length; y++) {
//                     if (((items[i].people)[y].username) == cookieUser) {
//                         console.log(items[i]); // items[i] is the JSON of each user's receipt
//                     }
//                 }
//             }
//             db.close();
//         });
//     });
//     req.cookies;
//     // get method auto sends cookie to querystring
//     // server gets cookie from querystring
//     // server uses cookie to find all matching receipts
//     var receipts = [];
//     res.render('./pages/history', {
//         allReceipts: receipts
//     });
// });

// /*******************************
//  *    form processing links
//  *******************************/

// TODO: REPLACE CONSOLE LOG MESSAGES W/ COMMENTS WITH RES.RENDER OF THEIR RESPECTIVE PAGE AND
// GET THE COOKIE STUFF AND SET THAT EQUAL TO WHATEVER I COMMENTED
// OPTIONAL: USE HASH FUNCTION THE USERNAMES AND PASSWORD WHERE IT SAYS TO

app.post('/save', function (req, res) {
     // Delete variables below + delete userobj variable if you already have JSON
     // and set userObj = [JSON]
     userObj = req.body;
     console.log(data);
     MongoClient.connect(url, function (err, db) {
          if (err) {
               console.log("not working") //database problem pls try again later
          }
          var dbo = db.db("billsplit");
          var coll = dbo.collection('receiptInfo');
          coll.insertOne(userObj, function (err, res) {
               if (err) {
                    console.log("not put in correctly"); //database problem pls try again later
               }
               else {
                    console.log("success"); // successful login
               }
          })
          db.close
     });
});

app.post('/createUser', function (req, res) {
     var userObj = req.body;
     console.log(userObj);
     userObj.username = userObj.username // use hash function on right variable
     userObj.pass = userObj.pass; // use hash function on right variable
     MongoClient.connect(url, function (err, db) {
          if (err) {
               console.log("db not working") //database problem pls try again later
          }
          var dbo = db.db("billsplit");
          var coll = dbo.collection('userInfo');
          coll.createIndex({ username: 1 }, { unique: true });
          coll.insertOne(userObj, function (err, res) {
               if (err) {
                    console.log("db not working") //database problem pls try again later
               }
               else {
                    console.log("success"); // successful
                    // cookieUser = userObj.username; get cookie user variable set hashed cookie user to whatever we got
               }
          })
          db.close
     });
});

app.post('/logIn', function (req, res) {
     var data = req.body;
     console.log(data)
     user = userObj.username // use hash function on right variable
     pass = userObj.pass; // use hash function on right variable
     MongoClient.connect(url, { useUnifiedTopology: true }, function (err, db) {
          if (err) {
               console.log("db not working") //database problem pls try again later
          }
          var loggedIn = false;
          var dbo = db.db("billsplit");
          var coll = dbo.collection('userInfo');
          theQuery = { username: user }

          coll.find(theQuery).toArray(function (err, items) {
               if (err) {
                    console.log("db not working") //database problem pls try again later
               } else {
                    console.log(items);
                    for (i = 0; i < items.length; i++) {
                         if (items[i].password == pass) {
                              loggedIn = true;
                              console.log("logged in")
                              // cookieUser = userObj.username; get cookie user variable set hashed cookie user to whatever we got
                         }
                    }
               }
               db.close();
          });
          if (loggedIn) {
               console.log("logged In") // log in success
          }
          else {
               console.log("login failed") // log in failed
          }
     });
});

app.post('/sendMessage', function (req, res) {
     var userObj = req.body;
     console.log(userObj);
     userObj.username = userObj.username // use hash function on right variable
     MongoClient.connect(url, function (err, db) {
          if (err) {
               console.log("db not working") //database problem pls try again later
          }
          var dbo = db.db("billsplit");
          var coll = dbo.collection('contactInfo');
          coll.insertOne(userObj, function (err, res) {
               if (err) {
                    console.log("db not working") //database problem pls try again later
               }
               else {
                    console.log("success"); // successful
               }
          })
          db.close
     });
});

/* Kev's == operator version */
// app.post('/logIn', function (req, res) {
//     var data = req.body;

//     user = data.username; // Use get and then use encrypt function
//     rawPass = data.pass; // Use get and then use encrypt function
//     hashedUser = "guest"; // cookie
//     pass = hash(password); //NON FUNCTIONING!!!!!! for now
//     MongoClient.connect(url, { useUnifiedTopology: true }, function (err, db) {
//         if (err) {
//             return "Error: not found";
//         }

//         var dbo = db.db("billsplit");
//         var coll = dbo.collection('userInfo');
//         theQuery = { username: user }
//         coll.find(theQuery).toArray(function (err, items) {
//             if (err) {
//                 console.log("Error: " + err);
//             } else {
//                 console.log(items);
//                 for (i = 0; i < items.length; i++) {
//                     if (items[i].password == pass) {
//                         console.log("log in success");
//                         hashedUser = items[i].username; // sets cookie username to logged in username
//                         // render welcome page
//                         res.render('./pages/message', {
//                             line1 : "Welcome, " + data.username + ".",
//                             line2 : "You are logged in.",
//                             username : data.username, //this will be automatically hashed by the storeUsername function
//                             saveUsernameCookie: true,
//                             returnWhere : "Home",
//                             returnHREF : "/"
//                         });
//                     }
//                 }
//                 if (hashedUser == "guest") {
//                     console.log("log in unsuccessful");
//                     // render incorrect login
//                     res.render('./pages/message', {
//                         line1 : "Your username or password is incorrect",
//                         line2 :  "Please try again",
//                         username : data.username,
//                         saveUsernameCookie: false,
//                         returnWhere : "Sign In",
//                         returnHREF : "/signIn"
//                     });
//                 }
//             }
//             console.log(hashedUser);
//             db.close();
//         });
//     });
// });
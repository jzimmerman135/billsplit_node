var express = require('express');
const ejs = require('ejs');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const encrypt = require('./SHAcrypt.js');

const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://user:db1@billsplit.6feyv.mongodb.net/billsplit?retryWrites=true&w=majority";

const port = process.env.PORT || 5000;

const app = express();
app.set('view engine', 'ejs');
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

app.get('/tutorial', function (req, res) {
    console.log("called");
    res.render('./pages/howTo');
});

app.get('/logOut', function (req, res) {
    res.render('./pages/logOut');
});

/*******************************
 *    cookie dependent links
 *******************************/

app.post('/history', function (req, res) {
    var data = req.body;
    console.log(req.body);
    if (data.username == false) {
        console.log("user not signed in");
        res.redirect('/');
    }

    MongoClient.connect(url, { useUnifiedTopology: true }, function (err, db) {
        if (err) {
            return "Error: not found";
        }

        var dbo = db.db("billsplit");
        var coll = dbo.collection('receiptInfo');
        theQuery = { users : data.username}

        coll.find(theQuery).toArray(function (err, items) {
            if (err) {
                console.log("Error: " + err); // render error page
            }
            console.log("retrieved from database " + items);
            var receiptsArr = { receipts : items }; //make json with receipts: [array of receipts]
            console.log("receipts arr " + receiptsArr);
            allReceiptsString = JSON.stringify(receiptsArr); //convert the json to string
            console.log("to string " + allReceiptsString);
            res.render('./pages/history', {
                allReceipts: allReceiptsString //send the string see history.ejs for continuation
            });
            db.close();
        });
    });
});

/*******************************
 *    form processing links
 *******************************/
app.post('/save', function (req, res) {
    // Delete variables below + delete userobj variable if you already have JSON
    // and set userObj = [JSON]
    let data = req.body;
    console.log(data);
    let receipt = JSON.parse(data.receiptJSON);
    console.log(receipt);

    MongoClient.connect(url, function (err, db) {
        if (err) {
            console.log("database connection error");
            res.render('./pages/message', {
                line1 : "Sorry, there seems to be a problem.",
                line2 : "Please try again later.",
                username : "null",
                saveUsernameCookie: false,
                returnWhere : "Calculator",
                returnHREF : "/calculator"
            });
        }
        else {
            var userObj = {
                title: receipt.title,
                users: receipt.users,
                date: receipt.date,
                people: receipt.people,
                tax: receipt.tax,
                subtotal: receipt.subtotal,
                total: receipt.total,
                payer: receipt.payer,
                items: receipt.items
            };
            var dbo = db.db("billsplit");
            var coll = dbo.collection('receiptInfo');
            coll.insertOne(userObj, function (err, result) {
                if (err) {
                    console.log("receipt not saved"); // Save not successful. try again later (unlikely unless mongodb server is down)
                    res.render('./pages/message', {
                        line1 : "Your receipt " + title + " was not saved",
                        line2 :  "There seems to be an issue.",
                        username : "null",
                        saveUsernameCookie: false,
                        returnWhere : "Home",
                        returnHREF : "/"
                    });
                }
                else {
                    console.log("receipt saved successfully!") 
                    //render success page
                    res.render('./pages/message', {
                        line1 : "Your receipt " + receipt.title + " was saved",
                        line2 :  "Find it in 'My Receipts'.",
                        username : "null",
                        saveUsernameCookie: false,
                        returnWhere : "Home",
                        returnHREF : "/"
                    });
                }
            });
        }
        db.close
    });
});

app.post('/createUser', function (req, res) {
    var data = req.body;
    console.log(data);
    rawPass = data.pass;

    bcrypt.hash(rawPass, saltRounds, (err, hash) => {
        if (err) {
            console.log("bcrypt hashing error");
            return;
        }

        console.log(hash);
        var userObj = {
            username: data.username,
            password: hash,
            first: data.fname,
            last: data.lname,
            email: data.email
        };
        
        MongoClient.connect(url, function (err, db) {
            if (err) {
                console.log("database connection error");
                res.render('./pages/message', {
                    line1 : "Sorry, there seems to be a problem.",
                    line2 : "Please try again later.",
                    username : "null",
                    saveUsernameCookie: false,
                    returnWhere : "Create Account",
                    returnHREF : "/signUp"
                });
            }
            else { //connected to db
                var dbo = db.db("billsplit");
                var coll = dbo.collection('userInfo');
                coll.createIndex({ username: 1 }, { unique: true });
                coll.insertOne(userObj, function (err, result) {
                    if (err) { //non unique entry
                        console.log(err);
                        console.log("Username already exists");
                        res.render('./pages/message', {
                            line1 : "Sorry, the username, " + data.username + " already exists.",
                            line2 : "Please try a new username.",
                            username : "null",
                            saveUsernameCookie: false,
                            returnWhere : "Create Account",
                            returnHREF : "/signUp"
                        });
                    }
                    else { //successful insertion
                        console.log("Success! Account created");
                        res.render('./pages/message', {
                            line1 : "You have successfully created an account.",
                            line2 : "Welcome, " + userObj.username + ".",
                            username : userObj.username,
                            saveUsernameCookie: true,
                            returnWhere : "Home",
                            returnHREF : "/"
                        });
                        db.close();
                    }
                });//insertOne
            }
        });//mongoclient
    });//bcrypt
});

/* bcrypt.compare version*/
app.post('/logIn', function (req, res) {
    var data = req.body;
    user = data.username; 
    rawPass = data.pass;
    console.log(data);

    MongoClient.connect(url, { useUnifiedTopology: true }, function (err, db) {
        if (err) {
            console.log("database connection error");
            res.render('./pages/message', {
                line1 : "Sorry, there seems to be a problem.",
                line2 : "Please try again later.",
                username : "null",
                saveUsernameCookie: false,
                returnWhere : "Sign In",
                returnHREF : "/signIn"
            });
        }
        else {
            var dbo = db.db("billsplit");
            var coll = dbo.collection('userInfo');
            theQuery = { username: user };
            coll.find(theQuery).toArray(function (err, items) {
                if (err) {
                    console.log("Query error: " + err);
                    return;
                }
                console.log(items);
                if (items.length == 0){
                    console.log("username not found");
                    // render incorrect username
                    res.render('./pages/message', {
                        line1 : "Your username is incorrect",
                        line2 :  "Please try again",
                        username : data.username,
                        saveUsernameCookie: false,
                        returnWhere : "Sign In",
                        returnHREF : "/signIn"
                    });
                }
                for (i = 0; i < items.length; i++) {
                    bcrypt.compare(rawPass, items[i].password, function (err, match){
                        if (err){
                            console.log("Bcrypt error: " + err);
                            return;
                        }
                        console.log(match);
                        if (match){
                            console.log("log in success");
                            // render welcome page
                            res.render('./pages/message', {
                                line1 : "Welcome, " + data.username + ".",
                                line2 : "You are logged in.",
                                username : data.username, //this will be automatically hashed by the storeUsername function
                                saveUsernameCookie: true,
                                returnWhere : "Home",
                                returnHREF : "/"
                            });
                        }
                        if (!match) {
                            console.log("log in unsuccessful");
                            // render incorrect password
                            res.render('./pages/message', {
                                line1 : "Your password is incorrect",
                                line2 :  "Please try again",
                                username : data.username,
                                saveUsernameCookie: false,
                                returnWhere : "Sign In",
                                returnHREF : "/signIn"
                            });
                        }
                    });//bcrypt
                }
                db.close();
            });//mongo query
        }
    });//mongodb
});

app.post('/sendMessage', function (req, res) {
    var data = req.body;
    console.log(data);

    MongoClient.connect(url, function (err, db) {
        if (err) {
            console.log("database connection error");
            res.render('./pages/message', {
                line1 : "Sorry, there seems to be a problem.",
                line2 : "Please try again later.",
                username : "null",
                saveUsernameCookie: false,
                returnWhere : "Contact Us",
                returnHREF : "/contact"
            });
        }

        var userObj = {
            username: data.username,
            email: data.email,
            message: data.message
        }
    
        var dbo = db.db("billsplit");
        var coll = dbo.collection('contactInfo');
        coll.insertOne(userObj, function (err, result) {
            if (err) {
                console.log("contact us submission not entered");
                // Save not successful (unlikely unless mongo server is down)
                res.render('./pages/message', {
                    line1 : "There seems to be an issue.",
                    line2 :  "Please try again later.",
                    username : "null",
                    saveUsernameCookie: false,
                    returnWhere : "Home",
                    returnHREF : "/"
                });
            }
            else {
                console.log("contact submission successful") 
                // Render successfully sent
                res.render('./pages/message', {
                    line1 : "Thank you for contacting us.",
                    line2 :  "We will get back to you shortly.",
                    username : "null",
                    saveUsernameCookie: false,
                    returnWhere : "Home",
                    returnHREF : "/"
                });
                db.close();
            }
        })
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

var express = require('express');
const ejs = require('ejs');
const cookieParser = require('cookie-parser');
const app = express();
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://user:db1@billsplit.6feyv.mongodb.net/billsplit?retryWrites=true&w=majority";

const port = 8080;

app.set('view engine', 'ejs');

app.use(cookieParser());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.listen(port);


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

app.get('/history', function (req, res) {
    cookieUser = "jzimm135" // cookie
    MongoClient.connect(url, { useUnifiedTopology: true }, function (err, db) {
        if (err) {
            return "Error: not found";
        }

        var dbo = db.db("billsplit");
        var coll = dbo.collection('receiptInfo');
        theQuery = {}

        coll.find(theQuery).toArray(function (err, items) {
            if (err) {
                console.log("Error: " + err); // render error page
            }
            for (i = 0; i < items.length; i++) {
                for (y = 0; y < items[i].people.length; y++) {
                    if (((items[i].people)[y].username) == cookieUser) {
                        console.log(items[i]); // items[i] is the JSON of each user's receipt
                    }
                }
            }
            db.close();
        });
    });
    req.cookies;
    // get method auto sends cookie to querystring
    // server gets cookie from querystring
    // server uses cookie to find all matching receipts
    var receipts = [];
    res.render('./pages/history', {
        allReceipts: receipts
    });
});

app.get('/contact', function (req, res) {
    res.render('./pages/contactUs');
})

/*******************************
 * form processing links
 *******************************/
app.post('/save', function (req, res) {
    // Delete variables below + delete userobj variable if you already have JSON
    // and set userObj = [JSON]
    title = "trader joes groceries"
    date = "12/3/2021"
    people = [
        { username: "jzimm135", name: "Jacob", initial: "j", owes: 5.05 },
        { username: "ehe340", name: "Eddy", initial: "e", owes: -19.37 },
        { username: "none", name: "Adnan", initial: "a", owes: 7.16 }
    ],
        tax = 5.25
    subtotal = 19
    total = 24.25
    payer = 1
    items = [
        { name: "eggs", price: 2.50, sharedBy: ["Jacob", "Eddy", "Adnan"], sharedByString: "jea" },
        { name: "butter", price: 4, sharedBy: ["Adnan"], sharedByString: "ka" }
    ]
    MongoClient.connect(url, function (err, db) {
        if (err) {
            console.log("Error")
        }
        var userObj = {
            title: title,
            date: date,
            people: people,
            tax: tax,
            subtotal: subtotal,
            total: total,
            payer: payer,
            items: items
        }
        var dbo = db.db("billsplit");
        var coll = dbo.collection('receiptInfo');
        coll.insertOne(userObj, function (err, res) {
            if (err) {
                console.log("not put in correctly"); // Save not successful. try again later (unlikely unless mongodb server is down)
            }
            else {
                console.log("success!") //render success page
            }
        })
        db.close
    });

    let data = req.body;
    let receipt = JSON.parse(data["receiptJSON"]);
    console.log(receipt);
    res.send(receipt);
});

app.post('/createUser', function (req, res) {
    cookieUser = "guest" // cookie
    user = "boundiss12"; // Use get and then use encrypt function
    pass = "receipt1"; // Use get and then use encrypt function
    fname = "keev"
    lname = "ngu"
    email = "dwadwadwa@gmail.com"
    MongoClient.connect(url, function (err, db) {
        if (err) {
            throw err;
        }
        var userObj = {
            username: user,
            password: pass,
            first: fname,
            last: lname,
            email: email,
            itemsBought: [],
            receipts: []
        }
        var dbo = db.db("billsplit");
        var coll = dbo.collection('userInfo');
        coll.createIndex({ username: 1 }, { unique: true });
        coll.insertOne(userObj, function (err, res) {
            if (err) {
                console.log("username already exists"); // Render a page saying username already exists
            }
            else {
                cookieUser = user;
                console.log("success!") // else print a page that welcoming user
            }
        })
        db.close
    });
    var data = req.body;
    console.log(data);
    res.send(data);
});


app.post('/logIn', function (req, res) {
    cookieUser = "guest" // cookie
    user = "boundlis"; // Use get and then use encrypt function
    pass = "receipt1"; // Use get and then use encrypt function
    MongoClient.connect(url, { useUnifiedTopology: true }, function (err, db) {
        if (err) {
            return "Error: not found";
        }

        var dbo = db.db("billsplit");
        var coll = dbo.collection('userInfo');
        theQuery = { username: user }

        coll.find(theQuery).toArray(function (err, items) {
            if (err) {
                console.log("Error: " + err);
            } else {
                console.log(items);
                for (i = 0; i < items.length; i++) {
                    if (items[i].password == pass) {
                        cookieUser = items[i].username; // sets cookie username to logged in username
                        // render welcome page
                    }
                }
                if (cookieUser == "guest") {
                    console.log("unsuccessful") // render incorrect login
                }
            }
            console.log(cookieUser)
            db.close();
        });
    });
    var data = req.body;
    console.log(data.username);
    console.log(data.pass);
    res.send(data);
});

app.post('/sendMessage', function (req, res) {
    user = "boundiss12"; // encrypt this
    email = "dwadwadwa@gmail.com"
    msg = "sqsSQAWDDAW"
    MongoClient.connect(url, function (err, db) {
        if (err) {
            throw err;
        }
        var userObj = {
            username: user,
            email: email,
            message: message
        }
        var dbo = db.db("billsplit");
        var coll = dbo.collection('contactInfo');
        coll.insertOne(userObj, function (err, res) {
            if (err) {
                console.log("not put in correctly");  // Save not successful (unlikely unless mongo server is down)
            }
            else {
                console.log("Successfully sent") // Render successfully sent
            }
        })
        db.close
    });
    var data = req.body;
    console.log(data);
    res.send(data);
}); 
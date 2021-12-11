var express = require('express');
const ejs = require('ejs');
const app = express();
const port = 8080;

app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.listen(port);


app.get('/', function(req, res){
    res.render('pages/index');
});

app.get('/calculator', function(req, res){
    res.render('./pages/fullCalculator');
});

app.get('/pro', function(req,res){
    res.render('./pages/pro');
});

app.get('/about', function(req,res){
    res.render('./pages/aboutUs');
});

app.get('/signIn', function(req, res) {
    res.render('./pages/signIn');
});

app.get('/signUp', function(req, res) {
    res.render('./pages/signup');
});

app.get('/history', function(req,res){
    res.render('./pages/history');
});

app.get('/contact', function(req, res){
    res.render('./pages/contactUs');
})

/*******************************
 * form processing links
 *******************************/
app.post('/save', function(req, res){
    let data = req.body;
    let receipt = JSON.parse(data["receiptJSON"]);
    console.log(receipt);
    res.send(receipt);
}); 

app.post('/createUser', function(req, res){
    var data = req.body;
    console.log(data);
    res.send(data);
}); 


app.post('/logIn', function(req, res){
    var data = req.body;
    console.log(data);
    res.send(data);
}); 

app.post('/sendMessage', function(req, res){
    var data = req.body;
    console.log(data);
    res.send(data);
}); 
var express = require('express');
var bodyparser = require('body-parser');
//var cookieparser = require('cookie-parser');
var multer = require('multer');
var session = require('express-session');

var app = express();
var upload = multer();

app.use(bodyparser.urlencoded({extended:true}));
//app.use(cookieparser());
app.use(bodyparser.json());
app.use(session({secret: ' shh, its a secret'}));
app.use(upload.array());

app.set('view engine', 'pug');
app.set('views', './views');

var users = [];

app.get('/signup', function(req,res) {
    res.render('signup');
});

console.log('enter your username and password');

app.post('/signup', function(req,res) {
    if(!req.body.id || !req.body.password) {
        res.status('404');
        res.status('Invalid Details')
    }else {
        users.filter(function(user) {
            if(user.id === req.body.id ) {
                res.render('signup', {message : "User already exists! Login or try with other another user ID"});
            }
        });
        var newuser = {id: req.body.id, password: req.body.password};
        users.push(newuser);
        req.session.user = newuser;
        res.redirect('/protectedpage');
    }
});
console.log('Redirecting to Protected page');

//  var a = function checksignin(req,res) {
//     if(req.session.user) {
//         next();
//     }else {
//         var err = new Error('Not Logged In');
//         console.log(req.session.user);
//         next(err);
//     }
// }

app.get('/protectedpage', function(req,res) {
    res.render('protectedpage', { id: req.session.user.id });
});

app.get('/login', function(req,res) {
    res.render('login');
})

app.post('/login', function(req,res) {
    console.log(users);
    if(!req.body.id || !req.body.password) {
        res.render('/login', { message : "please enter your username and password"});
    }else {
        users.filter(function(user) {
            if(user.id === req.body.id && user.password === req.body.password) {
                req.session.user = user;
                res.redirect('/protectedpage');
            }
        });
        res.render('login', { message : " Invalid Credentials!"});
    }
});

app.get('/logout', function(req, res) {
     users = [];
    req.session.destroy(function() {
        console.log("user logged out");
       
    });
    res.redirect('/login');
});

app.use('/protectedpage',  function(err, req, res, next) {
    console.log(err);
    res.redirect('/login');
});

app.get('/allusers', function(req,res) {
    res.send(users);
});

console.log('open 8014');
app.listen(8014);

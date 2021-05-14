//BACKEND
const express = require("express");
const app = express();
const cors = require("cors");
const bcrypt = require('bcrypt');
const db = require('./models');
const hbs = require("express-handlebars");
const Sequelize = require('sequelize');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const user = require("./models/user");

const initializePassport = require('./passport-config');
initializePassport(
    passport,
    username => users.find(user => user.username === username),
    id => users.find(user => user.id === id)
)   //check this later when debugging



//MIDDLEWARE
app.use(express.urlencoded({extended: false}));
app.use(cors());
app.use(express.static("public"));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET
}));
app.use(passport.initialize());
app.use(passport.session())


//SET TEMPLATING ENGINE
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');



app.get('/', checkAuthenticated, (req, res) => {
    res.render('index.hbs', { name: req.user.name })
});


app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login.hbs')
});     //Dont allow users to go to the login once they have been authenticated


app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register.hbs')
});



app.post('/register', checkNotAuthenticated, async(req, res) => {
    try{
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        users.push({
            id: Date.now().toString(),    //current timestamp
            name: req.body.username,
            password: hashedPassword
        })
        res.redirect('/login')     //proceed for login after registering
    } catch{
        res.redirect('/register')   //if error happens, register again
    }
});


app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFLash: true
}));


app.post('/users', (req, res) => {
    console.log(req.body)
});


app.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/login')
});


app.listen(3000, () => {
    console.log("listening on port 3000");
  });



function checkAuthenticated(req, res, next) {
    if (!req.isAuthenticated()) {
      return res.redirect('/login')
    }
    next()
}                 //if havent login, this will authenticate users when login with correct info


function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect('/')
    }
    next()
}                  //Dont allow users to go to the login once they have been authenticated
//BACKEND
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const db = require('./models');
const hbs = require('express-handlebars');
const Sequelize = require('sequelize');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const user = require('./models/user');
const path = require('path');
require("jsdom-global")();
const bootstrap = require('bootstrap');

const app = express();


const initializePassport = require('./passport-config');
initializePassport(
    passport,
    // username => db.User.find(user => user.username === username),
    // id => db.User.find(user => user.id === id)
    username => db.User.findOne({ where: { username } }),
    id => db.User.findOne({ where: { id } })
)


//MIDDLEWARE
app.use(express.json());        //postman body parser /JSON request
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(express.static('public'));
app.use(methodOverride('_method'));
app.use(flash());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});

//SET TEMPLATING ENGINE
app.engine(".hbs", hbs({ extname: "hbs" }));
app.set("view engine", ".hbs");



app.get('/', /*checkAuthenticated*/(req, res) => {
    //res.render('index', { name: req.user.name })
    res.render('home.hbs');
});


app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register.hbs')
});


app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login.hbs')
});     //Dont allow users to go to the login once they have been authenticated


app.post('/register', checkNotAuthenticated, async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        await db.User.create({                       //add to database
            username: req.body.username,
            password: hashedPassword
        })
        res.redirect('/login')     //proceed for login after registering
    } catch (err) {
        console.log(err)
        res.redirect('/register')   //if error happens, register again
    }
});


app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));


//Story route handlers
app.get('/story', checkAuthenticated, async (req, res) => {
    const stories = await req.user.getStories()
    res.render('home.hbs', { stories: stories.map(story => story.toJSON()) })
});


app.post('/story', checkAuthenticated, async (req, res) => {

    try {
        const story = await req.user.createStory(req.body)
        res.redirect('/story')   //after creating the story redirect it to stories database
    } catch (e) {
        res.send(e.message)
    }
});


app.put('/story/:id', /*checkAuthenticated,*/(req, res) => {
    const id = req.params.id
    db.Story.update(req.body, { where: { id } }).then(() => res.status(200).send('Story has been edited'))
});   //edit story


app.delete('/story/:id', /*checkAuthenticated,*/(req, res) => {
    const id = req.params.id
    db.Story.destroy({ where: { id } }).then(() => res.status(204).send('Story has been deleted'))
});


app.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/login')
});


app.listen(3000, () => {
    console.log("listening on port 3000")
});



function checkAuthenticated(req, res, next) {
    if (!req.isAuthenticated()) {
        return res.redirect('/login')
    }
    next()
};                 //if havent login, this will authenticate users when login with correct info


function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }
    next()
};                //Dont allow users to go to the login once they have been authenticated
const express = require('express')
const router = express.Router();
const User = require('./models.js')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
require('dotenv').config();

let userLogged;

let logState = { logegdIn: true, loggedOut: false }

router.get('/', LoggedOut, (req, res) => {
    console.log(!userLogged)
    User.find({}).lean()
        .then(user => res.render('index', { user }))
});

router.get('/register', LoggedOut, (req, res) => {
    res.render('register');
});

router.post('/register', async (req, res) => {

    let newEmail = req.body.email;
    let newPassword = await bcrypt.hash(req.body.password, 8);
    let newId = parseInt((Math.random() * 20));
    let newUser = new User({ id: newId, email: newEmail, password: newPassword })

    if (!newEmail) {
        res.render('register', { msg: 'Email required' })
    }

    if (!newPassword) {
        res.render('register', { msg: 'Password required' })
    }

    User.findOne({ email: newEmail }, (err, user) => {
        if (user == null) {
            newUser.save();
            res.redirect('login')
        }
        else {
            res.render('register', { msg: 'Email already taken' })
        }
    })

})

router.get('/login', LoggedOut, (req, res) => {
    res.render('login');
});

router.post('/login', (req, res) => {

    let loginEmail = req.body.email;
    let loginPassword = req.body.password;

    if (!loginEmail) {
        res.render('register', { msg: 'Email required' })
    }

    if (!loginPassword) {
        res.render('register', { msg: 'Password required' })
    }

    User.findOne({ email: loginEmail }, async (err, user) => {
        if (user == null) {
            res.render('login', { msg: 'Email not found' })
        }
        else {
            if (await bcrypt.compare(loginPassword, user.password)) {
                userLogged = true;
                res.redirect('profile', { email: loginEmail })
                console.log('Password is correct')
            }
            else {
                res.render('login', { msg: 'Password is incorrect' })
            }
        }
    })
});

router.get('/logout', (req, res) => {
    userLogged = false;
    res.render('login')
})

function LoggedIn(req, res, next) {
    if (userLogged) {
        next()
    }
    else {
        res.sendStatus(401)
    }
}

function LoggedOut(req, res, next) {
    if (!userLogged) {
        next()
    }
    else {
        res.sendStatus(401)
    }
}

router.get('/profile', LoggedIn, (req, res) => {
    res.render('profile');
})

module.exports = router;


const express = require("express");
const bcrypt = require('bcryptjs');
const users = require("./users-model.js");
const middleware = require("./restricted-middleware.js");

const router = express.Router();

router.post('/register', (req, res) => {
    const credentials = req.body;

    const hash = bcrypt.hashSync(credentials.password, 8);

    credentials.password = hash;

    users.register(credentials)
    .then(newuser => {
        req.session.loggedIn = true;
        res.status(201).json(newuser)
    })
    .catch(error => {
        res.status(500).json(error);
      });
})

router.post('/login', (req, res) => {
    const { username, password } = req.body;

    users.findBy({ username })
    .first()
    .then(user => {
        if(user && bcrypt.compareSync(password, user.password)) {
            req.session.loggedIn = true;
            req.session.username = user.username;
            res.json({ message: `Logged in!` });
        } else {
            res.status(401).json({ message: 'You shall not pass!' });
        }
    })
    .catch(error => {
        res.status(500).json(error);
    });
})

router.get('/logout', (req, res) => {
    if(req.session) {
        req.session.destroy(err => {
            if(err) {
                res.status(500).json({ you: 'can check out any time you like, but you can never leave' });
            } else {
                res.status(200).json({ you: 'logged out successfully' });
            }
        })
    }
})

router.get('/', middleware, (req, res) => {
    users.getUsers()
    .then(users => {
        res.json(users)
    })
})

module.exports = router;
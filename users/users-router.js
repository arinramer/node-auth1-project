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
            res.json({ message: `Logged in!` });
        } else {
            res.status(401).json({ message: 'You shall not pass!' });
        }
    })
    .catch(error => {
        res.status(500).json(error);
    });
})

router.get('/', middleware, (req, res) => {
    users.getUsers()
    .then(users => {
        res.json(users)
    })
})

module.exports = router;
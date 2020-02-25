const express = require("express");

const usersrouter = require('./users/users-router.js');

const session = require('express-session');

const knex = require('./data/dbConfig.js');

const KnexStore = require('connect-session-knex')(session);

const server = express();

server.use(express.json());

const sessionConfig = {
    name: 'idontknow',
    secret: 'this is a secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 10,
        secure: false,
        httpOnly: true,
    },
    store: new KnexStore({
        knex,
        tablename: 'sessions',
        createTable: true,
        sidfieldname: 'sid',
        clearInterval: 1000 * 60 * 10
    })
}

server.use(session(sessionConfig));

server.use('/api/users', usersrouter);

module.exports = server;
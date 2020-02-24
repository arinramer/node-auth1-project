const express = require("express");

const usersrouter = require('./users/users-router.js');

const server = express();

server.use(express.json());

server.use('/api/users', usersrouter);

module.exports = server;
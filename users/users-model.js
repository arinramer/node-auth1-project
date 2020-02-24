const db = require("../data/dbConfig.js");

module.exports = {
    register,
    findBy,
    getUsers
}

function register(user) {
    return db('users')
    .insert(user)
}

function findBy(filter) {
    return db('users')
    .where(filter)
}

function getUsers() {
    return db('users')
}
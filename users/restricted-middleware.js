const users = require('./users-model.js');
const bcrypt = require('bcryptjs');

module.exports = (req, res, next) => {
    const { username, password } = req.headers;

    if (username && password) {
        users.findBy({ username })
          .first()
          .then(user => {
            if (user && bcrypt.compareSync(password, user.password)) {
              next();
            } else {
              res.status(401).json({ message: 'You shall not pass!' });
            }
          })
          .catch(error => {
            res.status(500).json({ message: 'Unexpected error' });
          });
      } else {
        res.status(400).json({ message: 'No credentials provided' });
      }
    } 
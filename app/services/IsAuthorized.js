'use strict';

var db = require('../models'),
    Promise = require('bluebird');

module.exports = function (req, res, next) {
  var token = req.header('token');
  if (!token) {
    return res.status(401).send();
  }
  db.User.findOne({
    where: {
      token: token
    },
    attributes: ['id', 'name', 'phone', 'email']
  })
    .then(function(user) {
      if (user) {
        req.user = user.dataValues;
        return next();
      } else {
        return res.status(401).send();
      }
    })
    .catch(function(err) {
      console.log(err);
      return res.status(500).send('Server Error')
    });
};
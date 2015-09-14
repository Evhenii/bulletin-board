'use strict';

var express = require('express'),
  router = express.Router(),
  db = require('../models');
var Promise = require('bluebird');
var md5 = require('md5');
var rg = require('../services/ResponseGenerator');
var isAuthorized = require('../services/IsAuthorized');

module.exports = function (app) {
  app.use('/', router);

};

router.post('/api/register', function (req, res, next) {
  var phone = req.param('phone'),
      name = req.param('name'),
      email = req.param('email'),
      password = req.param('password');
  phone = phone.replace(/ /g, "");
  phone = phone.replace(/-/g, "");
  db.User.create({
    phone: phone,
    name: name,
    email: email,
    password: password,
    token: md5(email + password)
  })
    .then(function(user) {
      return res.status(200).json({token: user.dataValues.token});
    })
    .catch(function(err) {
      if (err.name == 'SequelizeValidationError') {
        return res.status(422).json(rg(err));
      }
      console.log(err);
      return res.status(500).send("Server error");
    });
});

router.post('/api/login', function (req, res, next) {
  var email = req.param('email'),
      password = req.param('password');
  db.User.findOne({
    where: {
      email: email,
      password: password
    }
  })
    .then(function(user) {
      if (user) {
        return res.status(200).json({token: user.dataValues.token});
      } else {
        return res.status(422).json({"field":"password", "message":"Wrong email or password"});
      }
    })
    .catch(function(err) {
      console.log(err);
      return res.status(500).send("Server error");
    });
});

router.get('/api/me', isAuthorized, function (req, res, next) {
  var user = req.user;
  return res.status(200).json(user);
});

router.put('/api/me', isAuthorized, function (req, res, next) {
  var user = req.user;
  var attributes = {},
      where = {
        id: user.id
      };
  var new_password = req.param('new_password'),
      current_password = req.param('current_password');
  if (current_password && !new_password) {
    return res.status(422).json({"field":"new_password", "message":"New password is empty"})
  }
  attributes.email = req.param('email') || user.email;
  attributes.phone = req.param('phone') || user.phone;
  attributes.name = req.param('name') || user.name;
  attributes.phone = attributes.phone.replace(/ /g, "");
  attributes.phone = attributes.phone.replace(/-/g, "");
  if (new_password) {
    attributes.password = new_password;
    where.password = current_password;
  }
  db.User.update(attributes, {where: where})
    .then(function(update) {
      if (update[0]) {
        delete attributes.password;
        attributes.id = user.id;
        return res.status(200).json(attributes);
      } else {
        return res.status(422).json({"field":"current_password", "message":"Wrong current password"})
      }
    })
    .catch(function(err) {
      if (err.name == 'SequelizeValidationError') {
        return res.status(422).json(rg(err));
      }
      console.log(err);
      return res.status(500).send("Server error");
    });
});

router.get('/api/user', function (req, res, next) {
  var name = req.param('name'),
      email = req.param('email');
  if (!name && !email) {
    return res.status(422).json({"field":"email", "message":"Input params are empty"});
  }
  db.User.find({
    where: {
      $or: [
        {
          name: name
        },
        {
          email: email
        }
      ]
    },
    attributes: ['id', 'name', 'phone', 'email']
  })
    .then(function(user) {
      if (user) {
        return res.status(200).json(user.dataValues);
      } else {
        return res.status(404).send();
      }
    })
    .catch(function(err) {
      console.log(err);
      return res.status(500).send("Server error");
    })
});
'use strict';

var db = require('../models'),
  Promise = require('bluebird');

module.exports = function (req, res, next) {
  var user = req.user;
  var itemId = req.param('id');
  if (!itemId) {
    return res.status(422).json({field: "id", message: "Item id is missing"});
  }
  db.Item.findOne({
    where: {
      id: itemId
    }
  })
    .then(function(item) {
      if (item) {
        if (item.dataValues.user_id != user.id) {
          return res.status(403).send();
        }
        req.item = item.dataValues;
        return next();
      } else {
        return res.status(404).send();
      }
    })
    .catch(function(err) {
      console.log(err);
      return res.status(500).send('Server Error')
    });
};
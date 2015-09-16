'use strict';

var express = require('express'),
    router = express.Router(),
    db = require('../models'),
    fs = require('fs'),
    config = require('../../config/config');

var multer = require('multer');
var Promise = require('bluebird');
var rg = require('../services/ResponseGenerator');
var isAuthorized = require('../services/IsAuthorized');
var allowManageItem = require('../services/AllowManageItem');
var imageValidation = require('../services/ImageValidation');
var upload = multer({
  dest: 'images/'
});
module.exports = function (app) {
  app.use('/', router);
};

router.put('/api/item', isAuthorized, function (req, res, next) {
  var user = req.user;
  var title = req.param('title'),
      price = req.param('price');
  db.Item.create({
    title: title,
    price: price,
    user_id: user.id
  })
    .then(function(item) {
      var response = item.dataValues;
      response.user = user;
      return res.status(200).json(response);
    })
    .catch(function(err) {
      if (err.name == 'SequelizeValidationError') {
        return res.status(422).json(rg(err));
      }
      next(err);
    });
});

router.post('/api/item/:id/image', isAuthorized, allowManageItem,  upload.single('file'), imageValidation, function (req, res, next) {
  var user = req.user;
  var item = req.item;
  if (item.image) {
    fs.unlink(config.root + '/images/' + item.image, function (err) {
      if (err) {
        next(err);
      }
    });
  }
  db.Item.update({
    image: req.file.filename
  }, {
    where: {
      id: item.id
    }
  })
    .then(function() {
      item.image = req.file.fileName;
      var response = item;
      response.user = user;
      return res.status(200).json(response);
    })
    .catch(function(err) {
      next(err);
    });
});

router.post('/api/item/:id/image', isAuthorized, allowManageItem,  upload.single('file'), imageValidation, function (req, res, next) {
  var user = req.user;
  var item = req.item;
  if (item.image) {
    fs.unlink(config.root + '/images/' + item.image, function (err) {
      if (err) {
        next(err);
      }
    });
  }
  db.Item.update({
    image: req.file.filename
  }, {
    where: {
      id: item.id
    }
  })
    .then(function() {
      item.image = req.file.fileName;
      var response = item;
      response.user = user;
      return res.status(200).json(response);
    })
    .catch(function(err) {
      next(err);
    });
});

router.delete('/api/item/:id/image', isAuthorized, allowManageItem, function (req, res, next) {
  var user = req.user;
  var item = req.item;
  if (!item.image) {
    return res.status(404).json([{field: 'image', message: 'File not found'}])
  }
  fs.unlink(config.root + '/images/' + item.image, function (err) {
    if (err) {
      next(err);
    }
    db.Item.update({
      image: null
    }, {
      where: {
        id: item.id
      }
    })
      .then(function() {
        return res.status(200).send();
      })
      .catch(function(err) {
        next(err);
      });
  });
});

router.delete('/api/item/:id/image', isAuthorized, allowManageItem, function (req, res, next) {
  var user = req.user;
  var item = req.item;
  if (!item.image) {
    return res.status(404).json([{field: 'image', message: 'File not found'}])
  }
  fs.unlink(config.root + '/images/' + item.image, function (err) {
    if (err) {
      next(err);
    }
    db.Item.update({
      image: null
    }, {
      where: {
        id: item.id
      }
    })
      .then(function() {
        return res.status(200).send();
      })
      .catch(function(err) {
        next(err);
      });
  });
});

router.put('/api/item/:id', isAuthorized, allowManageItem, function (req, res, next) {
  var user = req.user;
  var item = req.item;
  var title = req.param('title'),
      price = req.param('price');
  if (!title && !price) {
    return res.status(422).json([{field: 'title', message: 'Missing input params'}])
  }
  db.Item.update({
    title: title || item.title,
    price: price || item.price
  }, {
    where: {
      id: item.id
    }
  })
    .then(function() {
      var response = item;
      response.user = user;
      return res.status(200).json(response);
    })
    .catch(function(err) {
      if (err.name == 'SequelizeValidationError') {
        return res.status(422).json(rg(err));
      }
      next(err);
    });
});

router.delete('/api/item/:id', isAuthorized, allowManageItem, function (req, res, next) {
  var user = req.user;
  var item = req.item;
  db.Item.destroy({
    where: {
      id: item.id
    }
  })
    .then(function() {
      return res.status(200).send();
    })
    .catch(function(err) {
      next(err);
    });
});

router.get('/api/item/:id', function (req, res, next) {
  var id = req.params.id;
  db.Item.findOne({
    where: {
      id: id
    },
    include: [{
      model: db.User,
      attributes: ['id', 'name', 'email', 'phone'],
      as: 'user'
    }],
    attributes: ['id', 'created_at', 'title', 'price', 'image', 'user_id']
  })
    .then(function(item) {
      if (!item) {
        return res.status(404).send();
      }
      return res.status(200).json(item.dataValues);
    })
    .catch(function(err) {
      next(err);
    });
});

router.get('/api/item/', function (req, res, next) {
  var title = req.query.title || '',
      user_id = req.query.user_id || '',
      order_by = req.query.order_by,
      order_type = req.query.order_type;
  if (order_by != 'created_at' && order_by != 'price') {
    order_by = 'created_at';
  }
  if (typeof order_type !== 'string' || (order_type.toUpperCase() != 'ASC' && order_type.toUpperCase() != 'DESC')) {
    order_type = 'DESC';
  }
  db.Item.findAll({
    where: {
      $or: {
        title: title,
        user_id: user_id
      }
    },
    order: [
      [order_by, order_type.toUpperCase()]
    ],
    include: [{
      model: db.User,
      attributes: ['id', 'name', 'email', 'phone'],
      as: 'user'
    }],
    attributes: ['id', 'created_at', 'title', 'price', 'image', 'user_id']
  })
    .then(function(items) {
      if (!items) {
        return res.status(404).send();
      }
      var result = [];
      items.forEach(function(item) {
        result.push(item.dataValues);
      });
      return res.status(200).json(result);
    })
    .catch(function(err) {
      next(err);
    });
});

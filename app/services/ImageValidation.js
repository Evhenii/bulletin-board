'use strict';

var db = require('../models'),
  Promise = require('bluebird');

module.exports = function (req, res, next) {
  var image = req.file;
  if (image.size >= 10485760) {
    return res.status(422).json([{field: 'file', message: 'File is too big'}]);
  }
  if (/^image$/.test(image.mimetype)) {
    return res.status(422).json([{field: 'file', message: 'File is not an image'}]);
  }
  return next();
};
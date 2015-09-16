'use strict';

module.exports = function (error) {
  var response = [];
  error.errors.forEach(function(error) {
    response.push(error.value);
  });
  return response;
};
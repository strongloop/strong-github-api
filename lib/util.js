'use strict';

var Promise = require('bluebird');
var debug = require('./debug')('util');

exports.getAllPages = function(fetch, params) {
  var _ = require('lodash');
  var collection = [];
  var count = 0;
  return fetch(params).then(function(items) {
    collection = items;
    return next(items.nextPage);
  });

  function next(fn) {
    count++;
    if (!fn) {
      debug('returning %s items', collection.length);
      debug('number of loops: %s', count);
      return Promise.resolve(collection);
    } else {
      return fn().then(function(items) {
        collection = _.concat(collection, items);
        return next(items.nextPage);
      });
    }
  }
};

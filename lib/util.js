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

exports.parseRepoList = function(list) {
  var assert = require('assert');
  var fmt = require('util').format;
  var i = require('util').inspect;
  var path = require('path');
  var items;
  try {
    items = require(path.resolve(list));
  } catch (err) {
    items = {error: err};
  }
  // Parsing failed if this is still true.
  if (items.error) {
    return items;
  }
  var repos = [];
  try {
    debug('items.repos: %s', i(items.repos));
    for (var item of items.repos) {
      var sp = item.split('/');
      debug('sp: %s', i(sp));
      if (sp.length !== 2) {
        throw new Error(fmt('One or more items in the repo list is',
          'not correctly formatted! Example: "foo/bar"'));
      }
      repos.push({org: sp[0], name: sp[1]});
    }
    items.repos = repos;
  } catch (err) {
    items.error = err;
  }
  return items;
};

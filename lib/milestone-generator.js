'use strict';

var Promise = require('bluebird');
var assert = require('assert');
var debug = require('./debug')('milestone-generator');
var fmt = require('util').format;
var inspect = require('util').inspect;
var util = require('./util');

module.exports = function(options) {
  assert(options.octo, 'missing octo property');
  assert(options.org || options.user, 'missing org or user property');
  assert(options.title, 'missing title property');
  assert(options.description, 'missing description property');
  assert(options.due_on, 'missing due_on property');

  var octo = options.octo;

  if (options.org) {
    debug('searching by org');
    return createMilestone(octo.orgs(options.org).repos, options);
  } else {
    debug('searching by user');
    return createMilestone(octo.users(options.user).repos, options);
  }
};

function createMilestone(repos, options) {
  debug('repos: %s', inspect(repos));
  return util.getAllPages(repos.fetch).then(function(repos) {
    return Promise.map(repos, function(repo) {
      var msg = fmt('creating milestone for repo %s', repo.name);
      if (options.verbose) {
        console.log(msg);
      } else {
        debug(msg);
      }
      return repo.milestones.create({
        title: options.title,
        description: options.description,
        due_on: options.due_on,
        state: 'open',
      });
    });
  });

}

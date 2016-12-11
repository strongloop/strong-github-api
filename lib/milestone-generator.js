'use strict';

var Promise = require('bluebird');
var assert = require('assert');
var debug = require('./debug')('milestone-generator');
var fmt = require('util').format;
var util = require('./util');

module.exports = function(options) {
  options.console = options.verbose ? console.log : debug;
  assert(options.octo, 'missing octo property');
  assert(options.org || options.user, 'missing org or user property');
  assert(options.title, 'missing title property');
  assert(options.description, 'missing description property');
  assert(options.due_on, 'missing due_on property');

  var octo = options.octo;

  if (options.org) {
    debug('searching by org');
    return createMilestone(octo.orgs(options.org).repos, null, options);
  } else {
    debug('searching repos owned by user');
    return createMilestone(octo.user.repos, { affiliation: 'owner' }, options);
  }
};

function createMilestone(fn, filter, options) {
  return util.getAllPages(fn.fetch, filter).then(function(repos) {
    return Promise.map(repos, function(repo) {
      if (!options.dryrun) {
        return repo.milestones.create({
          title: options.title,
          description: options.description,
          due_on: options.due_on,
          state: 'open',
        }).then(function() {
          return fmt('created milestone for repo %s', repo.name);
        });
      } else {
        return fmt('dry run: milestone for repo %s', repo.name);
      }
    });
  });

}

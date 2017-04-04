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
  assert(options.dueOn, 'missing dueOn property');

  var octo = options.octo;

  // List takes priority over org and user.
  if (options.list) {
    debug('searching for listed items at path %s', options.list);
    return Promise.try(function() {
      var list = util.parseRepoList(options.list);
      if (list.error) {
        return Promise.reject(list.error);
      }
      return Promise.map(list.repos, function(repo) {
        return octo.repos(repo.org, repo.name).fetch().then(function(repo) {
          return createMilestone(repo, options);
        });
      });
    });
  } else if (options.org) {
    debug('searching by org');
    return createAllMilestones(octo.orgs(options.org).repos, null, options);
  } else {
    debug('searching repos owned by user');
    return createAllMilestones(octo.user.repos, {affiliation: 'owner'},
      options);
  }
};

function createAllMilestones(fn, filter, options) {
  return util.getAllPages(fn.fetch, filter).then(function(repos) {
    return Promise.map(repos, function(repo) {
      return createMilestone(repo, options);
    });
  });
};

function createMilestone(repo, options) {
  if (!options.dryrun) {
    // The API requires due_on, but our lint rules don't like that...
    return repo.milestones.create({
      title: options.title,
      description: options.description,
      due_on: options.dueOn, //eslint-disable-line
      state: 'open',
    }).then(function() {
      return fmt('created milestone for repo %s', repo.name);
    });
  } else {
    return fmt('dry run: milestone for repo %s', repo.name);
  }
}

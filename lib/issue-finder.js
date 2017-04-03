'use strict';

var Promise = require('bluebird');
var _ = require('lodash');
var assert = require('assert');
var moment = require('moment');
var debug = require('./debug')('issue-finder');
var util = require('./util');

module.exports = IssueFinder;

/**
 * A class library for retrieving and filtering
 * GitHub issues.
 * @constructor
 * @param {object} options - The options object.
 * @param {object} options.octo - The instance of octokat that will be used
 * for search operations.
 * @param {string} options.repo - The name of the repository on GitHub.
 * @param {string} options.owner - The name of the owner or organization on
 * GitHub to which the repository belongs.
 */
function IssueFinder(options) {
  this.octo = options.octo;
  this.repo = options.repo;
  this.owner = options.owner;
  assert(this.octo, 'No octokat instance provided!');
};

/**
 * Returns an array of issues from the configured GitHub repository
 * specified at construction, filtered by query parameters
 * (A full list of available parameters can be found at
 * https://developer.github.com/v3/issues).
 * @param {Object.<string, Object>} params - A list of key-value pairs that
 * define the query parameters for an issue search.
 * @return {Issue[]} - The array of matching issues.
 */
IssueFinder.prototype.find = function(params) {
  var self = this;
  debug('Checking %s/%s...', self.owner, self.repo);
  return Promise.resolve().then(function() {
    return self.octo.repos(self.owner, self.repo).fetch();
  }).then(function(repoInfo) {
    return util.getAllPages(repoInfo.issues.fetch, params);
  });
};

/**
 * Filter through an existing list of issues
 * to find those last updated beyond a certain number of days.
 * @param  {Issue[]} issues - The array of issues to filter.
 * @param  {number} age - The minimum age, in days.
 * @return {Issue[]} - The filtered array of issues.
 */
IssueFinder.prototype.olderThan = function(issues, age) {
  age = age || 0;
  var matches = _.map(issues, function(issue) {
    var now = moment();
    // GitHub's API doesn't set the updatedAt to anything if an issue
    // has not been updated!
    var lastUpdated = moment(issue.updatedAt || issue.createdAt);
    var updatedAt = moment(lastUpdated);
    var diff = now.diff(updatedAt, 'days');
    if (diff >= age) {
      return _(issue).omitBy(_.isNil).omitBy(_.isFunction).value();
    }
  });
  return Promise.resolve(_.compact(matches));
};

/**
 *
 */

 /**
  * Summarize the properties of the returned issues based on
  * a default set of fields, or provide your own with the optional
  * props argument.
  * @param  {Issue[]} issues - The array of issues to filter.
  * @param  {string[]=} props - An optional array of properties to select from
  * each issue. A default list will be used if left null.
  * @return {Issue[]} - A list of issues with only the expected properties on
  * each issue.
  */
IssueFinder.prototype.summarizeIssues = function(issues, props) {
  var properties = props || [
    'id',
    'number',
    'url',
    'title',
    'state',
    'assignee',
    'assignees',
    'createdAt',
    'updatedAt',
  ];
  var _ = require('lodash');
  return _.map(issues, function(issue) {
    return _.pick(issue, properties);
  });
};

'use strict';

var Promise = require('bluebird');
var moment = require('moment');

module.exports = Octokat;

function Octokat() {
  var self = this;
  this.otherIssues = [
    {
      id: 2345678,
      number: 3,
      url: 'https://github.com/magicOrg/fakeRepo',
      title: 'Does\'nt pop enough!',
      state: 'open',
      assignee: null,
      assignees: [],
      createdAt: moment().subtract(36, 'days'),
      updatedAt: moment().subtract(35, 'days'),
    },
    {
      id: 4567890,
      number: 4,
      url: 'https://github.com/magicOrg/fakeRepo',
      title: 'Needs more cowbell',
      state: 'open',
      assignee: null,
      assignees: [],
      createdAt: moment().subtract(71, 'days'),
      updatedAt: moment().subtract(70, 'days'),
    },
  ];
  this.issues = [
    {
      id: 1234567,
      number: 1,
      url: 'https://github.com/magicOrg/fakeRepo',
      title: 'Does\'nt pop enough!',
      state: 'open',
      assignee: null,
      assignees: [],
      createdAt: moment().subtract(36, 'days'),
      updatedAt: moment().subtract(35, 'days'),
    },
    {
      id: 4567893,
      number: 2,
      url: 'https://github.com/magicOrg/fakeRepo',
      title: 'Needs more cowbell',
      state: 'open',
      assignee: null,
      assignees: [],
      createdAt: moment().subtract(71, 'days'),
      updatedAt: moment().subtract(70, 'days'),
    },
  ];
  this.issues.nextPage = function() {
    return Promise.resolve(self.otherIssues);
  };
  var fakeRepo = {
    name: 'fake-repo',
    issues: {
      fetch: function(filter) {
        return Promise.resolve(self.issues);
      },
    },
    milestones: {
      create: function() {
        return Promise.resolve();
      },
    },
  };

  this.repoInfo = [
    fakeRepo,
  ];

  this.user = {
    repos: this.repos(),
  };

  // Octokat API will sometimes return array or an iterable object;
  // this fake needs to simulate both behaviours.
  this.repoInfo.issues = fakeRepo.issues;
}

Octokat.prototype.orgs = function() {
  var self = this;
  return {
    repos: self.repos(),
  };
};

Octokat.prototype.repos = function() {
  var self = this;
  return {
    fetch: function() {
      return Promise.resolve(self.repoInfo);
    },
  };
};

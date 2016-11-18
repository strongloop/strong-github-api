'use strict';

var IssueFinder = require('../lib/issue-finder');
var Octokat = require('./fixtures/fake-octokat');
var tap = require('tap');

tap.test('IssueFinder', function(t) {
  var issueFinder = new IssueFinder({
    octo: new Octokat(),
    owner: 'magicOrg',
    repo: 'fakeRepo',
  });
  t.test('find', function(t) {
    return issueFinder.find({ state: 'open' }).then(function(issues) {
      t.ok(issues, 'issues were returned');
      t.equals(issues.length, 4, 'correct number of issues returned');
    });
  });

  t.test('olderThan', function(t) {
    return issueFinder.find({ state: 'open' }).then(function(issues) {
      t.ok(issues, 'issues were returned');
      return issueFinder.olderThan(issues, '60');
    }).then(function(issues) {
      t.ok(issues, 'filtered issues were returned');
      t.equals(issues.length, 2, 'correct number of issues returned');
    });
  });
  
  t.end();
});

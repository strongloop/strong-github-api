'use strict';

var Octokat = require('./fixtures/fake-octokat');
var milestoneGenerator = require('../index').milestoneGenerator;
var tap = require('tap');

tap.test('milestone-generator', function(t) {
  var octo = new Octokat({
    token: 'fake-token',
  });
  t.test('org', function(t) {
    return milestoneGenerator({
      octo: octo,
      title: 'test-milestone',
      dueOn: '2016-12-26T00:00:00Z',
      org: 'fake-org',
      description: 'A test milestone made by strong-github-api',
    }).then(function(result) {
      t.ok(result, 'returned a thing');
    });
  });

  t.test('user', function(t) {
    return milestoneGenerator({
      octo: octo,
      title: 'test-milestone',
      dueOn: '2016-12-26T00:00:00Z',
      user: 'fake-user',
      description: 'A test milestone made by strong-github-api',
    }).then(function(result) {
      t.ok(result, 'returned a thing');
    });
  });

  t.end();
});

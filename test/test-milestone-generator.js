'use strict';

var Octokat = require('./fixtures/fake-octokat');
var milestoneGenerator = require('../index').milestoneGenerator;
var tap = require('tap');
var path = require('path');

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

  t.test('list', function(t) {
    var octo = new Octokat({
      token: 'fake-token',
    });
    // Repos will not be an array when called this way in Octokat!
    octo.repoInfo = octo.fakeRepo;
    return milestoneGenerator({
      octo: octo,
      title: 'test-milestone',
      dueOn: '2016-12-26T00:00:00Z',
      user: 'fake-user',
      description: 'A test milestone made by strong-github-api',
      list: path.resolve('test', 'fixtures', 'fake-repos.json'),
    }).then(function(result) {
      t.ok(result, 'returned a thing');
    });
  });

  t.test('list fails on bogus repos', function(t) {
    var octo = new Octokat({
      token: 'fake-token',
    });
    // Repos will not be an array when called this way in Octokat!
    octo.repoInfo = octo.fakeRepo;
    octo.repos = function(org, name) {
      return {
        fetch: function() {
          return name === octo.repoInfo.name ?
            Promise.resolve(octo.fakeRepo) :
            Promise.reject(new Error('Not Found'));
        },
      };
    };
    return milestoneGenerator({
      octo: octo,
      title: 'test-milestone',
      dueOn: '2016-12-26T00:00:00Z',
      user: 'fake-user',
      description: 'A test milestone made by strong-github-api',
      list: path.resolve('test', 'fixtures', 'fake-repos-bad.json'),
    }).catch(function(err) {
      t.ok(err, 'returned error');
      t.contains(err.message, 'Not Found', 'message was correct');
    });
  });

  t.end();
});

var should = require('should')
  , Monk = require('monk')
  , MangoModel = require('mangomodel')
  , MangoModelSearch = require('../index.js')
  , fixtures = require('./data/mongo_fixtures.js')
  , ObjectId = require('mongodb/node_modules/bson').ObjectID
  , _ = require('underscore');

var db = Monk('127.0.0.1/mangomodel-search-test');
MangoModel.setDb(db);

beforeEach(function(done) {
  fixtures.load(db, function() {
    MangoModel.models = [];
    done();
  });
});

describe('MangoModelSearch', function() {
  it('should have a default query limit', function(done) {
    var Ants = MangoModel.create('ants');
    // Mix in the search method
    Ants.methods(MangoModelSearch());

    Ants.search(function(err, ants) {
      ants.should.have.length(20);
      done();
    });
  });
  it('should be able to set default query limit', function(done) {
    var Ants = MangoModel.create('ants');
    // Mix in the search method
    Ants.methods(MangoModelSearch({$limit: 15}));

    Ants.search(function(err, ants) {
      ants.should.have.length(15);
      done();
    });
  });
  it('should be able to override default query limit', function(done) {
    var Ants = MangoModel.create('ants');
    // Mix in the search method
    Ants.methods(MangoModelSearch());

    Ants.search({$limit: 17}, function(err, ants) {
      ants.should.have.length(17);
      done();
    });
  });
  it('should sort results by created_at in descending order by default', function(done) {
    var Ants = MangoModel.create('ants');
    // Mix in the search method
    Ants.methods(MangoModelSearch());

    Ants.search(function(err, ants) {
      ants.should.have.length(20);

      var oldAnt = null;
      _.forEach(ants, function(ant) {
        if (oldAnt){
          oldAnt.created_at.should.be.above(ant.created_at);
        }
        oldAnt = ant;
      });
      done();
    });
  });
  it('should be able to set default sort by to created_at in ascending order', function(done) {
    var Ants = MangoModel.create('ants');
    // Mix in the search method
    Ants.methods(MangoModelSearch({$sort: 'created_at,asc'}));

    Ants.search(function(err, ants) {
      ants.should.have.length(20);

      var oldAnt = null;
      _.forEach(ants, function(ant) {
        if (oldAnt){
          oldAnt.created_at.should.be.below(ant.created_at);
        }
        oldAnt = ant;
      });
      done();
    });
  });
  it('should be able to override default sort by to created_at in ascending order', function(done) {
    var Ants = MangoModel.create('ants');
    // Mix in the search method
    Ants.methods(MangoModelSearch());

    Ants.search({$sort: 'created_at,asc'}, function(err, ants) {
      ants.should.have.length(20);

      var oldAnt = null;
      _.forEach(ants, function(ant) {
        if (oldAnt){
          oldAnt.created_at.should.be.below(ant.created_at);
        }
        oldAnt = ant;
      });
      done();
    });
  });
  it('should return only results from a data point', function(done) {
    var Ants = MangoModel.create('ants');
    // Mix in the search method
    Ants.methods(MangoModelSearch());

    Ants.search({$from: new Date("2012-09-25T00:17:00.000Z")}, function(err, ants) {
      ants.should.have.length(18);
      done();
    });
  });
  it('should return only results until a data point', function(done) {
    var Ants = MangoModel.create('ants');
    // Mix in the search method
    Ants.methods(MangoModelSearch());

    Ants.search({$until: new Date("2012-09-25T00:17:00.000Z")}, function(err, ants) {
      ants.should.have.length(13);
      done();
    });
  });
});

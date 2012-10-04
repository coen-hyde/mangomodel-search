var async = require('async')
  , monk = require('monk')
  , ObjectId = require('mongodb/node_modules/bson').ObjectID
  , _ = require('underscore');

module.exports = {
  load: function(db, cb) {
    var documents = [];
    var numDocs = 30;
    for (var num = 0; num < numDocs; num = ++num) {
      // pad number. What's a better way to do this?
      var inc = (new Array(1+numDocs.toString().length-num.toString().length).join("0"))+num;
      documents.push({
        _id: ObjectId('aa00000000000000000000' + inc),
        email: 'dumbarse-' + inc + '@test.kondoot.com',
        created_at: new Date("2012-09-25T00:" + inc + ":00.000Z")
      });
    }
    
    documents = _.shuffle(documents);

    var ants = db.get('ants');
    ants.drop(function() {
      async.forEach(documents, function(document, done) {
        ants.insert(document, done);
      }, cb);
    });
  }
};

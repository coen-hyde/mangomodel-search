
var limitOption = function(config, options) {
  var limit = config.$limit;
  if (typeof options['$limit'] !== "undefined") {
    limit = parseInt(options['$limit']);
  }

  return limit;
};

var sortOption = function(config, options) {
  var sort = (options['$sort'] || config.$sort);
  if (typeof sort !== "undefined") {
    sort = sort.split(',');
    if (sort[1] && sort[1] === 'desc') {
      sort[1] = -1;
    }
    else {
      sort[1] = 1;
    }
  }

  return sort;
};

module.exports = function(config) {
  config = (config || {});
  config.$limit = (config.$limit || 20);
  config.$sort = (config.$sort || 'created_at,desc');

  return {
    search: function(options, cb) {
      if (typeof(options) === 'function') {
        var cb = options;
        var options = {};
      }
      if (typeof(cb) !== 'function') {
        var stream = true;
      }
      else {
        var stream = false;
      }

      var limit = limitOption(config, options);
      var sort = sortOption(config, options);
      
      var queryOptions = {stream: stream, limit: limit, sort: [sort]};
      
      var query = this.getCollection().col.find({'deleted': {'$ne': true}}, queryOptions);
      if (stream) {
        return query;
      }

      return query.toArray(cb);
    }
  }
};

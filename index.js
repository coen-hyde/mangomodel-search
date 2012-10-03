
var limitOption = function(config, options) {
  var limit = config.$limit;
  if (typeof options['$limit'] !== "undefined") {
    limit = parseInt(options['$limit']);
  }

  return limit;
};

var sortLookups = {
  "desc": -1
};

var sortOption = function(config, options) {
  var sort = (options['$sort'] || config.$sort);

  // if we have been provided a string, then split it
  if (typeof sort == "string" || (sort instanceof String)) {
    sort = sort.split(',');
  }

  // if we have a sort array (which we should), then ensure we have a valid
  // integer value for the second arg
  if (Array.isArray(sort)) {
    sort[1] = parseInt(sort[1], 10) || sortLookups[(sort[1] || '').toLowerCase()] || 1;
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
      
      var query = {'deleted': {'$ne': true}};
      var queryOptions = {stream: stream, limit: limit, sort: [sort]};
      
      if (options['$after']) {
        query[sort[1] > 0 ? '$gte' : '$lte'] = options['$after'];
      }

      var cursor = this.getCollection().col.find(query, queryOptions);
      if (stream) {
        return cursor;
      }

      return cursor.toArray(cb);
    }
  }
};

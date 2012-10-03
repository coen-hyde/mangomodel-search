var _ = require('underscore');

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

      var propertySearch = _.pick(options, _.filter(_.keys(options), function(property) {
        return (property.substr(0,1) !== '$');
      }));
      
      // replace regex searches with regex queries
      _.each(propertySearch, function(value, key) {
        if(value.length > 0 && value[0] === '/' && value[value.length-1] === '/') {
          propertySearch[key] = {'$regex': value.substring(1,value.length-1)};
        }
      });

      var limit = limitOption(config, options);
      var sort = sortOption(config, options);
      
      var query = _.extend(propertySearch, {'deleted': {'$ne': true}});
      var queryOptions = {stream: stream, limit: limit, sort: [sort]};
      
      if (options['$from']) {
        var from = {};
        from[sort[1] > 0 ? '$gte' : '$lte'] = options['$from'];
        query[sort[0]] = from;
      }
      if (options['$until']) {
        var until = {};
        until[sort[1] > 0 ? '$lte' : '$gte'] = options['$until'];
        query[sort[0]] = until;
      }

      var cursor = this.getCollection().col.find(query, queryOptions);
      if (stream) {
        return cursor;
      }

      return cursor.toArray(cb);
    }
  }
};

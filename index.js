
var limitOption = function(config, options) {
  var limit = config.limit;
  if (typeof options['$limit'] !== "undefined") {
    limit = parseInt(options['$limit']);
  }

  return limit;
};

var sortOption = function(config, options) {
  var sort = config.sort;
  if (typeof options['$sort'] !== "undefined") {
    sort = options['$sort'].split(',')
    if (sort[1] && sort[1] === 'desc') {
      sort[1] = -1;
    }
    else {
      sort[1] = 1;
    }
  }

  return sort;
};

modele.exports = function(config) {
  config.limit = (config.limit || 20);
  config.sort = (config.sort || ['created_at', -1]);

  return {
    search: function(options) {
      var limit = limitOption(config, options);
      var sort = sortOption(config, options);
      
      var query = this.where('deleted', false);
      query.sort.apply(query, sort);
      query.limit(limit);

      return query;
    }
  }
};

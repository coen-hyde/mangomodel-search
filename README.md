MangoModel Search
=================

This is a mix in for Mango Model to assist searching mongo collections.

Initialisation
--------------

```js
var MangoModel = require('mangomodel');
var MangoModelSearch = require('mangomodel-search');

// Create your model
var Ants = MangoModel.create('ants');

// Mix in the search method
Ants.methods(MangoModelSearch());

// or set some defaults
Ants.methods(MangoModelSearch({ $limit: 100, $sort: 'friends,desc' }));
```

Options
-------

*  $limit - Limit the number of results returned from a search. Default is 20

*  $sort - Specify the property and method to sort by. Syntax is property name followed by an optional comma and sort method. eg. "age,desc". Default is "created_at,desc"

*  $from - A data point to return results only after and including from that point. The property this data point refers to is determined by the sort option. eg. By defaut sort is sorting the created_at property in descending order. Therefore If you specify a from option it's value must be date and the query will return all results created less than and including the date provided in the from option.

*  $until - Similar to from but in reverse. Using the created_at example again. If a until is specified instead of from, it will return all results upto and including the value provided in the until option.

Examples
--------

```js
// no options
Ants.search(function(err, ants) {
  // returns a list of ants with the default limit and sort applied
});

// With options
Ants.search({ $limit: 50 }, function(err, ants) {
  // returns 50 ants sorted by default sort
});

// Using $from with sort in descending order. Assume the column friends is an integer
Ants.search({ $sort: 'friends,desc', $from: 30 }, function(err, ants) {
  // returns all ants with 30 friends or less. Ants with the most friends will be returned first
});

// Using $from with sort in ascending order. Assume the column friends is an integer
Ants.search({ $sort: 'friends,asc', $from: 30 }, function(err, ants) {
  // returns all ants with 30 friends or more. Ants with the least friends will be returned first
});

// Using $until with sort in descending order. Assume the column friends is an integer
Ants.search({ $sort: 'friends,desc', $until: 30 }, function(err, ants) {
  // returns all ants with 30 friends or more. Ants with the most friends will be returned first
});

// Using $until with sort in ascending order. Assume the column friends is an integer
Ants.search({ $sort: 'friends,asc', $until: 30 }, function(err, ants) {
  // returns all ants with 30 friends or less. Ants with the least friends will be returned first
});
```

Property Searching
------------------

It is also possible search on any field. Any options provided that do not begin with a '$' will be considered property searches. eg

```js
// no options
Ants.search({email: 'workerant1000@sandhill.com'}, function(err, ants) {
  // will only return ants with the email address 'workerant1000@sandhill.com'
});
```

Just be aware searching on any property could result in significant performance impacts if the property being searched on is not indexed.

Property Searching with Regex
-----------------------------

To do more complicated searches, such as wild cards, you can use regex. To use regex, make sure you begin your regex query with a /. eg

```js
// no options
Ants.search({email: '/(.*)@sandhill.com$/'}, function(err, ants) {
  // will only return ants with the email address ending in '@sandhill.com'
});

Regex's should be avioded where ever possible. They come with a significant performance impact.
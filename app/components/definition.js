'use strict';

angular.module('evid.definition', [])

.service('definition', ['$http', '$q', 'url', 'registry', function definition($http, $q, url, registry) {;

  /**
   * Requests the API definition of the endpoint which was provided through the
   * url config value. Returns a promise which contains the definition if it 
   * gets resolved. The response is saved in the global registry so we make the
   * http request only once
   */
  this.initialize = function() {
    if (registry.has('definition')) {
      return $q(function(resolve, reject) {
        resolve(registry.get('definition'));
      });
    }

    return $q(function(resolve, reject) {
      $http.get(url).then(function(response) {
        registry.set('definition', new def(response.data));
        resolve(registry.get('definition'));
      }, function() {
        reject();
      });
    });
  };

  function def(api) {

    this.api = api;

    this.getRoutings = function() {
      var routings = [];

      // check whether the routing is not in the excluded list
      if (angular.isArray(this.api.routings)) {
        if (angular.isArray(evid.exclude)) {
          for (var i = 0; i < this.api.routings.length; i++) {
            var exclude = false;
            for (var j = 0; j < evid.exclude.length; j++) {
              if (this.api.routings[i].path.match(evid.exclude[j])) {
                exclude = true;
                break;
              }
            }

            if (!exclude) {
              routings.push(this.api.routings[i]);
            }
          }
        } else {
          routings = this.api.routings;
        }
      }

      return routings;
    }

    this.getLinkByRel = function(rel) {
      if (this.api && this.api.links && angular.isArray(this.api.links)) {
        for (var i = 0; i < this.api.links.length; i++) {
          if (this.api.links[i].rel == rel) {
            return this.api.links[i].href;
          }
        }
      }

      return null;
    };

  }

}]);

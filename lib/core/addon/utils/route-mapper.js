/* global requirejs, require, config */

import Ember from 'ember';

export default function routeMapper(Router, modulePrefix) {

  const resources = {};
  const paths = {};

  Ember.keys(requirejs._eak_seen).forEach(function(key) {
    if (/router$/.test(key) && key.indexOf(modulePrefix) === -1) {
      var module = require(key, null, null, true);
      if (!module || !module.default) {
        throw new Error(key + ' must export a route map.');
      }

      var mapObj = module.default;

      if (typeof mapObj === 'function') {
        mapObj = {
          resource: 'root',
          map: mapObj
        };
      }

      if (!resources[mapObj.resource]) {
        resources[mapObj.resource] = [];
      }
      resources[mapObj.resource].push(mapObj.map);
      if (mapObj.path) {
        paths[mapObj.resource] = mapObj.path;
      }
    }
  });

  // Do the root resources first
  if (resources.root) {
    resources.root.forEach(function(m) {
      m.call(Router);
    });
    delete resources.root;
  }

  var segments = {},
    standalone = [];

  Object.keys(resources).forEach(function(r) {
    var m = /^([^\.]+)\.(.*)$/.exec(r);
    if (m) {
      segments[m[1]] = m[2];
    } else {
      standalone.push(r);
    }
  });

  // Apply other resources next. A little hacky but works!
  standalone.forEach(function(r) {
    Router.resource(r, {
      path: paths[r]
    }, function() {
      var res = this;
      resources[r].forEach(function(m) {
        m.call(res);
      });

      var s = segments[r];
      if (s) {
        var full = r + '.' + s;
        res.resource(s, {
          path: paths[full]
        }, function() {
          var nestedRes = this;
          resources[full].forEach(function(m) {
            m.call(nestedRes);
          });
        });
      }
    });
  });

  Router.route('unknown', {
    path: '*path'
  });
};

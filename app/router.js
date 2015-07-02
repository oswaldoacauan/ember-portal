import Ember from 'ember';
import config from './config/environment';

import RouteMapper from 'core/utils/route-mapper';


var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  RouteMapper(this, config.modulePrefix);
});

export default Router;

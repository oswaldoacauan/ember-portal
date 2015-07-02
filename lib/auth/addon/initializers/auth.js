import Auth from '../services/auth';

export function initialize(container, application) {
  container.register('service:auth', Auth);
  container.injection('route', 'auth:index', 'service:auth');
  container.injection('route', 'auth:forgot', 'service:auth');
}

export default {
  name: 'auth',
  initialize: initialize
};

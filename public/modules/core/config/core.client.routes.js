'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {
    // Redirect to home view when route not found
    $urlRouterProvider.otherwise('/');

    // Home state routing
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'modules/core/views/home.client.view.html'
      })
      .state('start', {
        url: '/start',
        templateUrl: 'modules/core/views/start.client.view.html'
      })
      .state('sound-test', {
        url: '/sound-test',
        templateUrl: 'modules/core/views/sound-test.client.view.html'
      })
      .state('eda-instructions', {
        url: '/eda-instructions',
        templateUrl: 'modules/core/views/eda-instructions.client.view.html'
      })
      .state('pox-instructions', {
        url: '/pox-instructions',
        templateUrl: 'modules/core/views/pox-instructions.client.view.html'
      })
      .state('signal-test', {
        url: '/signal-test',
        templateUrl: 'modules/core/views/signal-test.client.view.html'
      })
      .state('demographics', {
        url: '/demographics',
        templateUrl: 'modules/core/views/demographics.client.view.html'
      });
  }
]);
'use strict';

/**
 * This **is not**, in fact, a class, but rather a file for defining the
 * routes that are used in your application. You should only need to edit
 * this file if you wish to add *new* routes.
 *
 * The file configures Angular UI's
 * [`$stateProvider`](https://github.com/angular-ui/ui-router/wiki) to create
 * the routes. Each route is created by a single call to
 * [`$stateProvider.state()`](http://angular-ui.github.io/ui-router/site/#/api/ui.router.state.$stateProvider#methods_state).
 *
 * The following is a snippet of the top several lines of the file. The
 * first six lines can be ignored. The call to `$stateProvider.state()` is
 * the first of many such calls in the file. This call in particular
 * configures the `'home'` state. Based on the information given in this
 * call, the `'home'` state will be accessible by browsing to the root path
 * of the application (`http://<YOURSERVER>:3000/`). The app will use the
 * file at `templateURL` (here, `modules/core/views/home.client.view.html`)
 * to render this state.
 *
 * To add your own state, simply add another call to
 * `$stateProvider.state()`. The name of the state should match the name of
 * the slide in your schema structure document (see the [README](index.html)).
 *
 * @example
 *
 * angular.module('core').config(['$stateProvider', '$urlRouterProvider',
 *     function ($stateProvider, $urlRouterProvider) {
 *
 *         // Redirect to home view when route not found
 *         $urlRouterProvider.otherwise('/');
 *
 *         // Home state routing
 *         $stateProvider
 *             .state('home', {
 *                 url: '/',
 *                 templateUrl: 'modules/core/views/home.client.view.html'
 *             })
 *
 *         ...
 *
 * @class Angular.Routes
 * @memberof Angular
 */

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {

        var $log =  angular.injector(['ng']).get('$log');
        $log.debug('Configuring routes in' +
            ' modules/core/config/core.client.routes.js');

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
            .state('consent-form', {
                url: '/consent-form',
                templateUrl: 'modules/core/views/consent-form.client.view.html'
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
            })
            .state('musical-background', {
                url: '/musical-background',
                templateUrl: 'modules/core/views/musical-background.client.view.html'
            })
            .state('media-playback', {
                url: '/media-playback',
                templateUrl: 'modules/core/views/media-playback.client.view.html'
            })
            .state('questionnaire', {
                url: '/media-questionnaire',
                templateUrl: 'modules/core/views/media-questionnaire.client.view.html'
            })
            .state('emotion-index', {
                url: '/emotion-index',
                templateUrl: 'modules/core/views/emotion-index.client.view.html'
            })
            .state('thank-you', {
                url: '/thank-you',
                templateUrl: 'modules/core/views/thank-you.client.view.html'
            });
    }
]);

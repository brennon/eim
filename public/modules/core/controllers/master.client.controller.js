'use strict';

/**
 * In the demo application, the `MasterController` is persistent throughout
 * an experiment session and provides a number of 'session-wide' facilities.
 * These include restarting a session, exposing the {@link
 * Angular.TrialData|TrialData} service, changing the language, configuring
 * hotkeys, showing alerts, and blacking out the screen.
 *
 * The hotkeys are configured using the
 * [angular-hotkeys](https://github.com/chieffancypants/angular-hotkeys)
 * module. In particular, pressing `'d'` twice will toggle debugging mode. When
 * in debugging mode, the right arrow key will allow the user to advance to
 * the next slide. Also, in debugging mode, nothing blocks the user from
 * advancing through slides (e.g., the user can advance irrespective of
 * whether or not Max is ready).
 *
 * @class Angular.MasterController
 */

angular.module('core').controller(
    'MasterController',
    [
        '$scope',
        'TrialData',
        'hotkeys',
        'ExperimentManager',
        'gettextCatalog',
        '$state',
        '$timeout',
        '$log',
        '$http',
        'OSC',
        function($scope, TrialData, hotkeys, ExperimentManager, gettextCatalog,
                 $state, $timeout, $log, $http, OSC) {

            $log.debug('Loading MasterController.');

            /**
             * The `MasterController`'s `$scope` object. All properties on
             * `$scope` are available to the view.
             *
             * @name $scope
             * @namespace
             * @instance
             * @memberof Angular.MasterController
             * @type {{}}
             */
            var thisController = this;

            /**
             * Sets the language to the default language as specified in the
             * {@link Node.module:CustomConfiguration~customConfiguration~defaultLanguage|CustomConfiguration}
             * module.
             *
             * @function setLanguageToDefault
             * @memberof Angular.MasterController
             * @instance
             * @return {undefined}
             */
            this.setLanguageToDefault = function() {
                $http.get('/api/config')
                    .then(function(response) {

                        if (response.data.hasOwnProperty('defaultLanguage')) {
                            $scope.setLanguage(response.data.defaultLanguage);
                        } else {
                            var message = 'A default language was not ' +
                                'provided by the server.';
                            $log.error(message, response);
                            throw new Error(message);
                        }
                    })
                    .catch(function(response) {
                        var message = 'There was a problem retrieving the' +
                            ' configuration from the server.';
                        $log.error(message, response);
                        throw new Error(message);
                    });
            };
            this.setLanguageToDefault();

            /**
             * Expose {@link Angular.TrialData#toJson|TrialData#toJson} on
             * `$scope`. Calling this method returns the result of calling
             * {@link Angular.TrialData#toJson|TrialData#toJson}.
             *
             * @function trialDataJson
             * @memberof Angular.MasterController#$scope
             * @instance
             * @type {{}}
             */
            $scope.trialDataJson = function() {
                return TrialData.toJson();
            };

            /**
             * Set the current language used for displaying content. Ensure
             * that you have translations available and compiled (see the
             * [README](index.html)).
             *
             * @function setLanguage
             * @memberof Angular.MasterController#$scope
             * @instance
             * @param {string} language The language code of the language to use
             * @return {undefined}
             */
            $scope.setLanguage = function(language) {

                $log.debug('MasterController setting language to \'' +
                    language + '\'.');

                gettextCatalog.setCurrentLanguage(language);
                TrialData.language(language);
            };

            /**
             * Return to the `'home'` state.
             *
             * @function startOver
             * @memberof Angular.MasterController#$scope
             * @instance
             * @return {undefined}
             */
            $scope.startOver = function() {

                $log.debug('MasterController starting over.');

                $state.go('home', {}, {reload: true});

                $scope.debugMode = false;

                $scope.alerts = [];

                thisController.setLanguageToDefault();
            };

            /**
             * Resets the inactivity timeout.
             *
             * The demo application ships with an inactivity timeout. If
             * after five minutes no interaction with the experiment has
             * occurred, this timeout fires and calls {@link
             * Angular.MasterController#$scope#startOver|$scope#startOver}
             * method.
             *
             * @function resetInactivityTimeout
             * @memberof Angular.MasterController
             * @instance
             * @return {undefined}
             */
            // Reset inactivity timeout with a new five-minute timer
            this.resetInactivityTimeout = function() {

                $log.debug('MasterController resetting inactivity timeout.');

                $timeout.cancel(thisController.inactivityTimeout);
                thisController.inactivityTimeout = $timeout(
                    thisController.startOver,
                    5 * 60 * 1000
                );
            };
            this.resetInactivityTimeout();

            /**
             * Resets the inactivity timeout and Advances the slide by calling
             * {@link
             * Angular.ExperimentManager#advanceSlide|ExperimentManager#advanceSlide}.
             *
             * @function advanceSlide
             * @memberof Angular.MasterController#$scope
             * @instance
             * @return {undefined}
             */
            $scope.advanceSlide = function() {

                $log.debug('MasterController advancing slide.');

                // Reset the inactivity timeout
                thisController.resetInactivityTimeout();

                // Wrap ExperimentManager's advance slide
                ExperimentManager.advanceSlide();
            };

            /**
             * Indicates whether or not debugging mode is enabled.
             *
             * @name debugMode
             * @memberof Angular.MasterController#$scope
             * @type {boolean}
             */
            $scope.debugMode = false;

            /**
             * Toggles debugging mode. If debugging mode is enabled, an
             * alert is posted to the view.
             *
             * @function toggleDebugMode
             * @instance
             * @memberof Angular.MasterController#$scope
             * @return {undefined}
             */
            $scope.toggleDebugMode = function() {

                $scope.debugMode = !$scope.debugMode;
                var alertMessage = 'Debug mode has been ';
                if ($scope.debugMode) {
                    $log.info('Debug mode enabled.');
                    alertMessage += 'enabled.';
                } else {
                    $log.info('Debug mode disabled.');
                    alertMessage += 'disabled.';
                }

                $scope.addAlert({type: 'info', msg: alertMessage});
            };

            // Setup hotkeys
            $log.debug('Setting up hotkeys.');
            hotkeys.add({
                combo: 'd d',
                description: 'Toggle debug mode',
                callback: $scope.toggleDebugMode
            });

            hotkeys.add({
                combo: 'right',
                description: 'Advance slide',
                callback: $scope.advanceSlide
            });

            /**
             * Array for holding alert messages.
             *
             * @name alerts
             * @type {string[]}
             * @memberof Angular.MasterController#$scope
             * @instance
             */
            $scope.alerts = [];

            /**
             * Adds an alert to {@link
             * Angular.MasterController#$scope#alerts|$scope#alerts}, unless
             * it is already present.
             *
             * @function addAlert
             * @memberof Angular.MasterController#$scope
             * @instance
             * @param {{}} alert This object should have two properties:
             * `msg` and `type`. The value of the `msg` property should be
             * the alert `string`, and the value of the `type` property should
             * be a `string` indicating the alert type. Acceptable values
             * for alerty types are: `'success'`, `'info'`, `'warning'`, and
             * `'danger'`.
             * @return {undefined}
             */
            $scope.addAlert = function(alert) {

                var errorExists = false;
                for (var i = 0; i < $scope.alerts.length; i++) {
                    if ($scope.alerts[i].msg === alert.msg &&
                        $scope.alerts[i].type === alert.type) {

                        $log.debug('Not adding ' + alert.msg + ' to visible' +
                            ' alerts, as it already exists in $scope.alerts.');
                        errorExists = true;
                        break;
                    }
                }

                if (!errorExists) {
                    $log.debug('Adding \'' + alert.msg + '\' to' +
                        ' $scope.alerts.');
                    $scope.alerts.push(alert);
                }
            };

            /**
             * Closes the alert in {@link
             * Angular.MasterController#$scope#alerts|$scope#alerts} at the
             * specified index.
             *
             * @function closeAlert
             * @memberof Angular.MasterController#$scope
             * @instance
             * @param {number} index The index in the {@link
             * Angular.MasterController#$scope#alerts|$scope#alerts} array
             * of the alert to close
             * @return {undefined}
             */
            $scope.closeAlert = function(index) {
                $log.debug('Closing alert at index ' + index + ': \'' +
                    $scope.alerts[index].msg + '\'');
                $scope.alerts.splice(index, 1);
            };

            /**
             * Adds a generic error alert to {@link
             * Angular.MasterController#$scope#alerts|$scope#alerts}. The
             * alert is a `'danger'`-type alert, and in the demo app
             * displays the message `'There seems to be a problem. Please
             * contact a mediator for assistance.'`
             *
             * @function addGenericErrorAlert
             * @memberof Angular.MasterController#$scope
             * @instance
             * @return {undefined}
             */
            $scope.addGenericErrorAlert = function() {
                $log.debug('Adding generic error alert.');
                $scope.addAlert({
                    type: 'danger',
                    msg: 'There seems to be a problem. Please contact a ' +
                        'mediator for assistance.'
                });
            };

            /**
             * A flag indicating whether or not the 'blackout' class should
             * be added to the body of the visible page. When this is
             * `true`, the page is blacked out.
             *
             * @name blackoutClass
             * @memberof Angular.MasterController#$scope
             * @instance
             * @type {boolean}
             */
            $scope.blackoutClass = false;

            /**
             * A convenience method for setting {@link
             * Angular.MasterController#$scope#blackoutClass|$scope#blackoutClass}
             * to `true` (and blacking out the page).
             *
             * @function hideBody
             * @memberof Angular.MasterController#$scope
             * @instance
             * @return {undefined}
             */
            $scope.hideBody = function() {
                $log.debug('Hiding body.');
                $scope.blackoutClass = true;
            };

            /**
             * A convenience method for setting {@link
                * Angular.MasterController#$scope#blackoutClass|$scope#blackoutClass}
             * to `false` (and reversing the blacking out of the page).
             *
             * @function showBody
             * @memberof Angular.MasterController#$scope
             * @instance
             * @return {undefined}
             */
            $scope.showBody = function() {
                $log.debug('Showing body.');
                $scope.blackoutClass = false;
            };

            /**
             * A convenience method for toggling the value of {@link
                * Angular.MasterController#$scope#blackoutClass|$scope#blackoutClass}.
             *
             * @function toggleBodyVisibility
             * @memberof Angular.MasterController#$scope
             * @instance
             * @return {undefined}
             */
            $scope.toggleBodyVisibility = function() {
                $log.debug('Toggling body visibility.');
                $scope.blackoutClass = !$scope.blackoutClass;
            };
        }
    ]);
'use strict';

/**
 * The `ExperimentManager` service has two main responsibilities: managing
 * the state (the 'slide' that is presented to the user) and the
 * {@link Angular.TrialData|TrialData} service.
 *
 * @class Angular.ExperimentManager
 * @memberof Angular
 */

angular.module('core').factory('ExperimentManager', [
    'TrialData',
    '$q',
    '$http',
    '$state',
    '$log',
    'rfc4122',
    '$rootScope',
    'lodash',
    function(TrialData, $q, $http, $state, $log, rfc4122, $rootScope, lodash) {

        $log.debug('Instantiating ExperimentManager service.');

        // Attach an event listener for $rootScope's $stateChangeStart
        // events and set stateChanging to true when these events are emitted
        function stateChangeStartListener() {
            returnObject.stateChanging = true;
        }
        $rootScope.$on('$stateChangeStart', stateChangeStartListener);

        // Attach an event listener for $rootScope's $stateChangeSuccess
        // events and set stateChanging to false when these events are emitted
        function stateChangeSuccessListener() {
            returnObject.stateChanging = false;
        }
        $rootScope.$on('$stateChangeSuccess', stateChangeSuccessListener);

        var returnObject = {

            /**
             * Advances the state to the next state as defined in the study
             * specification document (see the [README](index.html)).
             *
             * @function advanceSlide
             * @instance
             * @memberof Angular.ExperimentManager
             * @return {undefined}
             */
            advanceSlide: function() {

                if (!this.stateChanging) {

                    TrialData.data.state.currentSlideIndex++;

                    var currentSlideIndex =
                        TrialData.data.state.currentSlideIndex;

                    if (currentSlideIndex === TrialData.data.schema.length) {
                        $state.go('home', {}, {reload: true});
                    } else {
                        var timestamp = new Date();
                        TrialData.data.timestamps.push(
                            {
                                slide: TrialData.data.schema[TrialData.data.state.currentSlideIndex].name,
                                timestamp: timestamp.toISOString()
                            });

                        $state.go(
                            TrialData.data.schema[currentSlideIndex].name,
                            {},
                            {reload: true}
                        );
                    }
                }
            },

            generatePlot: function() {
                $http.get('/api/generate-plots/' + TrialData.metadata.session_number + '/' + TrialData.data.media[TrialData.data.state.currentSlideIndex].label);
            },

            /**
             * Resets the experiment session.
             *
             * In resetting the session, after resetting the {@link
             * Angular.TrialData|TrialData} service, `masterReset()` does
             * the following:
             *
             *  - Generates a new UUID for the session number
             *  - Fetches a random experiment schema from the backend
             *  - Gets the custom metadata (as specified in
             *  `config/custom.js`
             *
             *  The {@link Angular.TrialData|TrialData} service is then updated
             *  with these new data.
             *
             * @function masterReset
             * @memberof Angular.ExperimentManager
             * @instance
             * @return {$q.promise} This promise is resolved when the reset
             * is complete and rejected if the reset fails.
             */
            masterReset: function() {

                var deferred = $q.defer();

                // Reset TrialData
                TrialData.reset();

                // Get a new experiment setup from the backend
                $http.get('/api/experiment-schemas/random')
                    .success(function(data) {

                        // Assign the media property from the ExperimentSchema
                        // we received as the media property on the TrialData
                        TrialData.data.media = data.media;
                        TrialData.data.schema = data.structure;

                        // Get custom configuration information from the backend
                        $http.get('/api/config')
                            .success(function(data) {

                                // Specify this terminal from custom config
                                TrialData.data.metadata =
                                    lodash.merge(
                                        TrialData.data.metadata,
                                        data.metadata
                                    );

                                // Generate new session identifier and store it
                                // in TrialData
                                TrialData.data.metadata.session_number =
                                    rfc4122.v4();

                                // Get default language and set on TrialData
                                if (data.hasOwnProperty('defaultLanguage') &&
                                    typeof data.defaultLanguage === 'string' &&
                                    data.defaultLanguage.length > 0) {

                                    TrialData.data.metadata.language =
                                        data.defaultLanguage;
                                }

                                if (data.hasOwnProperty('exportedProperties') &&
                                    Array.isArray(data.exportedProperties)) {

                                    TrialData.exportedProperties =
                                        data.exportedProperties;
                                }

                                deferred.resolve();
                            })
                            .error(function() {
                                deferred.reject('The configuration could not' +
                                    'be fetched from the server.');
                            });
                    })
                    .error(function() {
                        deferred.reject('An experiment schema could not be ' +
                            'fetched from the server');
                    });

                return deferred.promise;
            },

            /**
             * Reflects the current state as reported by Angular's
             * `$stateProvider`. When the state is changing (a new 'slide'
             * is being presented--typically after a call to {@link
             * Angular.ExperimentManager#advanceSlide advanceSlide}, this
             * will be set to `true`. When the change completes, this will
             * be set to `true`.
             *
             * @var stateChanging
             * @memberof Angular.ExperimentManager
             * @instance
             * @type {boolean}
             */
            stateChanging: false,

            stateChangeStartListener: stateChangeStartListener,
            stateChangeSuccessListener: stateChangeSuccessListener
        };

        return returnObject;
    }
]);

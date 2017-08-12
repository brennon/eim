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
                        $state.go(
                            TrialData.data.schema[currentSlideIndex].name,
                            {},
                            {reload: true}
                        );
                    }
                }
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

                var schemaPath = '/api/experiment-schemas/random';
                var configData;

                $http.get('/api/config')
                    .then(function(response) {

                        configData = response.data;

                        // TODO: Can we not just merge TrialData and the data returned from /api/config?

                        // Are we using a random experiment schema, or a
                        // specific one?
                        if (response.data.hasOwnProperty('useRandomExperiment') &&
                            response.data.useRandomExperiment === false &&
                            response.data.hasOwnProperty('experimentId')) {

                            schemaPath = '/api/experiment-schemas/' +
                                response.data.experimentId;
                        }

                        // Specify this terminal from custom config
                        TrialData.data.metadata =
                            lodash.merge(
                                TrialData.data.metadata,
                                configData.metadata
                            );

                        // Generate new session identifier and store it
                        // in TrialData
                        TrialData.data.metadata.session_number =
                            rfc4122.v4();

                        // Get default language and set on TrialData
                        if (configData.hasOwnProperty('defaultLanguage') &&
                            typeof configData.defaultLanguage === 'string' &&
                            configData.defaultLanguage.length > 0) {

                            TrialData.data.metadata.language =
                                configData.defaultLanguage;
                        }


                        if (configData.hasOwnProperty('exportedProperties') &&
                            Array.isArray(configData.exportedProperties)) {

                            TrialData.exportedProperties =
                                configData.exportedProperties;
                        }

                        // Get a new experiment setup from the backend
                        $http.get(schemaPath)
                            .then(function(response) {

                                // Assign the media property from the
                                // ExperimentSchema we received as the media
                                // property on the TrialData
                                TrialData.data.media = response.data.media;
                                TrialData.data.schema = response.data.structure;

                                deferred.resolve();
                            });
                    })
                    .catch(function(response) {
                        var message = 'There was a problem retrieving the' +
                            ' experiment schema from the server.';
                        $log.error(message, response);
                        throw new Error(message);
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

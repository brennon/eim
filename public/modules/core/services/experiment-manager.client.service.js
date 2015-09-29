'use strict';


// Trial Data service used to persist data for individual trials

/**
 * Angular service for managing experiment sessions on the frontend.
 *
 * @module experiment-manager.client.service
 * @namespace ExperimentManager
 */
angular.module('core').factory('ExperimentManager', [
    'TrialData',
    '$q',
    '$http',
    '$state',
    function(TrialData, $q, $http, $state) {

        return {

            /**
             * Advances the slide.
             *
             * @function advanceSlide
             * @memberof ExperimentManager#
             */
            advanceSlide: function() {

                TrialData.data.state.currentSlideIndex++;

                var currentSlideIndex = TrialData.data.state.currentSlideIndex;

                if (currentSlideIndex === TrialData.data.schema.length) {
                    $state.go('home', {}, {reload: true});
                } else {
                    $state.go(
                        TrialData.data.schema[currentSlideIndex].name,
                        {},
                        {reload: true}
                    );
                }
            },

            /**
             * Resets the experiment session.
             *
             * In resetting the session, after resetting the `TrialData`
             * service, `masterReset()` does the following:
             *
             *  - Generates a new UUID for the session number
             *  - Fetches a random experiment schema from the backend
             *  - Gets the terminal number (as specified in
             *  `config/custom.js` for this specific machine
             *
             *  The `TrialData` service is then updated with these new data.
             *
             * @function masterReset
             * @memberof ExperimentManager#
             */
            masterReset: function() {

                var deferred = $q.defer();

                // Reset TrialData
                TrialData.reset();

                // Generate new session identifier and store it in TrialData
                /* global UUID */
                TrialData.data.metadata.session_number = UUID.generate();

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
                                TrialData.data.metadata.terminal = data.metadata.terminal;
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
            }
        };
    }
]);

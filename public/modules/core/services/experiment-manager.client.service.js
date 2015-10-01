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
    function(TrialData, $q, $http, $state) {

        console.debug('Instantiating ExperimentManager service.');

        return {

            /**
             * Advances the state to the next state as defined in the study
             * specification document (see the [README](index.html)).
             *
             * @function advanceSlide
             * @memberof Angular.ExperimentManager.
             * @return {undefined}
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
             * In resetting the session, after resetting the {@link
             * Angular.TrialData|TrialData} service, `masterReset()` does
             * the following:
             *
             *  - Generates a new UUID for the session number
             *  - Fetches a random experiment schema from the backend
             *  - Gets the terminal number (as specified in
             *  `config/custom.js` for this specific machine
             *
             *  The {@link Angular.TrialData|TrialData} service is then updated
              *  with these new data.
             *
             * @function masterReset
             * @memberof Angular.ExperimentManager.
             * @return {$q.promise} This promise is resolved when the reset
             * is complete and rejected if the reset fails.
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

'use strict';

// Trial Data service used to persist data for individual trials
angular.module('core').factory('ExperimentManager', ['TrialData', '$q', '$http', '$state',
  function (TrialData, $q, $http, $state) {

    return {

      advanceSlide: function () {
        TrialData.data.state.currentSlideIndex++;

        if (TrialData.data.state.currentSlideIndex === TrialData.data.schema.length) {
          $state.go('home', {}, {reload: true});
        } else {
          $state.go(TrialData.data.schema[TrialData.data.state.currentSlideIndex].name, {}, {reload: true});
        }
      },

      masterReset: function () {
        var deferred = $q.defer();

        // Reset TrialData
        TrialData.reset();

        // Generate new session identifier and store it in TrialData
        /* global UUID */
        TrialData.data.metadata.session_number = UUID.generate();

        // Get a new experiment setup from the backend
        $http.get('/api/experiment-schemas/random')
          .success(function (data) {
            // Assign the media property from the ExperimentSchema we received as the media property on the TrialData
            TrialData.data.media = data.media;
            TrialData.data.schema = data.structure;
            deferred.resolve();
          })
          .error(function () {
            deferred.reject('An experiment schema could not be fetched from the server');
          });

        return deferred.promise;
      }
    };
  }
]);
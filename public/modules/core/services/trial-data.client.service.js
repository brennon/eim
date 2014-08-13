'use strict';

// Trial Data service used to persist data for individual trials
angular.module('core').factory('TrialData', [
  function() {
    var trialData = {
      answers: {
        nationality: null,
        birthyear: null,
        gender: null
      },
      metadata: {}
    };

    return trialData;
  }
]);
'use strict';

// Trial Data service used to persist data for individual trials
angular.module('core').factory('TrialData', [
  function() {
    var trialData = {
      data: {
        answers: {
          nationality: null,
          birthyear: null,
          gender: null
        },
        metadata: {}
      },
      toJson: function() {
        return angular.toJson(this.data, true);
      }
    };

    return trialData;
  }
]);
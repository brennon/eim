'use strict';

angular.module('core').controller('MasterController', ['$scope', 'TrialData',
  function($scope, TrialData) {
    $scope.trialDataJson = function() {
      return TrialData.toJson();
    };
  }
]);
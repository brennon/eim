'use strict';

angular.module('core').controller('MasterController', ['$scope', 'TrialData',
  function($scope, TrialData) {
    $scope.trialDataJson = function() {
      return TrialData.toJson();
    };

    // Store/show alerts
    $scope.alerts = [];

    $scope.addAlert = function(alert) {

      var errorExists = false;
      for (var i = 0; i < $scope.alerts.length; i++) {
        if ($scope.alerts[i].msg === alert.msg && $scope.alerts[i].type === alert.type) {
          errorExists = true;
          break;
        }
      }

      if (!errorExists) {
        $scope.alerts.push(alert);
      }
    };

    $scope.closeAlert = function(index) {
      $scope.alerts.splice(index, 1);
    };

    $scope.addGenericErrorAlert = function() {
      $scope.addAlert({type: 'danger', msg: 'There seems to be a problem. Please contact a mediator for assistance.'});
    };
  }
]);
'use strict';

angular.module('core').controller('MasterController', ['$scope', 'TrialData', 'hotkeys', 'ExperimentManager',
  function($scope, TrialData, hotkeys, ExperimentManager) {

    /*
     * Augmenting $scope
     */

    // TrialData JSON output
    $scope.trialDataJson = function() {
      return TrialData.toJson();
    };

    // Bind 'global' advanceSlide to ExperimentManager#advanceSlide
    $scope.advanceSlide = ExperimentManager.advanceSlide;

    // Global debug mode flag
    $scope.debugMode = false;
    $scope.toggleDebugMode = function() {
        $scope.debugMode = !$scope.debugMode;
        var alertMessage = 'Debug mode has been ';
        if ($scope.debugMode) {
          alertMessage += 'enabled.';
        } else {
          alertMessage += 'disabled.';
        }

        $scope.addAlert({type: 'info', msg: alertMessage});
    };

    // Setup hotkeys
    hotkeys.add({
      combo: 'd d',
      description: 'Toggle debug mode',
      callback: $scope.toggleDebugMode
    });

    /*
     * Alerts
     */
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

    $scope.blackoutClass = false;
    $scope.hideBody = function() {
      $scope.$apply(function() {
        $scope.blackoutClass = true;
      });
    };

    $scope.showBody = function() {
      $scope.$apply(function() {
        $scope.blackoutClass = false;
      });
    };

    $scope.toggleBodyVisibility = function() {
      $scope.$apply(function() {
        $scope.blackoutClass = !$scope.blackoutClass;
      });
    };
  }
]);
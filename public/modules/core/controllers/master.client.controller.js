'use strict';

angular.module('core').controller('MasterController', ['$scope', 'TrialData', 'hotkeys', 'ExperimentManager', 'gettextCatalog', '$state', '$timeout',
    function($scope, TrialData, hotkeys, ExperimentManager, gettextCatalog, $state, $timeout) {

        var thisController = this;

        // TrialData JSON output
        $scope.trialDataJson = function() {
            return TrialData.toJson();
        };

        $scope.setLanguage = function(language) {

            gettextCatalog.setCurrentLanguage(language);
            TrialData.language(language);
        };

        this.startOver = function() {
            $state.go('home', {}, {reload: true});
        };

        // Reset inactivity timeout with a new five-minute timer
        this.resetInactivityTimeout = function () {
            $timeout.cancel(thisController.inactivityTimeout);
            thisController.inactivityTimeout = $timeout(
                thisController.startOver,
                5 * 60 * 1000
            );
        };
        this.resetInactivityTimeout();

        $scope.advanceSlide = function() {
            // Reset the inactivity timeout
            thisController.resetInactivityTimeout();

            // Wrap ExperimentManager's advance slide
            ExperimentManager.advanceSlide();
        };

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

        hotkeys.add({
            combo: 'right',
            description: 'Advance slide',
            callback: $scope.advanceSlide
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
            $scope.addAlert({
                type: 'danger',
                msg: 'There seems to be a problem. Please contact a mediator for assistance.'
            });
        };

        $scope.blackoutClass = false;
        $scope.hideBody = function() {
            $scope.blackoutClass = true;
        };

        $scope.showBody = function() {
            $scope.blackoutClass = false;
        };

        $scope.toggleBodyVisibility = function() {
            $scope.blackoutClass = !$scope.blackoutClass;
        };
    }
]);
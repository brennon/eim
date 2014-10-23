'use strict';

angular.module('core').controller('HomeController', ['ExperimentManager', '$scope',
    function(ExperimentManager, $scope) {

        // Bind $scope.advanceSlide to ExperimentManager functionality
        $scope.advanceSlide = ExperimentManager.advanceSlide;

        // Reset ExperimentManager for new trial
        ExperimentManager.masterReset().then(
            function experimentResetSuccessHandler() {
                $scope.readyToAdvance = true;
            },
            function experimentResetErrorHandler() {
                $scope.addGenericErrorAlert();
                throw new Error('An experiment schema could not be fetched from the server');
            }
        );

        // Ready to move to next slide?
        $scope.readyToAdvance = false;

    }
]);
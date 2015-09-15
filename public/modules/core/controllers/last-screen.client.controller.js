'use strict';

angular.module('core').controller('LastScreenController', ['$scope', 'TrialData', '$http',
    function($scope, TrialData, $http) {
        $http.post('/api/trials', TrialData.data).success(function() {
        }).error(function() {
        });
    }
]);
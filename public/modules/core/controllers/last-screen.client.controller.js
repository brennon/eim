'use strict';

angular.module('core').controller('LastScreenController', ['$scope', 'TrialData', '$http',
    function($scope, TrialData, $http) {

        // Should chain success() and error() to post() call to log success/error
        $http.post('/api/trials', TrialData.data);
    }
]);
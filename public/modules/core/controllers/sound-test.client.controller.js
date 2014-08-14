'use strict';

angular.module('core').controller('SoundTestController', ['$scope', '$http',
  function($scope, $http) {
//    $scope.trialDataJson = function() {
//      return TrialData.toJson();
//    }

    function startSoundTest() {
      $http.get('/api/osc/send/startSoundTest');
    };

    startSoundTest();

    $scope.stopSoundTest = function() {
      console.log('***** stopping sound test');
      $http.get('/api/osc/send/stopSoundTest');
    };
  }
]);
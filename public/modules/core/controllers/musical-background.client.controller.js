'use strict';

angular.module('core').controller('MusicalBackgroundController', ['$scope', 'TrialData', 'ExperimentManager',
  function($scope, TrialData, ExperimentManager) {

    // Bind $scope.advanceSlide to ExperimentManager functionality
    $scope.advanceSlide = ExperimentManager.advanceSlide;

    // Expose TrialData on scope
    $scope.trialData = TrialData;

    // Save data to Trial Data

    $scope.musicianChanged = function(isMusician) {
      TrialData.data.answers.musical_background = isMusician.toLowerCase() === 'true';
    };

    $scope.hearingImpairmentsChanged = function(hasHearingImpairments) {
      TrialData.data.answers.hearing_impairments = hasHearingImpairments.toLowerCase() === 'true';
    };

    $scope.visualImpairmentsChanged = function(hasVisualImpairments) {
      TrialData.data.answers.visual_impairments = hasVisualImpairments.toLowerCase() === 'true';
    };

    $scope.$watch('musicalExpertise', function musicalExpertiseChanged(musicalExpertise) {
      TrialData.data.answers.musical_expertise = musicalExpertise;
    });

    $scope.stylesChanged = function() {
      var newStyles = [];
      for (var prop in $scope.subject.styles) {
        if ($scope.subject.styles.hasOwnProperty(prop)) {
          var style = prop.toString();
          if ($scope.subject.styles[style]) {
            newStyles.push(style);
          }
        }
      }
      TrialData.data.answers.music_styles = newStyles.sort();
    };

    $scope.trialDataJson = function() {
      return TrialData.toJson();
    };
  }
]);
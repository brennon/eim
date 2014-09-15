'use strict';

angular.module('core').controller('MusicalBackgroundController', ['$scope', 'TrialData',
  function($scope, TrialData) {

    // Expose TrialData on scope
    $scope.trialData = TrialData;

    // Save data to Trial Data

    // Downcase nationality for persisting
    $scope.nationalityChanged = function(nationality) {
      TrialData.data.answers.nationality = nationality.toLowerCase();
    };

    $scope.yearChanged = function(year) {
      TrialData.data.answers.birthyear = year;
    };

    $scope.genderChanged = function(gender) {
      TrialData.data.answers.gender = gender;
    };

    $scope.musicianChanged = function(isMusician) {
      TrialData.data.answers.musical_background = isMusician.toLowerCase() === "true" ? true : false;
    };

    $scope.hearingImpairmentsChanged = function(hasHearingImpairments) {
      TrialData.data.answers.hearing_impairments = hasHearingImpairments.toLowerCase() === "true" ? true : false;
    };

    $scope.visualImpairmentsChanged = function(hasVisualImpairments) {
      TrialData.data.answers.visual_impairments = hasVisualImpairments.toLowerCase() === "true" ? true : false;
    };

    $scope.$watch('musicalExpertise', function musicalExpertiseChanged(musicalExpertise) {
      TrialData.data.answers.musical_expertise = musicalExpertise;
    });

    $scope.stylesChanged = function() {
      var newStyles = [];
      for (var prop in $scope.subject.styles) {
        var style = prop.toString();
        if ($scope.subject.styles[style]) {
          newStyles.push(style);
        }
      }
      TrialData.data.answers.music_styles = newStyles.sort();
    };

    $scope.trialDataJson = function() {
      return TrialData.toJson();
    };
  }
]);
'use strict';

angular.module('core').controller('MediaQuestionnaireController', ['$scope', 'TrialData',
  function($scope, TrialData) {

    // Expose TrialData on scope
    $scope.trialData = TrialData;

    $scope.questionnaireData = {
      'name' : 'questionnaire',
      'title' : 'Media Questions',
      'structure' : [
        {
          'questionType' : 'likert',
          'questionLikertMinimum' : 1,
          'questionLikertMinimumDescription' : 'Not at all engaged, my mind was elsewhere',
          'questionLikertMaximumDescription' : 'I was engaged with the music and responding to it emotionally',
          'questionLikertMaximum' : 5,
          'questionLikertInitialValue' : 3,
          'questionLikertUseImage' : true,
          'questionLikertImageType' : 'single',
          'questionLikertSingleImageSrc' : '/modules/core/img/scale-above-positivity.png',
          'questionLabel' : 'How positive or negative did the music make you feel?',
          'questionStoragePath' : 'data.answers.ratings.positivity',
          'questionIsAssociatedToMedia': true
        },
        {
          'questionType' : 'likert',
          'questionLikertMinimumDescription' : 'Very negative',
          'questionLikertMaximumDescription' : 'Very positive',
          'questionLikertMinimum' : 1,
          'questionLikertMaximum' : 5,
          'questionLikertInitialValue' : 3,
          'questionLikertUseImage' : true,
          'questionLikertImageType' : 'extremes',
          'questionLikertLeftImageSrc' : '/modules/core/img/scale-left-engaged.png',
          'questionLikertRightImageSrc' : '/modules/core/img/scale-right-engaged.png',
          'questionLabel' : 'How involved and engaged were you with the music you have just heard?',
          'questionStoragePath' : 'data.answers.ratings.engagement',
          'questionIsAssociatedToMedia': true
        },
        {
          'questionType' : 'likert',
          'questionLikertMinimumDescription' : 'Very drowsy',
          'questionLikertMaximumDescription' : 'Very lively',
          'questionLikertMinimum' : 1,
          'questionLikertMaximum' : 5,
          'questionLikertInitialValue' : 3,
          'questionLikertUseImage' : true,
          'questionLikertImageType' : 'single',
          'questionLikertSingleImageSrc' : '/modules/core/img/scale-above-drowsylively.png',
          'questionLabel' : 'How active or passive did the music make you feel?',
          'questionStoragePath' : 'data.answers.ratings.activity',
          'questionIsAssociatedToMedia': true
        },
        {
          'questionType' : 'likert',
          'questionLikertMinimumDescription' : 'Weak<br />(without control, submissive)',
          'questionLikertMaximumDescription' : 'Empowered<br />(in control of everything, dominant)',
          'questionLikertMinimum' : 1,
          'questionLikertMaximum' : 5,
          'questionLikertInitialValue' : 3,
          'questionLikertUseImage' : true,
          'questionLikertImageType' : 'single',
          'questionLikertSingleImageSrc' : '/modules/core/img/scale-above-power.png',
          'questionLabel' : 'How in control did you feel?',
          'questionStoragePath' : 'data.answers.ratings.power',
          'questionIsAssociatedToMedia': true
        },
        {
          'questionType' : 'likert',
          'questionLikertMinimumDescription' : 'Not at all',
          'questionLikertMaximumDescription' : 'Intensely',
          'questionLikertMinimum' : 1,
          'questionLikertMaximum' : 5,
          'questionLikertInitialValue' : 3,
          'questionLikertUseImage' : true,
          'questionLikertImageType' : 'single',
          'questionLikertSingleImageSrc' : '/modules/core/img/scale-above-chills.png',
          'questionLabel' : 'How strongly did you experience any of these physical reactions while you were listening: chills, shivers, thrills, or goosebumps?',
          'questionStoragePath' : 'data.answers.ratings.chills',
          'questionIsAssociatedToMedia': true
        },
        {
          'questionType' : 'likert',
          'questionLikertMinimumDescription' : 'I hated it',
          'questionLikertMaximumDescription' : 'I loved it',
          'questionLikertMinimum' : 1,
          'questionLikertMaximum' : 5,
          'questionLikertInitialValue' : 3,
          'questionLikertUseImage' : false,
          'questionLabel' : 'How much did you like/dislike the song?',
          'questionStoragePath' : 'data.answers.ratings.like_dislike',
          'questionIsAssociatedToMedia': true
        },
        {
          'questionType' : 'likert',
          'questionLikertMinimumDescription' : 'I had never heard it before',
          'questionLikertMaximumDescription' : 'I listen to it regularly',
          'questionLikertMinimum' : 1,
          'questionLikertMaximum' : 5,
          'questionLikertInitialValue' : 3,
          'questionLikertUseImage' : false,
          'questionLabel' : 'How familiar are you with this music?',
          'questionStoragePath' : 'data.answers.ratings.familiarity',
          'questionIsAssociatedToMedia': true
        }
      ]
    };

    $scope.trialDataJson = function() {
      return TrialData.toJson();
    };
  }
]);

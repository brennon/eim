'use strict';

// Trial Data service used to persist data for individual trials
angular.module('core').factory('TrialData', [
  function () {

    function blankDataObject() {
      return {
        answers: {
          musical_expertise: null,
          musical_background: null,
          most_engaged: null,
          hearing_impairments: null,
          visual_impairments: null,
          nationality: null,
          dob: null,
          sex: null,
          music_styles: [],
          most_enjoyed: null,
          emotion_indices: [],
          ratings: {
            positivity: [],
            like_dislike: [],
            familiarity: [],
            engagement: [],
            activity: [],
            chills: [],
            power: []
          }
        },
        date: null,
        media: [],
        timestamps: {
          start: null,
          test: null,
          media: [],
          end: null
        },
        metadata: {
          session_number: null,
          location: 'taipei_city',
          terminal: null
        }
      };
    }

    var trialData = {
      data: {
        answers: {
          musical_expertise: null,
          musical_background: null,
          most_engaged: null,
          hearing_impairments: null,
          visual_impairments: null,
          nationality: null,
          dob: null,
          sex: null,
          music_styles: [],
          most_enjoyed: null,
          emotion_indices: [],
          ratings: {
            positivity: [],
            like_dislike: [],
            familiarity: [],
            engagement: [],
            activity: [],
            chills: [],
            power: []
          }
        },
        date: null,
        media: [],
        timestamps: {
          start: null,
          test: null,
          media: [],
          end: null
        },
        metadata: {
          session_number: null,
          location: 'taipei_city',
          terminal: null
        }
      },

      toJson: function () {
        return angular.toJson(this.data, true);
      },

      reset: function () {
        this.data = blankDataObject();
      }
    };

    return trialData;
  }
]);
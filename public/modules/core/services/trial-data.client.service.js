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
        },
        state: {
          mediaPlayCount: 0
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
        },
        state: {
          mediaPlayCount: 0
        }
      },

      toJson: function () {
        return angular.toJson(this.data, true);
      },

      reset: function () {
        this.data = blankDataObject();
      },

      setValueForPath: function(path, value) {
        if (path && value) {
          var schema = this;  // a moving reference to internal objects within this (this TrialData)
          var pList = path.split('.');
          var len = pList.length;
          for (var i = 0; i < len - 1; i++) {
            var elem = pList[i];
            if (!schema[elem]) schema[elem] = {}
            schema = schema[elem];
          }

          schema[pList[len - 1]] = value;
        }
      },

      setValueForPathForCurrentMedia: function(path, value) {
        var schema = this;  // a moving reference to internal objects within this (this TrialData)
        var pList = path.split('.');
        var len = pList.length;
        for(var i = 0; i < len-1; i++) {
          var elem = pList[i];
          if( !schema[elem] ) schema[elem] = {}
          schema = schema[elem];
        }

        // Check that we are assigning to the right index
        var index;

        // If no media have played (we're likely debugging)
        if (this.data.state.mediaPlayCount <= 0) {
          index = 0;
        } else {
          index = this.data.state.mediaPlayCount - 1;

          if (index >= schema[pList[len-1]].length) {
            index = schema[pList[len-1]].length - 1;
          }
        }

        schema[pList[len-1]][index] = value;
      }
    };

    return trialData;
  }
]);
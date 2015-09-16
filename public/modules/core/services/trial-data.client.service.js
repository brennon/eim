'use strict';

// TODO: Push results to database

// Trial Data service used to persist data for individual trials
angular.module('core').factory('TrialData', [
    function() {

        function BlankDataObject() {
            return {
                answers: {
                    //musical_expertise: null,
                    //musical_background: null,
                    //most_engaged: null,
                    //hearing_impairments: null,
                    //visual_impairments: null,
                    //nationality: null,
                    //dob: null,
                    //sex: null,
                    //music_styles: [],
                    //most_enjoyed: null,
                    //emotion_indices: [],
                    //ratings: {
                    //    positivity: [],
                    //    like_dislike: [],
                    //    familiarity: [],
                    //    engagement: [],
                    //    activity: [],
                    //    chills: [],
                    //    power: []
                    //}
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
                    language: 'en',
                    session_number: null,
                    location: 'taipei_city',
                    terminal: null
                },
                state: {
                    currentSlideIndex: -1,
                    mediaPlayCount: 0
                }
            };
        }

        var trialData = {
            data: null,

            toJson: function() {
                return angular.toJson(this.data, true);
            },

            reset: function() {
                this.data = new BlankDataObject();
            },

            // TODO: Add formatting and type options
            setValueForPath: function(path, value, options) {

                if (value === 'true') {
                    value = true;
                } else if (value === 'false') {
                    value = false;
                }

                var numericRegex = /\d+\.?\d?/;
                if (typeof value === 'string' && value.match(numericRegex)) {
                    value = parseFloat(value);
                }

                // Downcase simple strings
                if (typeof value === 'string') {
                    value = value.toLowerCase();
                }

                if (path && value !== undefined) {
                    var schema = this;  // a moving reference to internal objects within this (this TrialData)
                    var pList = path.split('.');
                    var len = pList.length;
                    for (var i = 0; i < len - 1; i++) {
                        var elem = pList[i];
                        if (!schema[elem]) schema[elem] = {};
                        schema = schema[elem];
                    }

                    if (options && options.hasOwnProperty('array_index') && typeof options.array_index === 'number') {

                        if (schema[pList[len - 1]] === undefined) {
                            schema[pList[len - 1]] = [];
                        }

                        // Iterate over array up to one less than options.array_index
                        // If each index isn't set up to this point, set it to null
                        for (var j = 0; j < options.array_index; j++) {
                            if (schema[pList[len - 1]][j] === undefined) {
                                schema[pList[len - 1]][j] = null;
                            }
                        }

                        schema[pList[len - 1]][options.array_index] = value;
                    } else {
                        schema[pList[len - 1]] = value;
                    }
                }
            },

            // FIXME: Need to gracefully handle bad array indices
            setValueForPathForCurrentMedia: function(path, value) {

                var index;

                // If no media have played (we're likely debugging)
                if (this.data.state.mediaPlayCount <= 0) {
                    index = 0;
                } else {
                    index = this.data.state.mediaPlayCount - 1;
                }

                this.setValueForPath(path, value, {array_index: index});
            },

            language: function(newLanguage) {

                if (typeof newLanguage === 'string') {

                    this.data.metadata.language = newLanguage;
                }

                return this.data.metadata.language;
            }
        };

        trialData.data = new BlankDataObject();

        return trialData;
    }
]);
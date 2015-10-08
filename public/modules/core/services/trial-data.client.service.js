'use strict';

/**
 * The `TrialData` service is responsible for collecting the responses
 * provided by the user over the course of an experiment session.
 *
 * @class Angular.TrialData
 * @memberof Angular
 */

angular.module('core').factory('TrialData', ['$log',
    function($log) {

        $log.info('Instantiating TrialData service.');

        /**
         * This function returns the object that will be populated with data
         * as responses are provided by the user. You are free to manipulate
         * this object to suit your needs, but take note of the properties
         * that are configured with the demo app that are described here. In
         * particular, take care when modifying the metadata and state
         * properties.
         *
         * @function BlankDataObject
         * @inner
         * @property {{}} answers This object is where the actual
         * responses from users are stored. For example, when you create a
         * question in your study specification document (see the
         * [README](index.html)) with its `questionStoragePath` property set
         * to `data.answers.foo`, it will appear in this object under
         * `answers.foo`.
         * @property {Date} date The date and time that this session commenced
         * @property {Object[]} media The media that were played during this
         * session
         * @property {*} timestamps Timestamps for different points during
         * the session
         * @property {{}} metadata Various important metadata (location,
         * language, terminal number, session number, etc.)
         * @property {{}} state Important data for maintaining the state of
         * the session
         * @memberof Angular.TrialData~
         * @returns {{}}
         */
        function BlankDataObject() {

            $log.debug('Creating new BlankDataObject.');

            return {
                answers: {},
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

            /**
             * The data object for this session. Originally set to a new
             * instance of a {@link
             * Angular.TrialData~BlankDataObject|BlankDataObject}.
             *
             * @name data
             * @memberof Angular.TrialData#
             */
            data: null,

            /**
             * Converts the object in {@link Angular.TrialData#data|data}
             * to JSON and returns it.
             *
             * @function toJson
             * @memberof Angular.TrialData#
             * @returns {string}
             */
            toJson: function() {
                $log.debug('TrialData service returning data as JSON.');
                return angular.toJson(this.data, true);
            },

            /**
             * Sets {@link Angular.TrialData#data|data} to a new
             * instance of a {@link
             * Angular.TrialData~BlankDataObject|BlankDataObject}.
             *
             * @function reset
             * @memberof Angular.TrialData#
             * @return {undefined}
             */
            reset: function() {
                $log.info('Resetting TrialData service.');
                this.data = new BlankDataObject();
            },

            /**
             * Sets the value for a 'keypath' in {@link
             * Angular.TrialData#data|data}. Keypaths are dot-delimited
             * 'addresses' into the {@link Angular.TrialData#data|data}
             * object. For instance, the string `'foo.bar.baz'` interpreted
             * as a keypath points to the `baz` property of an object, which
             * is the value of the `bar` property on the `foo` object:
             *
             * ```
             * data = {
             *     foo: {
             *         bar: {
             *             baz: 13 // foo.bar.baz points to this value
             *         }
             *     }
             * }
             * ```
             *
             * @function setValueForPath
             * @memberof Angular.TrialData#
             * @param {string} path The keypath (address) into {@link
             * Angular.TrialData#data|data}
             * @param {*} value The value that this keypath should hold
             * @param {*} options Currently only one option is supported:
             * `array_index`. If you pass `{array_index: 2}` with a keypath
             * of `foo`, this method will expect to find an *`Array`* at the
             * keypath `foo`, and will set the value at index 2 of this
             * array to `value`.
             * @return {undefined}
             */
            setValueForPath: function(path, value, options) {

                $log.debug('Setting ' + path + ' in TrialData to: ' +
                    value, options);

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
                    // A moving reference to internal objects within this
                    // (this TrialData)
                    var schema = this;
                    var pList = path.split('.');
                    var len = pList.length;
                    for (var i = 0; i < len - 1; i++) {
                        var elem = pList[i];
                        if (!schema[elem]) schema[elem] = {};
                        schema = schema[elem];
                    }

                    if (options && options.hasOwnProperty('array_index') &&
                        typeof options.array_index === 'number') {

                        if (schema[pList[len - 1]] === undefined) {
                            schema[pList[len - 1]] = [];
                        }

                        // Iterate over array up to one less than
                        // options.array_index. If each index isn't set up to
                        // this point, set it to null.
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

            /**
             * Sets the value for a 'keypath' in {@link
             * Angular.TrialData#data|data}. (See {@link
             * Angular.TrialData~setValueForPath|setValueForPath} for more
             * infomation on 'paths'.)
             *
             * When this method is used, the current media in the experiment
             * session is observed. `value` is expected to be placed into an
             * `Array` that is stored at the keypath, and the number of the
             * current media is used to decide the index of this array at
             * which `value` should be stored. For instance, if the second
             * media excerpt was just played and this method was called with
             * `'data.answers.foo'` for `path` and `14` for `'value'`, `14`
             * would be stored in the second index of the array at
             * `'data.answers.foo'`.
             *
             * @function setValueForPathForCurrentmedia
             * @memberof Angular.TrialData#
             * @param {string} path The keypath (address) into {@link
                * Angular.TrialData#data|data}
             * @param {*} value The value that this keypath should hold
             * @return {undefined}
             */
            setValueForPathForCurrentMedia: function(path, value) {

                $log.debug('Setting ' + path + ' in TrialData for current' +
                    ' media to: ' + value + '.');

                var index;

                // If no media have played (we're likely debugging)
                if (this.data.state.mediaPlayCount <= 0) {
                    index = 0;
                } else {
                    index = this.data.state.mediaPlayCount - 1;
                }

                this.setValueForPath(path, value, {array_index: index});
            },

            /**
             * Updates the language stored at the `metadata.language`
             * property of {@link Angular.TrialData#data|data}
             *
             * @function language
             * @memberof Angular.TrialData#
             * @param {string} newLanguage The language
             * @returns {string} The language to which the
             * `metadata.language` property of {@link
             * Angular.TrialData#data|data} is set after the call to this
             * method.
             */
            language: function(newLanguage) {

                if (typeof newLanguage === 'string') {

                    $log.info('Setting language in TrialData to ' +
                        newLanguage);

                    this.data.metadata.language = newLanguage;
                } else {
                    $log.error('Not updating language in TrialData. A string' +
                        ' was not received.');
                }

                return this.data.metadata.language;
            }
        };

        trialData.data = new BlankDataObject();

        return trialData;
    }
]);
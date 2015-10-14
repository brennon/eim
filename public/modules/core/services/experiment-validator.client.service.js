/**
 * Created by brennon on 10/13/15.
 */

'use strict';

/**
 * The `ExperimentValidator` service checks the validity of an
 * `ExperimentSchema`.
 *
 * @class Angular.ExperimentValidator
 * @memberof Angular
 */

angular.module('core').factory('ExperimentValidator', [
    '$log',
    function($log) {

        $log.debug('Instantiating ExperimentValidator service.');

        var returnObject = {

            /**
             * Advances the state to the next state as defined in the study
             * specification document (see the [README](index.html)).
             *
             * @function advanceSlide
             * @instance
             * @memberof Angular.ExperimentValidator
             * @return {*}
             */
            validateSchema: function(schema) {

                var constraints = {
                    structure: {
                        presence: true
                    },
                    media: {
                        presence: true
                    }
                };

                // Initial validation
                var isValid = validate(schema, constraints);
                if (isValid !== undefined) {
                    return isValid;
                }

                // Structure must be an array
                isValid = validate.isArray(schema.structure);
                if (isValid === false) {
                    return isValid;
                }

                // Iterate over media array
                for (var i = 0; i < schema.media.length; i++) {
                    var item = schema.media[i];
                    var itemIsValid = this.validateMediaEntry(item);
                    if (itemIsValid !== undefined) {
                        return itemIsValid;
                    }
                }

                // Iterate over

                return undefined;
            },

            validateMediaEntry: function validateMediaEntryFn(entry) {
                var constraints = {
                    artist: {
                        presence: true
                    },
                    title: {
                        presence: true
                    },
                    label: {
                        presence: true
                    }
                };

                var isValid = validate(entry, constraints);
                if (isValid !== undefined) {
                    return isValid;
                }

                isValid = validate.isString(entry.artist);
                if (isValid === false) {
                    return isValid;
                }

                isValid = validate.isString(entry.title);
                if (isValid === false) {
                    return isValid;
                }

                isValid = validate.isString(entry.label);
                if (isValid === false) {
                    return isValid;
                }
            },

            validateStructureEntry: function validateStructureEntryFn(entry) {
                var constraints = {
                    name: {
                        presence: true
                    }
                };

                var isValid = validate(entry, constraints);
                if (isValid !== undefined) {
                    return isValid;
                }

                isValid = validate.isString(entry.name);
                if (isValid === false) {
                    return isValid;
                }
            }
        };

        return returnObject;
    }
]);

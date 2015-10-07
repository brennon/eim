'use strict';

/**
 * The `questionnaire` directive is used to dynamically inject a
 * questionnaire into a view. It leverages several other directives to do
 * this work:
 *
 * - {@link Angular.checkboxQuestionDirective|checkboxQuestionDirective}
 * - {@link Angular.dropdownQuestionDirective|dropdownQuestionDirective}
 * - {@link Angular.radioQuestionDirective|radioQuestionDirective}
 * - {@link Angular.scaleQuestionDirective|scaleQuestionDirective}
 *
 * @class Angular.questionnaireDirective
 * @see Angular.checkboxQuestionDirective
 * @see Angular.dropdownQuestionDirective
 * @see Angular.radioQuestionDirective
 * @see Angular.scaleQuestionDirective
 */

angular.module('core').directive('questionnaire', [
    '$compile',
    '$log',
    function($compile, $log) {

        $log.debug('Compiling questionnaire directive.');

        function buildScaleQuestion(item) {
            var questionElement = angular.element(
                '<scale-question></scale-question>'
            );

            if (item.questionLabelType) {
                questionElement.attr('label-type', item.questionLabelType);
            }

            if (item.questionLikertMinimumDescription) {
                questionElement.attr(
                    'minimum-description',
                    item.questionLikertMinimumDescription
                );
            }

            if (item.questionLikertMaximumDescription) {
                questionElement.attr(
                    'maximum-description',
                    item.questionLikertMaximumDescription
                );
            }

            if (item.questionLikertSingleImageSrc) {
                questionElement.attr(
                    'single-img-src',
                    item.questionLikertSingleImageSrc
                );
            }

            if (item.questionLikertLeftImageSrc) {
                questionElement.attr(
                    'left-img-src',
                    item.questionLikertLeftImageSrc
                );
            }

            if (item.questionLikertRightImageSrc) {
                questionElement.attr(
                    'right-img-src',
                    item.questionLikertRightImageSrc
                );
            }

            return questionElement;
        }

        function buildRadioQuestion() {
            return angular.element(
                '<radio-question></radio-question>'
            );
        }

        function buildDropdownQuestion() {
            return angular.element(
                '<dropdown-question></dropdown-question>'
            );
        }

        function buildCheckboxQuestion() {
            return angular.element(
                '<checkbox-question></checkbox-question>'
            );
        }

        return {
            restrict: 'E',
            scope: {
                questionnaireData: '=',
                questionnaireForm: '='
            },

            link: function(scope, element) {

                /**
                 * Represents an individual question in a questionnaire.
                 *
                 * @typedef {{}} questionnaireStructureEntry
                 * @memberof Angular.questionnaireDirective#data
                 * @inner
                 *
                 * @property {string} questionType The question type. Supported
                 * `questionType`s include `'likert'`, `'radio'`, `'dropdown'`,
                 * and `'checkbox'`. (required)
                 *
                 * @property {string} questionId All question types support this
                 * property. It should be a single-word string that uniquely
                 * identifies this question within this questionnaire.
                 * (required)
                 *
                 * @property {string} questionLabel All question types
                 * support this property. It should be a string that
                 * contains the text of the question itself (e.g., 'How old
                 * are you?') (optional)
                 *
                 * @property {string} questionStoragePath All question types
                 * support this property. It should be a 'keypath' into the
                 * TrialData.data object at which the response to this question
                 * should be stored. See {@link
                 * Angular.TrialData#setValueForPath|TrialData#setValueForPath}
                 * for more information on these keypaths. (required)
                 *
                 * @property {boolean} questionIsAssociatedToMedia All question
                 * types support this property. The value of this property
                 * specifies that a question corresponds to a particular media
                 * excerpt by taking a Boolean true or false as its value. When
                 * this value is set to true, multiple responses for
                 * questions with the same questionStoragePath property are
                 * stored in an ordered array that is used as the value for
                 * the `questionStoragePath` property in {@link
                 * Angular.TrialData#data|TrialData#data}. (optional)
                 *
                 * For example, in the demonstration study provided with the
                 * framework, two media excerpts are played. We present the same
                 * questionnaire to the participant following each media
                 * excerpt. In order to specify that responses on the
                 * questionnaire following the first excerpt are associated
                 * with the first excerpt (and the same for the second
                 * questionnaire and excerpt), the values for
                 * `questionIsAssociatedToMedia` for all questions in these
                 * questionnaires are all set to `true`. So, for those
                 * questons with their `questionStoragePath` property set to
                 * `"data.answers.positivity"`, the corresponding section of a
                 * participant's {@link Angular.TrialData#data|TrialData#data}
                 * might look something like this:
                 *
                 * ```
                 * {
                 *     data: {
                 *         answers: {
                 *             positivity: [2, 5]
                 *         }
                 *     }
                 * }
                 * ```
                 *
                 * Here, the participant chose a value of `2` when responding to
                 * the positivity question following the first excerpt.
                 * Likewise, they chose a value of `5` when responding to
                 * the positivity question following the second excerpt.
                 *
                 * @property {boolean} questionRequired All question types
                 * support this property. If its value is
                 * `false`, the user will not be required to answer the
                 * question. If its value is *anything* other than false
                 * (`true`, `undefined`, 49, etc.), the user will be
                 * required to answer the question. (optional)
                 *
                 * @property {string} questionLabelType This property is used
                 * by the `'likert'` question type. Providing a value of
                 * `'labelLeft'` for this property will produce the
                 * `questionLabel` as a left-justified label in the standard
                 * font size. Otherwise, the label will be printed in a larger
                 * font and centered over the scale. (optional)
                 *
                 * @property {string} questionLikertMinimumDescription This
                 * property is used by the `'likert'` question type. The minimum
                 * description is displayed below the left end of the scale.
                 * If this property is specified, then
                 * `questionLikertMaximumDescription` must also be specified.
                 * (optional)
                 *
                 * @property {string} questionLikertMaximumDescription This
                 * property is used by the `'likert'` question type. The minimum
                 * description is displayed below the right end of the scale.
                 * If this property is specified, then
                 * `questionLikertMinimumDescription` must also be specified.
                 * (optional)
                 *
                 * @property {string} questionLikertSingleImageSrc This
                 * property is used by the `'likert'` question type. The value
                 * should be a path to an image to be displayed above and
                 * centered over the scale. (optional)
                 *
                 * @property {string} questionLikertLeftImageSrc This
                 * property is used by the `'likert'` question type. The value
                 * should be a path to an image to be displayed above and
                 * above the left end of the scale. If this property
                 * is specified, then `questionLikertRightImageSrc
                 * must also be specified. (optional)
                 *
                 * @property {string} questionLikertRightImageSrc This
                 * property is used by the `'likert'` question type. The value
                 * should be a path to an image to be displayed above and
                 * above the right end of the scale. If this property
                 * is specified, then `questionLikertLeftImageSrc must also
                 * be specified. (optional)
                 *
                 * @property {{}} questionOptions This property is used and
                 * required by all question types. In general, each question
                 * type requires that this be an object that has a `choices`
                 * property, the value of which is an array. Each entry in
                 * the choices array should be an object that represents a
                 * single question choice. Each of these objects should
                 * have both a `label` and a `value` property. The value of
                 * the `label` property should be a string that is used for
                 * the display of this question type. The value of the
                 * `value` property should be the value that should be
                 * stored when this choice is selected by the user for their
                 * answer.
                 *
                 * ```
                 * // questionOptions example:
                 * {
                 *     choices: [
                 *         {
                 *             label: 'Strongly disagree',
                 *             value: 1
                 *         },
                 *         {
                 *             label: 'Somewhat disagree',
                 *             value: 2
                 *         },
                 *         {
                 *             label: 'Neither agree nor disagree',
                 *             value: 3
                 *         },
                 *         {
                 *             label: 'Somewhat agree',
                 *             value: 4
                 *         },
                 *         {
                 *             label: 'Strongly agree',
                 *             value: 5
                 *         }
                 *     ]
                 * }
                 * ```
                 */

                /**
                 * The data used to build the questionnaire. `data` is bound to
                 * `$scope.questionnaireData` on the enclosing scope.
                 *
                 * @name data
                 * @namespace
                 * @memberof Angular.questionnaireDirective
                 * @instance
                 * @type {{}}
                 * @property {string} title The title of the questionnaire
                 * (optional)
                 * @property {string} introductoryText A block of introductory
                 * text for the questionnaire (optional)
                 * @property {questionnaireStructureEntry[]} structure An array
                 * of questions for the questionnaire (see {@link
                 * Angular.questionnaireDirective#data~questionnaireStructureEntry|questionnaireStructureEntry})
                 * (optional)
                 */
                var data = scope.questionnaireData;

                var div = angular.element('<div></div>');

                // Create an element for the title
                if (data.hasOwnProperty('title')) {
                    if (typeof data.title === 'string') {

                        var title = angular.element('<h1></h1>');
                        title.attr('translate', '');
                        title.html(data.title);
                        element.append(title);
                    } else {
                        $log.error('Questionnaire title must be a string.');
                    }
                }

                // Create an element for the introductory text
                if (data.hasOwnProperty('introductoryText')) {
                    if (typeof data.introductoryText === 'string') {

                        var row = div.clone();
                        row.addClass('row');

                        var columns = div.clone();
                        columns.addClass('col-md-12 introductory-text');

                        var heading = angular.element('<h2></h2>');
                        heading.attr('translate', '');
                        heading.html(data.introductoryText);

                        element.append(row);
                        row.append(columns);
                        columns.append(heading);
                    } else {
                        $log.error('Questionnaire introductory text must be a' +
                            ' string.');
                    }
                }

                var formElement = angular.element('<form></form>');
                formElement.addClass('form');
                formElement.attr('name', 'questionnaireForm');
                formElement.attr('novalidate', '');

                // Iterate over structure
                if (data.structure.length === 0) {
                    $log.warn('No questions found for questionnaire.');
                }

                for (var i = 0; i < data.structure.length; i++) {

                    // Create an element for each structure entry
                    var questionElement;
                    var item = data.structure[i];

                    switch (item.questionType) {
                        case 'likert':
                            questionElement = buildScaleQuestion(item);
                            break;
                        case 'radio':
                            questionElement = buildRadioQuestion(item);
                            break;
                        case 'dropdown':
                            questionElement = buildDropdownQuestion(item);
                            break;
                        case 'checkbox':
                            questionElement = buildCheckboxQuestion(item);
                            break;
                    }

                    if (item.hasOwnProperty('questionOptions')) {
                        questionElement.data(
                            'questionOptions',
                            item.questionOptions
                        );

                    // There were no questionOptions
                    } else {
                        $log.error('questionOptions must be provided.');
                    }

                    if (item.hasOwnProperty('questionRequired')) {
                        questionElement.data(
                            'questionRequired',
                            item.questionRequired
                        );
                    } else {
                        questionElement.data(
                            'questionRequired',
                            true
                        );
                    }

                    if (item.hasOwnProperty('questionStoragePath')) {
                        if (typeof item.questionStoragePath === 'string') {
                            questionElement.attr(
                                'controller-data-path',
                                item.questionStoragePath
                            );

                        // questionStoragePath wasn't a string
                        } else {
                            $log.error('questionStoragePath must be a string.');
                        }

                    // questionStoragePath wasn't present
                    } else {
                        $log.error('questionStoragePath must be provided.');
                    }

                    if (item.hasOwnProperty('questionIsAssociatedToMedia')) {
                        questionElement.attr(
                            'associated-to-media',
                            item.questionIsAssociatedToMedia
                        );
                    }

                    if (item.hasOwnProperty('questionId')) {
                        if (typeof item.questionId === 'string') {
                            questionElement.attr(
                                'question-id',
                                item.questionId
                            );

                        // questionId wasn't a string
                        } else {
                            $log.error('questionId must be a string.');
                        }

                    // questionId wasn't present
                    } else {
                        $log.error('questionId must be provided.');
                    }

                    if (item.hasOwnProperty('questionLabel')) {
                        questionElement.attr(
                            'question-label',
                            item.questionLabel
                        );
                    }

                    // Build a spacer row
                    var spacerRow = div.clone();
                    spacerRow.addClass('row');

                    var spacerColumns = div.clone();
                    spacerColumns.addClass('col-md-12 question-spacer');
                    spacerRow.append(spacerColumns);

                    // Add question and spacer to form
                    formElement.append(questionElement);
                    formElement.append(spacerRow);
                }

                // Add form to main element
                element.append(formElement);

                $compile(element.contents())(scope);
            }
        };
    }]);

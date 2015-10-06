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

        var buildScaleQuestion = function(item) {
            var questionElement = angular.element(
                '<scale-question></scale-question>'
            );

            if (item.questionId) {
                questionElement.attr('question-id', item.questionId);
            }

            if (item.questionLabel) {
                questionElement.attr('question-label', item.questionLabel);
            }

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

            if (item.questionStoragePath) {
                questionElement.attr(
                    'controller-data-path',
                    item.questionStoragePath
                );
            }

            if (item.questionIsAssociatedToMedia) {
                questionElement.attr(
                    'associated-to-media',
                    item.questionIsAssociatedToMedia
                );
            }

            if (item.questionOptions) {
                questionElement.data('questionOptions', item.questionOptions);
            }

            return questionElement;
        };

        var buildRadioQuestion = function(item) {
            var questionElement = angular.element(
                '<radio-question></radio-question>'
            );

            if (item.questionId) {
                questionElement.attr('question-id', item.questionId);
            }

            if (item.questionLabel) {
                questionElement.attr('question-label', item.questionLabel);
            }

            if (item.questionStoragePath) {
                questionElement.attr(
                    'controller-data-path',
                    item.questionStoragePath
                );
            }

            if (item.questionIsAssociatedToMedia) {
                questionElement.attr(
                    'associated-to-media',
                    item.questionIsAssociatedToMedia
                );
            }

            if (item.questionRadioOptions) {
                questionElement.data('radioOptions', item.questionRadioOptions);
            }

            return questionElement;
        };

        var buildDropdownQuestion = function(item) {
            var questionElement = angular.element(
                '<dropdown-question></dropdown-question>'
            );

            if (item.questionId) {
                questionElement.attr('question-id', item.questionId);
            }

            if (item.questionLabel) {
                questionElement.attr('question-label', item.questionLabel);
            }

            if (item.questionIsAssociatedToMedia) {
                questionElement.attr(
                    'associated-to-media',
                    item.questionIsAssociatedToMedia
                );
            }

            if (item.questionStoragePath) {
                questionElement.attr(
                    'controller-data-path',
                    item.questionStoragePath
                );
            }

            if (item.questionDropdownOptions) {
                questionElement.data(
                    'dropdownOptions',
                    item.questionDropdownOptions
                );
            }

            if (item.hasOwnProperty('questionRequired')) {
                questionElement.data('questionRequired', item.questionRequired);
            }

            return questionElement;
        };

        var buildCheckboxQuestion = function(item) {
            var questionElement = angular.element(
                '<checkbox-question></checkbox-question>'
            );

            if (item.questionId) {
                questionElement.attr('question-id', item.questionId);
            }

            if (item.questionLabel) {
                questionElement.attr('question-label', item.questionLabel);
            }

            if (item.questionIsAssociatedToMedia) {
                questionElement.attr(
                    'associated-to-media',
                    item.questionIsAssociatedToMedia
                );
            }

            if (item.questionStoragePath) {
                questionElement.attr(
                    'controller-data-path',
                    item.questionStoragePath
                );
            }

            if (item.questionCheckboxOptions) {
                questionElement.data(
                    'checkboxOptions',
                    item.questionCheckboxOptions
                );
            }

            // If questionRequired isn't defined or is explicitly set to true
            if (!item.hasOwnProperty('questionRequired') ||
                item.questionRequired === true) {

                questionElement.attr('question-required', 'true');
            }

            return questionElement;
        };

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
                 * are you?') (required)
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
                    * Angular.TrialData#data|TrialData#data}.
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
                 * @property {boolean} questionRequired This property is
                 * supported by the `'checkbox'` and `'dropdown'` question
                 * types. If its value is `false`, the user will not be
                 * required to answer the question. If its value is
                 * *anything* other than false (`true`, `undefined`, 49,
                 * etc.), the user will be required to answer the question.
                 *
                 * @property {string} questionLikertMinimumDescription This
                 * property is used by the `'scale'` question type. The minimum
                 * description is displayed below the left end of the scale.
                 * (optional)
                 *
                 * @property {string} questionLabelType This property is used
                 * by the `'scale'` question type. Providing a value of
                 * `'labelLeft'` for this property will produce the
                 * `questionLabel` as a left-justified label in the standard
                 * font size. Otherwise, the label will be printed in a larger
                 * font and centered over the scale. (optional)
                 *
                 * @property {string} questionLikertMaximumDescription This
                 * property is used by the `'scale'` question type. The minimum
                 * description is displayed below the right end of the scale.
                 * (optional)
                 *
                 * @property {string} questionLikertSingleImageSrc This
                 * property is used by the `'scale'` question type. The value
                 * should be a path to an image to be displayed above and
                 * centered over the scale. (optional)
                 *
                 * @property {string} questionLikertLeftImageSrc This
                 * property is used by the `'scale'` question type. The value
                 * should be a path to an image to be displayed above and
                 * above the left end of the scale. (optional)
                 *
                 * @property {string} questionLikertRightImageSrc This
                 * property is used by the `'scale'` question type. The value
                 * should be a path to an image to be displayed above and
                 * above the right end of the scale. (optional)
                 *
                 * @property {{}} questionOptions This property is used and
                 * required by the `'scale'` question type. The `'scale'`
                 * question type currently uses a five-point scale. The
                 * `questionOptions` property should be an object with a
                 * `choices` property that holds an array of five objects--each
                 * object in this array represents a description of each choice
                 * along the scale, moving from left to right.
                 *
                 * ```
                 * // questionOptions example:
                 * {
                 *     choices: [
                 *         {
                 *             label: 'Strongly disagree'
                 *         },
                 *         {
                 *             label: 'Somewhat disagree'
                 *         },
                 *         {
                 *             label: 'Neither agree nor disagree'
                 *         },
                 *         {
                 *             label: 'Somewhat agree'
                 *         },
                 *         {
                 *             label: 'Strongly agree'
                 *         }
                 *     ]
                 * }
                 * ```
                 *
                 * @property {Object[]} questionRadioOptions This property is
                 * supported and required by the `'radio'` question type.
                 * Its value should be an array of objects, each of which
                 * represents an individual radio button in the selection.
                 * Each object should have `'label'` and `'value'`
                 * properties. The `'label'` property corresponds to the
                 * label that should be displayed to the user, while the
                 * `'value'` property corresponds to the value that is
                 * actually saved to {@link
                 * Angular.TrialData#data|TrialData#data}, should the user
                 * select this radio button.
                 *
                 * ```
                 * // questionRadioOptions example:
                 * [
                 *     {
                 *         "label" : "Male",
                 *         "value" : "male"
                 *     },
                 *     {
                 *         "label" : "Female",
                 *         "value" : "female"
                 *     }
                 * ]
                 * ```
                 *
                 * @property {string[]} questionDropdownOptions This property is
                 * supported and required by the `'dropdown'` question type. Its
                 * value should be an array of strings, each of which represents
                 * an individual option available in the dropdown list.
                 *
                 * ```
                 * // questionDropdownOptions example:
                 * [
                 *     "apple",
                 *     "orange",
                 *     "banana",
                 *     "cherry",
                 *     "strawberry"
                 * ]
                 * ```
                 *
                 * @property {string[]} questionCheckboxOptions This property is
                 * supported and required by the `'checkbox'` question type. Its
                 * value should be an array of strings, each of which represents
                 * an individual checkbox available in the group of checkboxes.
                 *
                 * ```
                 * // questionCheckboxOptions example:
                 * [
                 *     "Yes",
                 *     "No",
                 *     "Undecided"
                 * ]
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

                // Create an element for the title
                if (data.title) {
                    var title = angular.element('<h1 translate>' + data.title +
                        '</h1>');
                    element.append(title);
                }

                // Create an element for the introductory text
                if (data.introductoryText) {
                    var introductoryText = angular.element(
                        '<div class="row">' +
                        '<div class="col-md-12 introductory-text">' +
                        '<h2 translate>' + data.introductoryText +
                        '</h2></div></div>'
                    );
                    element.append(introductoryText);
                }

                var formElement = angular.element(
                    '<form class="form" name="questionnaireForm" novalidate>' +
                    '</form>'
                );
                element.append(formElement);

                // Iterate over structure
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

                    // Append a spacer row
                    var spacerElement = angular.element(
                        '<div class="row">' +
                        '<div class="col-md-12 questionSpacer">' +
                        '</div>' +
                        '</div>'
                    );

                    formElement.append(questionElement);

                    formElement.append(spacerElement);
                }

                $compile(element.contents())(scope);
            }
        };
    }]);

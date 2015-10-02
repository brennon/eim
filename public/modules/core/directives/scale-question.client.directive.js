'use strict';

/**
 * The `scaleQuestion` directive is used to dynamically create a Likert-type
 * scale question into a view. It is used by the {@link
    * Angular.questionnaireDirective|questionnaire} directive to build whole
 * questionnaires.
 *
 * @class Angular.scaleQuestionDirective
 * @see Angular.questionnaireDirective
 */

angular.module('core').directive('scaleQuestion', [
    '$compile',
    'TrialData',
    '$log',
    function($compile, TrialData, $log) {

        $log.debug('Compiling scaleQuestion directive.');

        /**
         * The data used to build the scale question is found in the `scope`
         * argument passed to the directive's `#link` function. When a
         * {@link Angular.questionnaireDirective|questionnaire} directive
         * employs a `scaleQuestion` directive, it passes
         * the appropriate {@link Angular.questionnaireDirective#data~questionnaireStructureEntry|questionnaireStructureEntry}
         * for this parameter.
         *
         * @name scope
         * @memberof Angular.scaleQuestionDirective
         * @inner
         * @type {{}}
         * @see Angular.questionnaireDirective
         */

        var buildDescriptionsRow = function(scope, element, attrs) {
            var descriptions;
            if (attrs.minimumDescription && attrs.maximumDescription) {

                // Main row div
                descriptions = angular.element('<div></div>');
                descriptions.addClass('row');
                descriptions.addClass('scale-descriptions');

                // Side and center spacers
                var sideSpacer = angular.element('<div></div>');
                sideSpacer.addClass('col-md-2');

                var centerSpacer = angular.element('<div></div>');
                centerSpacer.addClass('col-md-4');

                var descriptionsInnerRow = angular.element('<div></div>');
                descriptionsInnerRow.addClass('col-md-8');
                descriptionsInnerRow.addClass('scale-descriptions-inner-row');

                var fifthsColumnSpacer = angular.element('<div></div>');
                fifthsColumnSpacer.addClass('col-md-5ths');

                // Left and right text blocks
                var leftTextBlock = angular.element('<div translate></div>');
                leftTextBlock.addClass('col-md-5ths');
                leftTextBlock.addClass('small');
                leftTextBlock.addClass('text-center');
                leftTextBlock.addClass('scale-minimum-description');
                leftTextBlock.html(attrs.minimumDescription);

                var rightTextBlock = leftTextBlock.clone();
                rightTextBlock.removeClass('scale-minimum-description');
                rightTextBlock.addClass('scale-maximum-description');
                rightTextBlock.html(attrs.maximumDescription);

                // Append text blocks and spacers to inner row
                descriptionsInnerRow.append(leftTextBlock);
                descriptionsInnerRow.append(
                    fifthsColumnSpacer.clone(),
                    fifthsColumnSpacer.clone(),
                    fifthsColumnSpacer.clone()
                );
                descriptionsInnerRow.append(rightTextBlock);

                // Append children to main row
                descriptions.append(
                    sideSpacer.clone(),
                    descriptionsInnerRow,
                    sideSpacer.clone()
                );
            }

            return descriptions;
        };

        return {
            restrict: 'E',
            scope: {},

            link: function(scope, element, attrs) {

                scope.sendToTrialData = function(path, value) {
                    if (!attrs.associatedToMedia) {
                        TrialData.setValueForPath(path, value);
                    } else {
                        TrialData.setValueForPathForCurrentMedia(path, value);
                    }
                };

                scope[attrs.questionId + 'RadioGroup'] = null;

                scope.$watch(
                    attrs.questionId + 'RadioGroup',
                    function(newValue) {
                        scope.sendToTrialData(
                            attrs.controllerDataPath,
                            parseInt(newValue)
                        );
                    });

                var questionHeader;
                if (attrs.labelType === 'labelLeft') {
                    questionHeader = angular.element(
                        '<div class="row">' +
                        '<div class="col-md-12">' +
                        '<label translate>' +
                        attrs.questionLabel +
                        '</label>' +
                        '</div>' +
                        '</div>'
                    );
                } else {
                    questionHeader = angular.element(
                        '<div class="row">' +
                        '<div class="col-md-12 text-center">' +
                        '<h3 translate>' +
                        attrs.questionLabel +
                        '</h3>' +
                        '</div>' +
                        '</div>'
                    );
                }

                var image;
                if (attrs.singleImgSrc) {
                    image = angular.element(
                        '<div class="row">' +
                        '<div class="col-md-2">' +
                        '</div>' +
                        '<div class="col-md-8 text-center">' +
                        '<img src="' + attrs.singleImgSrc + '">' +
                        '</div>' +
                        '<div class="col-md-2">' +
                        '</div>' +
                        '</div>');
                } else if (attrs.leftImgSrc && attrs.rightImgSrc) {
                    image = angular.element(
                        '<div class="row">' +
                        '<div class="col-md-2"></div>' +
                        '<div class="col-md-2">' +
                        '<img src="' + attrs.leftImgSrc + '">' +
                        '</div>' +
                        '<div class="col-md-4"></div>' +
                        '<div class="col-md-2">' +
                        '<img src="' + attrs.rightImgSrc + '">' +
                        '</div>' +
                        '<div class="col-md-2"></div>' +
                        '</div>'
                    );
                }

                var optionLabels;
                if (element.data('questionOptions') &&
                    element.data('questionOptions').choices) {

                    var choices = element.data('questionOptions').choices;

                    optionLabels = angular.element('<div class="row"></div>');

                    optionLabels.append(
                        '<div class="col-md-2 option-label-spacer"></div>'
                    );

                    var centerGroup = angular.element(
                        '<div class="col-md-8 option-label-container ' +
                        'text-center"></div>'
                    );

                    for (var i = 0; i < choices.length; i++) {
                        var choiceDiv = angular.element(
                            '<div class="col-md-5ths option-label ' +
                            'text-center">' +
                            '{{ \'' + choices[i].label + '\' | translate }}' +
                            '</div>'
                        );
                        centerGroup.append(choiceDiv);
                    }

                    optionLabels.append(centerGroup);

                    optionLabels.append(
                        '<div class="col-md-2 option-label-spacer"></div>'
                    );
                }

                var innerRadioHTML = '';

                for (var j = 1; j <= 5; j++) {
                    innerRadioHTML +=
                        '<div class="col-md-5ths text-center">' +
                        '<input type="radio" ' +
                        'name="' + attrs.questionId + 'RadioGroup" ' +
                        'id="' + attrs.questionId + 'RadioGroup' + j + '" ' +
                        'value="' + j + '" ' +
                        'required ' +
                        'ng-model="' + attrs.questionId + 'RadioGroup">' +
                        '</div>';
                }

                var radios = angular.element(
                    '<div class="row">' +
                    '<div class="col-md-2"></div>' +
                    '<div class="col-md-8 text-center">' +
                    innerRadioHTML +
                    '<div class="row">' +
                    '</div>' +
                    '</div>' +
                    '<div class="col-md-2">' +
                    '</div>' +
                    '</div>'
                );

                // Build descriptions row
                var descriptions = buildDescriptionsRow(scope, element, attrs);

                // Wrap everything in a row div with well class
                var wrapperDiv = angular.element(
                    '<div class="row well"></div>'
                );

                wrapperDiv.append(
                    questionHeader,
                    image,
                    optionLabels,
                    radios,
                    descriptions
                );

                // Add wrapper div to element and compile the element
                element.append(wrapperDiv);
                $compile(element.contents())(scope);
            }
        };
    }]);
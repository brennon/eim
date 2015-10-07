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

        // Build a header (main question text) row
        function buildHeaderRow(labelType, labelHTML) {

            var row;
            row = angular.element('<div></div>');
            row.addClass('row');

            var columns = angular.element('<div></div>');
            columns.addClass('col-md-12');

            var label;

            if (labelType === 'labelLeft') {
                label = angular.element('<label></label>');
            } else {
                label = angular.element('<h3></h3>');
            }

            label.attr('translate', '');
            label.html(labelHTML);

            row.append(columns);
            columns.append(label);

            return row;
        }

        // Build a row to hold the images
        function buildImageRow(singleImgSrc, leftImgSrc, rightImgSrc) {

            var row;

            // If there is either a single image source or there are both
            // left and right image sources
            if (typeof singleImgSrc === 'string' ||
                (typeof leftImgSrc === 'string' &&
                 typeof rightImgSrc === 'string')) {

                // Main row
                row = angular.element('<div></div>');
                row.addClass('row likert-image-row');

                var twoColumns = angular.element('<div></div>');
                twoColumns.addClass('col-md-2');

                // If there is only one image
                if (singleImgSrc) {

                    var image = angular.element('<img>');
                    image.attr('src', singleImgSrc);

                    var eightColumns = angular.element('<div></div>');
                    eightColumns.addClass('col-md-8');
                    eightColumns.addClass('text-center');

                    eightColumns.append(image);

                    row.append(
                        twoColumns.clone(),
                        eightColumns,
                        twoColumns.clone()
                    );

                // If we have two side images
                } else if (leftImgSrc && rightImgSrc) {

                    var leftImage = angular.element('<img>');
                    leftImage.attr('src', leftImgSrc);

                    var leftImageColumns = twoColumns.clone();
                    leftImageColumns.append(leftImage);

                    var rightImage = angular.element('<img>');
                    rightImage.attr('src', rightImgSrc);

                    var rightImageColumns = twoColumns.clone();
                    rightImageColumns.append(rightImage);

                    var fourColumns = angular.element('<div></div>');
                    fourColumns.addClass('col-md-4');

                    row.append(
                        twoColumns.clone(),
                        leftImageColumns,
                        fourColumns.clone(),
                        rightImageColumns,
                        twoColumns.clone()
                    );
                }
            }

            return row;
        }

        // Build a row that holds descriptions under each radio button
        function buildDescriptionsRow(minimumDesc, maximumDesc) {

            var descriptions;
            if (minimumDesc && maximumDesc) {

                // Main row div
                descriptions = angular.element('<div></div>');
                descriptions.addClass('row');
                descriptions.addClass('row-likert-descriptions');

                // Side and center spacers
                var sideSpacer = angular.element('<div></div>');
                sideSpacer.addClass('col-md-2');

                var centerSpacer = angular.element('<div></div>');
                centerSpacer.addClass('col-md-4');

                var descriptionsInnerRow = angular.element('<div></div>');
                descriptionsInnerRow.addClass('col-md-8');
                descriptionsInnerRow.addClass('likert-descriptions-container');

                var fifthsColumnSpacer = angular.element('<div></div>');
                fifthsColumnSpacer.addClass('col-md-5ths');

                // Left and right text blocks
                var leftTextBlock = angular.element('<div translate></div>');
                leftTextBlock.addClass('col-md-5ths');
                leftTextBlock.addClass('small');
                leftTextBlock.addClass('text-center');
                leftTextBlock.addClass('likert-minimum-description');
                leftTextBlock.html(minimumDesc);

                var rightTextBlock = leftTextBlock.clone();
                rightTextBlock.removeClass('likert-minimum-description');
                rightTextBlock.addClass('likert-maximum-description');
                rightTextBlock.html(maximumDesc);

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
        }

        function questionIsValid(questionOptions,
                                         singleImgSrc,
                                         leftImgSrc,
                                         rightImgSrc,
                                         minimumDescription,
                                         maximumDescription) {

            // questionOptions must be present...
            if (questionOptions !== undefined) {

                // ...must be an object...
                if (typeof questionOptions !== 'object' ||
                    Array.isArray(questionOptions)) {
                    $log.error('questionOptions was not an object.');
                    return false;
                }

                // ...and must have a choices property...
                if (!questionOptions.hasOwnProperty('choices')) {
                    $log.error(
                        'questionOptions did not have a choice property.'
                    );
                    return false;
                }

                // questionOptions.choices must be an array...
                if (!Array.isArray(questionOptions.choices)) {
                    $log.error('questionOptions.choices was not an array.');
                    return false;
                }

                // ...must have five entries...
                if (questionOptions.choices.length !== 5) {
                    $log.error('questionOptions.choices did not have five' +
                        ' choices.');
                    return false;
                }

                for (var i in questionOptions.choices) {
                    var choice = questionOptions.choices[i];

                    // ...that are objects...
                    if (typeof choice !== 'object' || Array.isArray(choice)) {
                        $log.error('questionOptions.choices[' + i + '] was ' +
                            'not an object.');
                        return false;
                    }

                    // ...that each have a label property...
                    if (!choice.hasOwnProperty('label')) {
                        $log.error('questionOptions.choices[' + i + '] did ' +
                            'not have a label property.');
                        return false;
                    }

                    // ...that are each strings
                    if (typeof choice.label !== 'string') {
                        $log.error('questionOptions.choices[' + i + '].label ' +
                            'was not a string.');
                        return false;
                    }
                }
            }

            // If one image source was provided, it must be a string
            if (singleImgSrc !== undefined &&
                typeof singleImgSrc !== 'string') {
                $log.error('single-img-src was not a string.');
                return false;
            }

            // If one of the two image sources was provided, we must have the
            // other
            if ((leftImgSrc !== undefined && rightImgSrc === undefined) ||
                (rightImgSrc !== undefined && leftImgSrc === undefined)) {

                $log.error('Either left-img-src or right-img-src was given,' +
                    ' but the other was not.');
                return false;
            }

            // If two image sources were provided, both must be strings
            if (leftImgSrc !== undefined && rightImgSrc !== undefined) {
                if (typeof leftImgSrc !== 'string' ||
                    typeof rightImgSrc !== 'string') {

                    $log.error('Either left-img-src or right-img-src was' +
                        ' not a string');
                    return false;
                }
            }

            // If one of the two descriptions was provided, we must have the
            // other
            if ((minimumDescription !== undefined &&
                maximumDescription === undefined) ||
                (maximumDescription !== undefined &&
                minimumDescription === undefined)) {

                $log.error('Either minimum-description or maximum-description' +
                    ' was given, but the other was not.');
                return false;
            }

            // If two descriptions were provided, both must be strings
            if (minimumDescription !== undefined &&
                maximumDescription !== undefined) {

                if (typeof minimumDescription !== 'string' ||
                    typeof maximumDescription !== 'string') {

                    $log.error('Either minimum-description or' +
                        ' maximum-description was not a string.');
                    return false;
                }
            }

            return true;
        }

        function buildOptionLabelsRow(questionOptions) {

            var optionLabelsRow;

            if (questionOptions !== undefined &&
                questionOptions.hasOwnProperty('choices')) {

                var choices = questionOptions.choices;

                var div = angular.element('<div></div>');

                optionLabelsRow = div.clone();
                optionLabelsRow.addClass('row row-likert-option-label');

                var spacer = div.clone();
                spacer.addClass('col-md-2 option-label-spacer');

                optionLabelsRow.append(spacer.clone());

                var choiceContainer = div.clone();
                choiceContainer.addClass(
                    'col-md-8 likert-option-label-container text-center'
                );

                var choice = div.clone();
                choice.addClass('col-md-5ths likert-option-label text-center');
                choice.attr('translate', '');

                for (var i in choices) {
                    var thisChoice = choice.clone();
                    thisChoice.html(
                        '{{ \'' + choices[i].label + '\' }}'
                    );
                    choiceContainer.append(thisChoice);
                }

                optionLabelsRow.append(choiceContainer);

                optionLabelsRow.append(spacer.clone());
            }

            return optionLabelsRow;
        }

        function buildRadiosRow(questionId, questionRequired) {

            // Don't require question if explicitly told not to do so in
            // data
            var responseRequired = false;
            if (questionRequired !== false) {
                responseRequired = true;
            }

            var div = angular.element('<div></div>');

            var radioDiv = div.clone();
            radioDiv.addClass('col-md-5ths text-center');

            var centerContainer = div.clone();
            centerContainer.addClass('col-md-8 text-center');

            var radioInput = angular.element('<input>');
            radioInput.attr('type', 'radio');
            radioInput.attr('name', questionId + 'RadioGroup');
            radioInput.attr('ng-model', questionId + 'RadioGroup');

            if (responseRequired) {
                radioInput.attr('required', '');
            }

            for (var i = 1; i <= 5; i++) {
                var thisRadioDiv = radioDiv.clone();

                var thisRadio = radioInput.clone();
                thisRadio.attr('id', questionId + 'RadioGroup' + i);
                thisRadio.attr('value', i);

                thisRadioDiv.append(thisRadio);
                centerContainer.append(thisRadioDiv);
            }

            var radiosRow = div.clone();
            radiosRow.addClass('row');

            var spacer = div.clone();
            spacer.addClass('col-md-2');

            radiosRow.append(
                spacer.clone(),
                centerContainer,
                spacer.clone()
            );

            return radiosRow;
        }

        return {
            restrict: 'E',
            scope: {},
            controller: function scaleQuestionController() {
                this.questionOptionsAreValid = questionIsValid;
            },

            link: function(scope, element, attrs, ctrl) {

                // Validate the questionOptions
                if (!questionIsValid(
                        element.data('questionOptions'),
                        attrs.singleImgSrc,
                        attrs.leftImgSrc,
                        attrs.rightImgSrc,
                        attrs.minimumDescription,
                        attrs.maximumDescription)
                    ) {
                    return;
                }

                // Bind input to TrialData
                scope.sendToTrialData = function(path, value) {
                    if (!attrs.associatedToMedia) {
                        TrialData.setValueForPath(path, value);
                    } else {
                        TrialData.setValueForPathForCurrentMedia(path, value);
                    }
                };

                // Initialize a dynamically-named variable to keep track of
                // changing responses to null
                scope[attrs.questionId + 'RadioGroup'] = null;

                // Watch that dynamically named variable and update
                // TrialData when it changes
                scope.$watch(
                    attrs.questionId + 'RadioGroup',
                    function(newValue) {
                        scope.sendToTrialData(
                            attrs.controllerDataPath,
                            parseInt(newValue)
                        );
                    });

                var headerRow = buildHeaderRow(
                    attrs.labelType,
                    attrs.questionLabel
                );

                var imageRow = buildImageRow(
                    attrs.singleImgSrc,
                    attrs.leftImgSrc,
                    attrs.rightImgSrc
                );

                var radiosRow = buildRadiosRow(
                    attrs.questionId,
                    element.data('questionRequired')
                );

                var optionLabelsRow = buildOptionLabelsRow(
                    element.data('questionOptions')
                );

                var descriptionsRow = buildDescriptionsRow(
                    attrs.minimumDescription,
                    attrs.maximumDescription
                );

                // Wrap everything in a div with well and row classes
                var wellRow = angular.element('<div></div>');
                wellRow.addClass('row well');

                // Append everything we built
                wellRow.append(
                    headerRow,
                    imageRow,
                    optionLabelsRow,
                    radiosRow,
                    descriptionsRow
                );

                // Add well div to element and compile the element
                element.append(wellRow);
                $compile(element.contents())(scope);
            }
        };
    }]);

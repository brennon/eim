'use strict';

(function() {
    describe('scaleQuestion directive', function() {

        // Initialize global variables
        var $scope, $compile, element, TrialData, $httpBackend;

        // Valid options
        var validQuestionOptions = {
            choices: [
                { label: 'a' },
                { label: 'b' },
                { label: 'c' },
                { label: 'd' },
                { label: 'e' }
            ]
        };
        var validSingleImgSrc = 'singleImage.png';
        var validLeftImgSrc = 'leftImage.png';
        var validRightImgSrc = 'rightImage.png';
        var validMinimumDescription = 'Minimum description';
        var validMaximumDescription = 'Maximum description';
        var validQuestionText = 'Question Text';
        var validQuestionId = 'power';
        var validPath = 'data.answers.ratings.power';

        // Load the main application module
        beforeEach(module(ApplicationConfiguration.applicationModuleName));

        beforeEach(
            inject(
                function(_$rootScope_, _$compile_, _TrialData_,
                         _$httpBackend_) {
                    $scope = _$rootScope_.$new();
                    $compile = _$compile_;
                    element = angular.element(
                        '<scale-question question-label="'+validQuestionText+
                        '" '+
                        'single-img-src="' + validSingleImgSrc +
                        '" ' +
                        'question-id="' + validQuestionId +
                        '" ' +
                        'minimum-description="' + validMinimumDescription +
                        '" ' +
                        'maximum-description="' + validMaximumDescription +
                        '" ' +
                        'controller-data-path="' + validPath + '">' +
                        '</scale-question>'
                    );
                    TrialData = _TrialData_;

                    // Attach question options to question
                    element.data('questionOptions', validQuestionOptions);

                    $httpBackend = _$httpBackend_;
                    $httpBackend.whenGET('/api/config').respond();

                    // Compile the element and process scope
                    $compile(element)($scope);
                    $scope.$digest();
                }
            )
        );

        describe('header', function() {
            it('should be added', function() {
                var regex = new RegExp(
                    '<h3.*' + validQuestionText + '.*\/h3>'
                );
                expect(element.html()).toMatch(regex);
            });

            it('should be a label if the labelType is set to labelLeft',
                function() {

                element = angular.element(
                    '<scale-question question-label="'+validQuestionText+'" ' +
                    'label-type="labelLeft" ' +
                    'single-img-src="' + validSingleImgSrc + '" ' +
                    'question-id="' + validQuestionId + '" ' +
                    'minimum-description="' + validMinimumDescription + '" ' +
                    'maximum-description="' + validMaximumDescription + '" ' +
                    'controller-data-path="' + validPath + '">' +
                    '</scale-question>'
                );

                // Attach question options to question
                element.data('questionOptions', validQuestionOptions);

                $compile(element)($scope);
                $scope.$digest();

                var badRegex = new RegExp(
                    '<h3.*' + validQuestionText + '.*\/h3>'
                );

                var goodRegex = new RegExp(
                    '<label.*' + validQuestionText + '.*\/label>'
                );

                expect(element.html()).not.toMatch(badRegex);
                expect(element.html()).toMatch(goodRegex);
            });
        });

        describe('validation', function() {
            var validationFn;

            beforeEach(function() {
                var ctrl = element.controller('scaleQuestion');
                validationFn = ctrl.questionOptionsAreValid;
            });

            it('should pass with good arguments', function() {
                expect(validationFn(
                    validQuestionOptions,
                    validSingleImgSrc,
                    undefined,
                    undefined,
                    validMinimumDescription,
                    validMaximumDescription
                )).toBeTruthy();
            });

            it('should not fail if there are no questionOptions',
                function() {
                expect(validationFn(
                    undefined,
                    validSingleImgSrc,
                    undefined,
                    undefined,
                    validMinimumDescription,
                    validMaximumDescription
                )).toBeTruthy();
            });

            it('should fail if questionOptions is not an object',
                function() {
                expect(validationFn(
                    ['a', 'b', 'c'],
                    validSingleImgSrc,
                    undefined,
                    undefined,
                    validMinimumDescription,
                    validMaximumDescription
                )).toBeFalsy();
            });

            it('should fail if there are no questionOptions.choices',
                function() {
                expect(validationFn(
                    {},
                    validSingleImgSrc,
                    undefined,
                    undefined,
                    validMinimumDescription,
                    validMaximumDescription
                )).toBeFalsy();
            });

            it('should fail if questionOptions.choices is not an array',
                function() {
                expect(validationFn(
                    {choices: 'foo'},
                    validSingleImgSrc,
                    undefined,
                    undefined,
                    validMinimumDescription,
                    validMaximumDescription
                )).toBeFalsy();
            });

            it('should fail if there are not five choices', function() {
                expect(validationFn(
                    {choices:[]},
                    validSingleImgSrc,
                    undefined,
                    undefined,
                    validMinimumDescription,
                    validMaximumDescription
                )).toBeFalsy();
            });

            it('should fail if there the choices are not all objects',
                function() {
                expect(validationFn(
                    {choices:[1,2,{},4,5]},
                    validSingleImgSrc,
                    undefined,
                    undefined,
                    validMinimumDescription,
                    validMaximumDescription
                )).toBeFalsy();
            });

            it('should fail if not all five choices have labels', function() {
                expect(validationFn(
                    {
                        choices: [
                            { label: 'a' },
                            { label: 'b' },
                            { label: 'c' },
                            { label: 'd' },
                            {}
                        ]
                    },
                    validSingleImgSrc,
                    undefined,
                    undefined,
                    validMinimumDescription,
                    validMaximumDescription
                )).toBeFalsy();
            });

            it('should fail if not all five choices have strings as labels',
                function() {

                expect(validationFn(
                    {
                        choices: [
                            { label: 'a' },
                            { label: 'b' },
                            { label: 'c' },
                            { label: 'd' },
                            { label: 5 }
                        ]
                    },
                    validSingleImgSrc,
                    undefined,
                    undefined,
                    validMinimumDescription,
                    validMaximumDescription
                )).toBeFalsy();
            });

            it('should fail if the single image source was not a string',
                function() {

                expect(validationFn(
                    validQuestionOptions,
                    42,
                    undefined,
                    undefined,
                    validMinimumDescription,
                    validMaximumDescription
                )).toBeFalsy();
            });

            it('should fail if only one of two images was specified',
                function() {

                expect(validationFn(
                    validQuestionOptions,
                    undefined,
                    validLeftImgSrc,
                    undefined,
                    validMinimumDescription,
                    validMaximumDescription
                )).toBeFalsy();

                expect(validationFn(
                    validQuestionOptions,
                    undefined,
                    undefined,
                    validRightImgSrc,
                    validMinimumDescription,
                    validMaximumDescription
                )).toBeFalsy();
            });

            it('should fail if both two images are not strings', function() {
                expect(validationFn(
                    validQuestionOptions,
                    undefined,
                    validLeftImgSrc,
                    42,
                    validMinimumDescription,
                    validMaximumDescription
                )).toBeFalsy();

                expect(validationFn(
                    validQuestionOptions,
                    undefined,
                    42,
                    validRightImgSrc,
                    validMinimumDescription,
                    validMaximumDescription
                )).toBeFalsy();
            });

            it('should fail if only one of two descriptions was specified',
                function() {

                expect(validationFn(
                    validQuestionOptions,
                    undefined,
                    validLeftImgSrc,
                    validRightImgSrc,
                    undefined,
                    validMaximumDescription
                )).toBeFalsy();

                expect(validationFn(
                    validQuestionOptions,
                    undefined,
                    validLeftImgSrc,
                    validRightImgSrc,
                    validMinimumDescription,
                    undefined
                )).toBeFalsy();
            });

            it('should fail if both two descriptions are not strings',
                function() {

                expect(validationFn(
                    validQuestionOptions,
                    undefined,
                    validLeftImgSrc,
                    validRightImgSrc,
                    42,
                    validMaximumDescription
                )).toBeFalsy();

                expect(validationFn(
                    validQuestionOptions,
                    undefined,
                    validLeftImgSrc,
                    validRightImgSrc,
                    validMinimumDescription,
                    42
                )).toBeFalsy();
            });
        });

        describe('single image', function() {

            var imageRow;
            var imageRegex = new RegExp(
                '<img src="' + validSingleImgSrc + '".*>'
            );

            beforeEach(function() {
                var wrapperRow = $(element.children()[0]);
                imageRow = $(wrapperRow.children()[1]);
            });

            it('should include the image', function() {
                expect(element.html()).toMatch(imageRegex);
            });

            it('should add space to either side of the image and center it',
                function() {

                // Should be spacer div, then image div, then spacer div
                var labelRowChildren = imageRow.children();

                // imageRow should have class 'row'
                expect($(imageRow[0]).hasClass('row')).toBe(true);

                // The outer divs should be two columns wide
                expect($(labelRowChildren[0]).hasClass('col-md-2')).toBe(true);
                expect($(labelRowChildren[2]).hasClass('col-md-2')).toBe(true);

                // The center div should be eight columns wide, centered,
                // and hold the image
                var centerDiv = $(labelRowChildren[1]);
                expect(centerDiv.hasClass('col-md-8')).toBe(true);
                expect(centerDiv.hasClass('text-center')).toBe(true);
                expect(centerDiv.children()[0].outerHTML).toMatch(imageRegex);
            });
        });

        describe('extreme images', function() {
            beforeEach(function() {
                element = angular.element(
                    '<scale-question question-label="'+validQuestionText+'" ' +
                    'label-type="labelLeft" ' +
                    'left-img-src="' + validLeftImgSrc + '" ' +
                    'right-img-src="' + validRightImgSrc + '" ' +
                    'question-id="' + validQuestionId + '" ' +
                    'minimum-description="' + validMinimumDescription + '" ' +
                    'maximum-description="' + validMaximumDescription + '" ' +
                    'controller-data-path="' + validPath + '">' +
                    '</scale-question>'
                );

                // Attach question options to question
                element.data('questionOptions', validQuestionOptions);

                $compile(element)($scope);
                $scope.$digest();
            });

            it('should include both images', function() {
                expect(element.html()).toMatch(
                    new RegExp('<img.*src="'+validLeftImgSrc+'".*>')
                );
                expect(element.html()).toMatch(
                    new RegExp('<img.*src="'+validRightImgSrc+'".*>')
                );
            });

            it('should properly space both images', function() {
                var imgRow = $(element).find('div.row')[2];
                expect($(imgRow).html())
                    .toMatch(/(col-md-2.*){2}col-md-4.*(col-md-2.*){2}/);
            });
        });

        describe('option labels', function() {
            it('should correctly layout the DOM for the labels', function() {

                // Get row for option labels
                var labelRow = $(element).find('div.row-likert-option-label');
                var childrenDivs = $(labelRow).children();

                // First and last children of this row should be spacers and
                // cols
                expect($(childrenDivs[0]).hasClass('option-label-spacer'))
                    .toBe(true);
                expect($(childrenDivs[0]).hasClass('col-md-2'))
                    .toBe(true);
                expect($(childrenDivs[2]).hasClass('option-label-spacer'))
                    .toBe(true);
                expect($(childrenDivs[2]).hasClass('col-md-2'))
                    .toBe(true);

                // Middle child should be a col that contains a row
                var middleChild = $(childrenDivs[1]);
                expect(middleChild.hasClass('likert-option-label-container'))
                    .toBe(true);
                expect(middleChild.hasClass('col-md-8')).toBe(true);

                // Middle child should be divided into fifths
                var innerRowChildren = middleChild.children();
                expect(innerRowChildren.length).toBe(5);
                for (var i = 0; i < innerRowChildren.length; i++) {
                    var thisChildDiv = $(innerRowChildren[i]);
                    expect(thisChildDiv.hasClass('col-md-5ths')).toBe(true);
                    expect(thisChildDiv.hasClass('likert-option-label'))
                        .toBe(true);

                    // Text should be centered
                    expect(thisChildDiv.hasClass('text-center')).toBe(true);
                }
            });

            it('should correctly layout the DOM for the labels', function() {

                // Get the option labels
                var optionLabels = $(element).find('.likert-option-label');

                // Should all match the ones passed to element.data
                for (var i = 0; i < optionLabels.length; i++) {
                    expect($(optionLabels[i]).text())
                        .toBe(validQuestionOptions.choices[i].label);
                }
            });
        });

        describe('no images', function() {
           it('should not include any images', function() {
               element = angular.element(
                   '<scale-question question-label="'+validQuestionText+'" ' +
                   'label-type="labelLeft" ' +
                   'question-id="' + validQuestionId + '" ' +
                   'minimum-description="' + validMinimumDescription + '" ' +
                   'maximum-description="' + validMaximumDescription + '" ' +
                   'controller-data-path="' + validPath + '">' +
                   '</scale-question>'
               );
               $compile(element)($scope);

               var images = $(element).find('img');

               expect(images.length).toBe(0);
           });
        });

        describe('radio buttons', function() {
            var radios;

            beforeEach(function() {
                radios = $(element)
                    .find('input[id^='+validQuestionId+'RadioGroup]');
            });

            it('should add five radio buttons', function() {
                expect(radios.length).toBe(5);
            });

            it('should set the correct id on each radio button', function() {
                for (var i = 0; i < radios.length; i++) {
                    expect(radios[i].id)
                        .toBe(validQuestionId + 'RadioGroup' + (i+1));
                }
            });

            it('should set the correct value on each radio button', function() {
                for (var i = 0; i < radios.length; i++) {
                    expect(parseInt(radios[i].value)).toBe(i+1);
                }
            });

            it('should set the correct name on each radio button', function() {
                for (var i = 0; i < radios.length; i++) {
                    expect(radios[i].name).toBe('powerRadioGroup');
                }
            });

            it('should set the required attribute on each radio button by' +
                ' default', function() {
                for (var i = 0; i < radios.length; i++) {
                    expect(radios[i].required).toBe(true);
                }
            });

            // TODO: questionRequired should be an attribute, not on data

            it('should not set the required attribute on each radio button' +
                ' when specified', function() {

                element = angular.element(
                    '<scale-question question-label="'+validQuestionText+'" ' +
                    'label-type="labelLeft" ' +
                    'question-id="' + validQuestionId + '" ' +
                    'minimum-description="' + validMinimumDescription + '" ' +
                    'maximum-description="' + validMaximumDescription + '" ' +
                    'controller-data-path="' + validPath + '">' +
                    '</scale-question>'
                );

                element.data('questionRequired', false);
                $compile(element)($scope);

                radios = $(element)
                    .find('input[id^='+validQuestionId+'RadioGroup]');

                for (var i = 0; i < radios.length; i++) {
                    expect(radios[i].required).toBe(false);
                }
            });

            it('should set the correct model on each radio button', function() {
                for (var i = 0; i < radios.length; i++) {
                    expect($(radios[i]).attr('ng-model'))
                        .toBe(validQuestionId + 'RadioGroup');
                }
            });
        });

        describe('textual descriptions', function() {
            var descriptionsBlock,
                descriptionsBlockClass,
                leftDescriptionDiv,
                rightDescriptionDiv,
                leftSpacer,
                rightSpacer,
                innerRow,
                innerRowChildren;

            beforeEach(function() {
                descriptionsBlockClass = 'row-likert-descriptions';
                descriptionsBlock = $(element)
                    .find('.' + descriptionsBlockClass);
                leftSpacer = $(descriptionsBlock).children()[0];
                innerRow = $(descriptionsBlock).children()[1];
                rightSpacer = $(descriptionsBlock).children()[2];
                innerRowChildren = $(innerRow).children();
                leftDescriptionDiv = $(innerRowChildren[0]);
                rightDescriptionDiv = $(innerRowChildren[4]);
            });

            it('should make the inner row a row div', function() {
                expect($(innerRow).hasClass('col-md-8')).toBe(true);
            });

            it('should split the inner row into five 5ths', function() {
                expect(innerRowChildren.length).toBe(5);

                for (var i = 0; i < innerRowChildren.length; i++) {
                    var thisSpacer = $(innerRowChildren[i]);
                    expect(thisSpacer.hasClass('col-md-5ths'));
                }
            });

            it('should give the inner row the likert-descriptions-container ' +
                'class', function() {
                expect($(innerRow).hasClass('likert-descriptions-container'))
                    .toBe(true);
            });

            it('should make the side spacers two columns wide', function() {
                expect($(leftSpacer).hasClass('col-md-2')).toBe(true);
                expect($(rightSpacer).hasClass('col-md-2')).toBe(true);
            });

            it('should include the minimum description', function() {
                expect($(leftDescriptionDiv).html())
                    .toMatch(validMinimumDescription);
            });

            it('should include the maximum description', function() {
                expect($(rightDescriptionDiv).html())
                    .toMatch(validMaximumDescription);
            });

            it('should include the small class on the minimum description',
                function() {
                expect($(leftDescriptionDiv).hasClass('small')).toBe(true);
            });

            it('should include the small class on the maximum description',
                function() {
                expect($(rightDescriptionDiv).hasClass('small')).toBe(true);
            });

            it('should include the text-center class on the minimum ' +
                'description', function() {
                expect($(leftDescriptionDiv).hasClass('text-center'))
                    .toBe(true);
            });

            it('should include the text-right class on the maximum ' +
                'description', function() {
                expect($(rightDescriptionDiv).hasClass('text-center'))
                    .toBe(true);
            });

            it('should include the col-md-5ths class on the minimum ' +
                'description', function() {
                expect($(leftDescriptionDiv).hasClass('col-md-5ths'))
                    .toBe(true);
            });

            it('should include the col-md-5ths class on the maximum ' +
                'description', function() {
                expect(
                    $(rightDescriptionDiv).hasClass('col-md-5ths')
                ).toBe(true);
            });

            it('should include the likert-minimum-description class on the ' +
                'minimum description', function() {
                expect(
                    $(leftDescriptionDiv).hasClass('likert-minimum-description')
                ).toBe(true);
            });

            it('should include the likert-maximum-description class on the ' +
                'maximum description', function() {
                expect(
                    $(rightDescriptionDiv)
                        .hasClass('likert-maximum-description')
                ).toBe(true);
            });

            it('should not be included if they aren\'t defined', function() {
                element = angular.element(
                    '<scale-question question-label="'+validQuestionText+'" ' +
                    'label-type="labelLeft" ' +
                    'question-id="' + validQuestionId + '" ' +
                    'controller-data-path="' + validPath + '">' +
                    '</scale-question>'
                );

                $compile(element)($scope);
                expect($(element).find('.' + descriptionsBlockClass).length)
                    .toBe(0);
            });
        });

        describe('data binding', function() {
            it('should call TrialData with the correct data when an option ' +
                'is selected', function() {

                var inputs = $(element).find('input[type="radio"]');
                var secondInput = $(inputs[1]);

                spyOn(TrialData, 'setValueForPath');

                secondInput.scope().powerRadioGroup = '1';
                secondInput.scope().$apply();

                expect(TrialData.setValueForPath.calls.count()).toBe(1);
                expect(TrialData.setValueForPath.calls.argsFor(0)[0])
                    .toBe('data.answers.ratings.power');
                expect(TrialData.setValueForPath.calls.argsFor(0)[1]).toBe(1);
            });

            it('should call TrialData with the correct data when an option ' +
                'is selected and the question is associated to media',
                function() {

                element = angular.element(
                    '<scale-question question-label="'+validQuestionText+'" ' +
                    'single-img-src="' + validSingleImgSrc + '" ' +
                    'question-id="' + validQuestionId + '" ' +
                    'minimum-description="' + validMinimumDescription + '" ' +
                    'maximum-description="' + validMaximumDescription + '" ' +
                    'controller-data-path="' + validPath + '">' +
                    '</scale-question>'
                );
                element.attr('associated-to-media', 'true');

                // Attach question options to question
                element.data('questionOptions', validQuestionOptions);

                $compile(element)($scope);
                $scope.$digest();

                spyOn(TrialData, 'setValueForPathForCurrentMedia');

                TrialData.data.state.mediaPlayCount = 2;

                element.isolateScope().$apply(function() {
                    element.isolateScope().powerRadioGroup = '1';
                });

                expect(
                    TrialData.setValueForPathForCurrentMedia.calls.count()
                ).toBe(1);
                expect(
                    TrialData
                        .setValueForPathForCurrentMedia
                        .calls
                        .argsFor(0)[0]
                ).toBe(validPath);
                expect(
                    TrialData
                        .setValueForPathForCurrentMedia
                        .calls
                        .argsFor(0)[1]
                ).toBe(1);
            });
        });
    });
})();
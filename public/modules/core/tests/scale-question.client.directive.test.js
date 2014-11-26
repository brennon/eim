'use strict';

(function() {
    describe('scale-question directive', function() {

        //Initialize global variables
        var $scope, $compile, element, TrialData;

        // Load the main application module
        beforeEach(module(ApplicationConfiguration.applicationModuleName));

        beforeEach(inject(function(_$rootScope_, _$compile_, _TrialData_) {
            $scope = _$rootScope_;
            $compile = _$compile_;
            element = angular.element('<scale-question question-label="qText" single-img-src="img/single.png" question-id="power" minimum-description="Lower description" maximum-description="Upper description" controller-data-path="data.answers.ratings.power"></scale-question>');
            TrialData = _TrialData_;
        }));
        
        it('should add a header for the question text', function() {
            $compile(element)($scope);
            $scope.$digest();
            expect(element.html()).toMatch(/<h3.*qText.*\/h3>/);
        });

        it('should add a label if the labelType is set to labelLeft', function() {
            element = angular.element('<scale-question question-label="qText" label-type="labelLeft" single-img-src="img/single.png" question-id="power" minimum-description="Lower description" maximum-description="Upper description" controller-data-path="data.answers.ratings.power"></scale-question>');
            $compile(element)($scope);
            $scope.$digest();

            expect(element.html()).not.toMatch(/<h3>qText<\/h3>/);
            expect(element.html()).toMatch(/<label.*qText.*\/label>/);
        });

        describe('single image', function() {
            it('should include the image', function() {
                $compile(element)($scope);
                expect(element.html()).toMatch(/<img.*src="img\/single.png".*>/);
            });

            it('should add space to either side of the image and center it', function() {
                $compile(element)($scope);

                var wrapperRow = $(element.children()[0]);
                var labelRow = $(wrapperRow.children()[1]);

                // Should be spacer div, then image div, then spacer div
                var labelRowChildren = labelRow.children();

                // labelRow should have class 'row'
                expect($(labelRow[0]).hasClass('row')).toBe(true);

                // The outer divs should be two columns wide
                expect($(labelRowChildren[0]).hasClass('col-md-2')).toBe(true);
                expect($(labelRowChildren[2]).hasClass('col-md-2')).toBe(true);

                // The center div should be eight columns wide, centered, and hold the image
                var centerDiv = $(labelRowChildren[1]);
                expect(centerDiv.hasClass('col-md-8')).toBe(true);
                expect(centerDiv.hasClass('text-center')).toBe(true);
                expect(centerDiv.children()[0].outerHTML).toMatch(/img\/single.png/);
            });
        });

        describe('extreme images', function() {
            it('should include both images', function() {
                element = angular.element('<scale-question question-label="qText" left-img-src="img/left.png" right-img-src="img/right.png" question-id="power" minimum-description="Lower description" maximum-description="Upper description" controller-data-path="data.answers.ratings.power"></scale-question>');
                $compile(element)($scope);
                expect(element.html()).toMatch(/<img.*src="img\/left.png".*>/);
                expect(element.html()).toMatch(/<img.*src="img\/right.png".*>/);
            });

            it('should properly space both images', function() {
                element = angular.element('<scale-question question-label="qText" left-img-src="img/left.png" right-img-src="img/right.png" question-id="power" minimum-description="Lower description" maximum-description="Upper description" controller-data-path="data.answers.ratings.power"></scale-question>');
                $compile(element)($scope);
                var imgRow = $(element).find('div.row')[2];
                expect($(imgRow).html()).toMatch(/(col-md-2.*){2}col-md-4.*(col-md-2.*){2}/);
            });
        });

        describe('option labels', function() {
            it('should correctly layout the DOM for the labels', function() {
                var mockOptions = {
                    choices : [
                        {
                            label : 'Disagree strongly'
                        },
                        {
                            label : 'Disagree a little'
                        },
                        {
                            label : 'Neither agree nor disagree'
                        },
                        {
                            label : 'Agree a little'
                        },
                        {
                            label : 'Agree strongly'
                        }
                    ]
                };

                // Main element
                element = angular.element('<scale-question question-label="qText" question-label-type="labelLeft" question-id="power" controller-data-path="data.answers.ratings.power"></scale-question>');
                element.data('questionOptions', mockOptions);
                $compile(element)($scope);
                $scope.$digest();

                var wrapperRow = $($(element).children()[0]);
                var labelRow = $(wrapperRow).children()[1];
                var childrenDivs = $(labelRow).children();

                // First and last children should be spacers and cols
                expect($(childrenDivs[0]).hasClass('option-label-spacer')).toBe(true);
                expect($(childrenDivs[0]).hasClass('col-md-2')).toBe(true);
                expect($(childrenDivs[2]).hasClass('option-label-spacer')).toBe(true);
                expect($(childrenDivs[2]).hasClass('col-md-2')).toBe(true);

                // Middle child should be a col that contains a row
                var middleChild = $(childrenDivs[1]);
                expect(middleChild.hasClass('option-label-container')).toBe(true);
                expect(middleChild.hasClass('col-md-8')).toBe(true);

                // Middle child should hold a row
                var innerRow = $(middleChild.children()[0]);
                expect(innerRow.hasClass('row')).toBe(true);

                // This row should be divided into fifths
                var innerRowChildren = innerRow.children();
                expect(innerRowChildren.length).toBe(5);
                for (var i = 0; i < innerRowChildren.length; i++) {
                    var thisChildDiv = $(innerRowChildren[i]);
                    expect(thisChildDiv.hasClass('col-md-5ths')).toBe(true);
                    expect(thisChildDiv.hasClass('option-label')).toBe(true);

                    // Text should be centered
                    expect(thisChildDiv.hasClass('text-center')).toBe(true);
                }
            });

            it('should correctly layout the DOM for the labels', function() {
                var mockOptions = {
                    choices : [
                        {
                            label : 'Disagree strongly'
                        },
                        {
                            label : 'Disagree a little'
                        },
                        {
                            label : 'Neither agree nor disagree'
                        },
                        {
                            label : 'Agree a little'
                        },
                        {
                            label : 'Agree strongly'
                        }
                    ]
                };
                element = angular.element('<scale-question question-label="qText" question-label-type="labelLeft" question-id="power" controller-data-path="data.answers.ratings.power"></scale-question>');
                element.data('questionOptions', mockOptions);
                $compile(element)($scope);
                $scope.$digest();

                var labelRow = $(element).find('div.row')[1];
                var childrenDivs = $(labelRow).children();

                var middleChild = $(childrenDivs[1]);

                var innerRow = $(middleChild.children()[0]);

                var innerRowChildren = innerRow.children();
                for (var i = 0; i < innerRowChildren.length; i++) {
                    expect($(innerRowChildren[i]).text()).toBe(mockOptions.choices[i].label);
                }
            });
        });

        describe('no images', function() {
           it('should not include any images', function() {
               element = angular.element('<scale-question question-label="qText" question-id="power" minimum-description="Lower description" maximum-description="Upper description" controller-data-path="data.answers.ratings.power"></scale-question>');
               $compile(element)($scope);

               var images = $(element).find('img');

               expect(images.length).toBe(0);
           });
        });

        describe('radio buttons', function() {
            it('should add five radio buttons', function() {
                $compile(element)($scope);
                var regex = /(input type="radio")/g;
                var result = element.html().match(regex);
                expect(result.length).toBe(5);
            });

            it('should set the correct id on each radio button', function() {
                $compile(element)($scope);
                var inputs = $(element).find('input[type="radio"]');
                for (var i = 0; i < inputs.length; i++) {
                    expect(inputs[i].id).toBe('powerRadioGroup'+(i+1));
                }
            });

            it('should set the correct value on each radio button', function() {
                $compile(element)($scope);
                var inputs = $(element).find('input[type="radio"]');
                for (var i = 0; i < inputs.length; i++) {
                    expect(parseInt(inputs[i].value)).toBe(i+1);
                }
            });

            it('should set the correct name on each radio button', function() {
                $compile(element)($scope);
                var inputs = $(element).find('input[type="radio"]');
                for (var i = 0; i < inputs.length; i++) {
                    expect(inputs[i].name).toBe('powerRadioGroup');
                }
            });

            it('should set the required attribute on each radio button', function() {
                $compile(element)($scope);
                var inputs = $(element).find('input[type="radio"][name="powerRadioGroup"]');
                for (var i = 0; i < inputs.length; i++) {
                    expect(inputs[i].required).toBe(true);
                }
            });

            it('should set the correct model on each radio button', function() {
                $compile(element)($scope);
                var inputs = $(element).find('input[type="radio"][name="powerRadioGroup"]');
                for (var i = 0; i < inputs.length; i++) {
                    expect($(inputs[i]).attr('ng-model')).toBe('powerRadioGroup');
                }
            });
        });
        
        describe('textual descriptions', function() {
            var wrapperRow,
                descriptionsBlock,
                descriptionsBlockClass,
                leftDescriptionDiv,
                rightDescriptionDiv,
                leftSpacer,
                rightSpacer,
                innerRow,
                innerRowChildren;

            beforeEach(function() {
                $compile(element)($scope);
                element = $(element);
                wrapperRow = $(element.children()[0]);
                descriptionsBlock = $(wrapperRow).children()[3];
                descriptionsBlockClass = 'scale-descriptions';
                leftSpacer = $(descriptionsBlock).children()[0];
                rightSpacer = $(descriptionsBlock).children()[2];
                innerRow = $(descriptionsBlock).children()[1];
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

            it('should give the inner row the scale-descriptions-inner-row class', function() {
                expect($(innerRow).hasClass('scale-descriptions-inner-row')).toBe(true);
            });

            it('should make the side spacers two columns wide', function() {
                expect($(leftSpacer).hasClass('col-md-2')).toBe(true);
                expect($(rightSpacer).hasClass('col-md-2')).toBe(true);
            });

            it('should give the descriptions div class scale-descriptions', function() {
                expect($(descriptionsBlock).hasClass(descriptionsBlockClass)).toBe(true);
            });

            it('should include the minimum description', function() {
                expect($(leftDescriptionDiv).html()).toMatch(/Lower description/);
            });
            
            it('should include the maximum description', function() {
                expect($(rightDescriptionDiv).html()).toMatch(/Upper description/);
            });

            it('should include the small class on the minimum description', function() {
                expect($(leftDescriptionDiv).hasClass('small')).toBe(true);
            });

            it('should include the small class on the maximum description', function() {
                expect($(rightDescriptionDiv).hasClass('small')).toBe(true);
            });

            it('should include the text-center class on the minimum description', function() {
                expect($(leftDescriptionDiv).hasClass('text-center')).toBe(true);
            });

            it('should include the text-right class on the maximum description', function() {
                expect($(rightDescriptionDiv).hasClass('text-center')).toBe(true);
            });

            it('should include the col-md-5ths class on the minimum description', function() {
                expect($(leftDescriptionDiv).hasClass('col-md-5ths')).toBe(true);
            });

            it('should include the col-md-5ths class on the maximum description', function() {
                expect($(rightDescriptionDiv).hasClass('col-md-5ths')).toBe(true);
            });

            it('should include the scale-minimum-description class on the minimum description', function() {
                expect($(leftDescriptionDiv).hasClass('scale-minimum-description')).toBe(true);
            });

            it('should include the scale-maximum-description class on the maximum description', function() {
                expect($(rightDescriptionDiv).hasClass('scale-maximum-description')).toBe(true);
            });

            it('should not be included if they aren\'t defined', function() {
                element = angular.element('<scale-question question-label="qText" question-id="power" controller-data-path="data.answers.ratings.power"></scale-question>');
                $compile(element)($scope);
                expect(element.find('.' + descriptionsBlockClass).length).toBe(0);
            });
        });

        describe('data binding', function() {
            it('should call TrialData with the correct data when an option is selected', function() {
                $compile(element)($scope);
                var inputs = $(element).find('input[type="radio"]');
                var secondInput = $(inputs[1]);

                spyOn(TrialData, 'setValueForPath');

                secondInput.scope().powerRadioGroup = '1';
                secondInput.scope().$apply();

                expect(TrialData.setValueForPath.calls.count()).toBe(1);
                expect(TrialData.setValueForPath.calls.argsFor(0)[0]).toBe('data.answers.ratings.power');
                expect(TrialData.setValueForPath.calls.argsFor(0)[1]).toBe(1);
            });

            it('should call TrialData with the correct data when an option is selected and the question is associated to media', function() {
                element = angular.element('<scale-question question-label="qText" single-img-src="img/single.png" question-id="power" minimum-description="Lower description" maximum-description="Upper description" controller-data-path="data.answers.ratings.power" associated-to-media="true"></scale-question>');
                $compile(element)($scope);
                var inputs = $(element).find('input[type="radio"]');
                var secondInput = $(inputs[1]);

                TrialData.data.state.mediaPlayCount = 2;
                spyOn(TrialData, 'setValueForPathForCurrentMedia');

                secondInput.scope().powerRadioGroup = '1';
                secondInput.scope().$apply();

                expect(TrialData.setValueForPathForCurrentMedia.calls.count()).toBe(1);
                expect(TrialData.setValueForPathForCurrentMedia.calls.argsFor(0)[0]).toBe('data.answers.ratings.power');
                expect(TrialData.setValueForPathForCurrentMedia.calls.argsFor(0)[1]).toBe(1);
            });
        });
    });
})();
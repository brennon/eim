'use strict';

(function () {
    describe('questionnaire directive', function () {

        //Initialize global variables
        var $scope, $compile, element;

        // Load the main application module
        beforeEach(module(ApplicationConfiguration.applicationModuleName));

        beforeEach(inject(function (_$rootScope_, _$compile_) {
            $scope = _$rootScope_.$new();
            $compile = _$compile_;
            element = angular.element('<questionnaire questionnaire-data="questionnaireData" questionnaire-form="questionnaireForm"></questionnaire>');
        }));

        it('should add a header for the page title', function () {
            $scope.questionnaireData = {
                title: 'Media Questions',
                structure: []
            };
            $compile(element)($scope);
            $scope.$digest();

            expect(element.html()).toMatch(/<h1.*Media Questions.*\/h1>/);
        });


        it('should not show the page title if a title isn\'t specified', function() {
            $scope.questionnaireData = {
                structure: []
            };
            $compile(element)($scope);
            $scope.$digest();

            expect(element.html()).not.toMatch(/h1/);
        });

        it('should add the introductory text if it is defined', function() {
            $scope.questionnaireData = {
                structure: [],
                introductoryText: 'This is my introductory text, chief.'
            };
            $compile(element)($scope);
            $scope.$digest();

            expect(element.html()).toMatch($scope.questionnaireData.introductoryText);
        });

        it('should add a form with name questionnaireForm to the page', function () {
            $scope.questionnaireData = {
                title: 'Media Questions',
                structure: []
            };
            $compile(element)($scope);

            var formElements = $(element).find('form.form[name="questionnaireForm"][novalidate=""]');
            expect(formElements.length).toBe(1);
        });

        it('should add a spacer after each question', function () {
            $scope.questionnaireData = {
                structure: [
                    {
                        questionType: 'likert'
                    }
                ]
            };

            $compile(element)($scope);

            var scaleQuestionElements = $(element).find('scale-question');
            var spacerDiv = $(scaleQuestionElements).next().children()[0];
            expect($(spacerDiv).hasClass('questionSpacer')).toBe(true);
        });

        it('should bind the isolated questionnaireForm to the local questionnaireForm', function () {
            element = angular.element('<questionnaire questionnaire-data="questionnaireData" questionnaire-form="theForm"></questionnaire>');
            $scope.questionnaireData = {
                structure: [
                    {
                        questionType: 'radio'
                    },
                    {
                        questionType: 'dropdown'
                    },
                    {
                        questionType: 'likert'
                    },
                    {
                        questionType: 'dropdown'
                    }
                ]
            };
            $compile(element)($scope);
            element.isolateScope().$digest();
            expect(element.isolateScope().questionnaireForm).toBe($scope.theForm);
        });

        describe('scale-question directives', function () {
            it('should add a scale-question directive for those entries with likert as questionType', function () {
                $scope.questionnaireData = {
                    structure: [
                        {
                            questionType: 'likert'
                        },
                        {
                            questionType: 'radio'
                        },
                        {
                            questionType: 'likert'
                        }
                    ]
                };
                $compile(element)($scope);

                var scaleQuestionElements = $(element).find('scale-question');
                expect(scaleQuestionElements.length).toBe(2);
            });

            it('should add the question-id for a scale-question directive', function () {
                $scope.questionnaireData = {
                    structure: [
                        {
                            questionType: 'likert',
                            questionId: 'aQuestionId'
                        }
                    ]
                };

                $compile(element)($scope);

                var scaleQuestionElements = $(element).find('scale-question');
                expect($(scaleQuestionElements[0]).attr('question-id')).toBe('aQuestionId');
            });

            it('should add the title for a scale-question directive', function () {
                $scope.questionnaireData = {
                    structure: [
                        {
                            questionType: 'likert',
                            questionLabel: 'Question Label'
                        }
                    ]
                };

                $compile(element)($scope);

                var scaleQuestionElements = $(element).find('scale-question');
                expect($(scaleQuestionElements).attr('question-label')).toBe('Question Label');
            });

            it('should add the minimum description for a scale-question directive', function () {
                $scope.questionnaireData = {
                    structure: [
                        {
                            questionType: 'likert',
                            questionLikertMinimumDescription: 'Minimum Description'
                        }
                    ]
                };

                $compile(element)($scope);

                var scaleQuestionElements = $(element).find('scale-question');
                expect($(scaleQuestionElements).attr('minimum-description')).toBe('Minimum Description');
            });

            it('should add the maximum description for a scale-question directive', function () {
                $scope.questionnaireData = {
                    structure: [
                        {
                            questionType: 'likert',
                            questionLikertMaximumDescription: 'Maximum Description'
                        }
                    ]
                };

                $compile(element)($scope);

                var scaleQuestionElements = $(element).find('scale-question');
                expect($(scaleQuestionElements).attr('maximum-description')).toBe('Maximum Description');
            });

            it('should add the image source for a single image scale-question directive', function () {
                $scope.questionnaireData = {
                    structure: [
                        {
                            questionType: 'likert',
                            questionLikertSingleImageSrc: '/img.png'
                        }
                    ]
                };

                $compile(element)($scope);

                var scaleQuestionElements = $(element).find('scale-question');
                expect($(scaleQuestionElements).attr('single-img-src')).toBe('/img.png');
            });

            it('should add the left image source for an extremes images scale-question directive', function () {
                $scope.questionnaireData = {
                    structure: [
                        {
                            questionType: 'likert',
                            questionLikertLeftImageSrc: '/left.png'
                        }
                    ]
                };

                $compile(element)($scope);

                var scaleQuestionElements = $(element).find('scale-question');
                expect($(scaleQuestionElements).attr('left-img-src')).toBe('/left.png');
            });

            it('should add the right image source for an extremes images scale-question directive', function () {
                $scope.questionnaireData = {
                    structure: [
                        {
                            questionType: 'likert',
                            questionLikertRightImageSrc: '/right.png'
                        }
                    ]
                };

                $compile(element)($scope);

                var scaleQuestionElements = $(element).find('scale-question');
                expect($(scaleQuestionElements).attr('right-img-src')).toBe('/right.png');
            });

            it('should add the media association attribute for a scale-question directive', function () {
                $scope.questionnaireData = {
                    structure: [
                        {
                            questionType: 'likert',
                            questionIsAssociatedToMedia: true
                        }
                    ]
                };

                $compile(element)($scope);

                var scaleQuestionElements = $(element).find('scale-question');
                expect($(scaleQuestionElements).attr('associated-to-media')).toBe('true');
            });

            it('should add the storage path attribute for a scale-question directive', function () {
                $scope.questionnaireData = {
                    structure: [
                        {
                            questionType: 'likert',
                            questionStoragePath: 'a.b.c.d'
                        }
                    ]
                };

                $compile(element)($scope);

                var scaleQuestionElements = $(element).find('scale-question');
                expect($(scaleQuestionElements).attr('controller-data-path')).toBe('a.b.c.d');
            });

            it('should add the label type attribute for a scale-question directive', function () {
                $scope.questionnaireData = {
                    structure: [
                        {
                            questionType: 'likert',
                            questionStoragePath: 'a.b.c.d',
                            questionLabelType: 'labelLeft'
                        }
                    ]
                };

                $compile(element)($scope);

                var scaleQuestionElements = $(element).find('scale-question');
                expect($(scaleQuestionElements).attr('label-type')).toBe('labelLeft');
            });
        });

        describe('radio-question directives', function () {
            it('should add a radio-question directive for those entries with radio as questionType', function () {
                $scope.questionnaireData = {
                    structure: [
                        {
                            questionType: 'nothing'
                        },
                        {
                            questionType: 'radio'
                        },
                        {
                            questionType: 'likert'
                        },
                        {
                            questionType: 'radio'
                        }
                    ]
                };
                $compile(element)($scope);

                var radioQuestionElements = $(element).find('radio-question');
                expect(radioQuestionElements.length).toBe(2);
            });

            it('should add the question-id for a radio-question directive', function () {
                $scope.questionnaireData = {
                    structure: [
                        {
                            questionType: 'radio',
                            questionId: 'aQuestionId'
                        }
                    ]
                };

                $compile(element)($scope);

                var radioQuestionElements = $(element).find('radio-question');
                expect($(radioQuestionElements[0]).attr('question-id')).toBe('aQuestionId');
            });

            it('should add the title for a radio-question directive', function () {
                $scope.questionnaireData = {
                    structure: [
                        {
                            questionType: 'radio',
                            questionLabel: 'Question Label'
                        }
                    ]
                };

                $compile(element)($scope);

                var radioQuestionElements = $(element).find('radio-question');
                expect($(radioQuestionElements).attr('question-label')).toBe('Question Label');
            });

            it('should add the media association attribute for a radio-question directive', function () {
                $scope.questionnaireData = {
                    structure: [
                        {
                            questionType: 'radio',
                            questionIsAssociatedToMedia: true
                        }
                    ]
                };

                $compile(element)($scope);

                var radioQuestionElements = $(element).find('radio-question');
                expect($(radioQuestionElements).attr('associated-to-media')).toBe('true');
            });

            it('should add the storage path attribute for a radio-question directive', function () {
                $scope.questionnaireData = {
                    structure: [
                        {
                            questionType: 'radio',
                            questionStoragePath: 'a.b.c.d'
                        }
                    ]
                };

                $compile(element)($scope);

                var radioQuestionElements = $(element).find('radio-question');
                expect($(radioQuestionElements).attr('controller-data-path')).toBe('a.b.c.d');
            });

            it('should add the radio options on the data attribute of a radio-question directive', function () {
                $scope.questionnaireData = {
                    structure: [
                        {
                            questionType: 'radio',
                            questionOptions: {
                                choices: [
                                    {
                                        'label': 'Yes',
                                        'value': true
                                    },
                                    {
                                        'label': 'No',
                                        'value': false
                                    }
                                ]
                            }
                        }
                    ]
                };

                $compile(element)($scope);

                var radioQuestionElements = $(element).find('radio-question');
                expect($(radioQuestionElements).data('questionOptions')).toEqual($scope.questionnaireData.structure[0].questionOptions);
            });

            it('should forward the questionRequired property on to the data' +
                ' attribute', function() {

                $scope.questionnaireData = {
                    structure: [
                        {
                            questionType: 'radio',
                            questionRadioOptions: [
                                {
                                    'label': 'Yes',
                                    'value': true
                                },
                                {
                                    'label': 'No',
                                    'value': false
                                }
                            ],
                            questionRequired: 'foo'
                        }
                    ]
                };

                $compile(element)($scope);

                var radioQuestionElement = $(element).find('radio-question');
                expect($(radioQuestionElement)
                    .data('questionRequired'))
                    .toEqual('foo');
            });
        });

        describe('scale-question directives', function () {
            it('should add a scale-question directive for those entries with likert as questionType', function () {
                $scope.questionnaireData = {
                    structure: [
                        {
                            questionType: 'likert'
                        },
                        {
                            questionType: 'radio'
                        },
                        {
                            questionType: 'likert'
                        }
                    ]
                };
                $compile(element)($scope);

                var scaleQuestionElements = $(element).find('scale-question');
                expect(scaleQuestionElements.length).toBe(2);
            });

            it('should add the question-id for a scale-question directive', function () {
                $scope.questionnaireData = {
                    structure: [
                        {
                            questionType: 'likert',
                            questionId: 'aQuestionId'
                        }
                    ]
                };

                $compile(element)($scope);

                var scaleQuestionElements = $(element).find('scale-question');
                expect($(scaleQuestionElements[0]).attr('question-id')).toBe('aQuestionId');
            });

            it('should add the title for a scale-question directive', function () {
                $scope.questionnaireData = {
                    structure: [
                        {
                            questionType: 'likert',
                            questionLabel: 'Question Label'
                        }
                    ]
                };

                $compile(element)($scope);

                var scaleQuestionElements = $(element).find('scale-question');
                expect($(scaleQuestionElements).attr('question-label')).toBe('Question Label');
            });

            it('should add the minimum description for a scale-question directive', function () {
                $scope.questionnaireData = {
                    structure: [
                        {
                            questionType: 'likert',
                            questionLikertMinimumDescription: 'Minimum Description'
                        }
                    ]
                };

                $compile(element)($scope);

                var scaleQuestionElements = $(element).find('scale-question');
                expect($(scaleQuestionElements).attr('minimum-description')).toBe('Minimum Description');
            });

            it('should add the maximum description for a scale-question directive', function () {
                $scope.questionnaireData = {
                    structure: [
                        {
                            questionType: 'likert',
                            questionLikertMaximumDescription: 'Maximum Description'
                        }
                    ]
                };

                $compile(element)($scope);

                var scaleQuestionElements = $(element).find('scale-question');
                expect($(scaleQuestionElements).attr('maximum-description')).toBe('Maximum Description');
            });

            it('should add the image source for a single image scale-question directive', function () {
                $scope.questionnaireData = {
                    structure: [
                        {
                            questionType: 'likert',
                            questionLikertSingleImageSrc: '/img.png'
                        }
                    ]
                };

                $compile(element)($scope);

                var scaleQuestionElements = $(element).find('scale-question');
                expect($(scaleQuestionElements).attr('single-img-src')).toBe('/img.png');
            });

            it('should add the left image source for an extremes images scale-question directive', function () {
                $scope.questionnaireData = {
                    structure: [
                        {
                            questionType: 'likert',
                            questionLikertLeftImageSrc: '/left.png'
                        }
                    ]
                };

                $compile(element)($scope);

                var scaleQuestionElements = $(element).find('scale-question');
                expect($(scaleQuestionElements).attr('left-img-src')).toBe('/left.png');
            });

            it('should add the right image source for an extremes images scale-question directive', function () {
                $scope.questionnaireData = {
                    structure: [
                        {
                            questionType: 'likert',
                            questionLikertRightImageSrc: '/right.png'
                        }
                    ]
                };

                $compile(element)($scope);

                var scaleQuestionElements = $(element).find('scale-question');
                expect($(scaleQuestionElements).attr('right-img-src')).toBe('/right.png');
            });

            it('should add the media association attribute for a scale-question directive', function () {
                $scope.questionnaireData = {
                    structure: [
                        {
                            questionType: 'likert',
                            questionIsAssociatedToMedia: true
                        }
                    ]
                };

                $compile(element)($scope);

                var scaleQuestionElements = $(element).find('scale-question');
                expect($(scaleQuestionElements).attr('associated-to-media')).toBe('true');
            });

            it('should add the storage path attribute for a scale-question directive', function () {
                $scope.questionnaireData = {
                    structure: [
                        {
                            questionType: 'likert',
                            questionStoragePath: 'a.b.c.d'
                        }
                    ]
                };

                $compile(element)($scope);

                var scaleQuestionElements = $(element).find('scale-question');
                expect($(scaleQuestionElements).attr('controller-data-path')).toBe('a.b.c.d');
            });

            it('should add question options on the data attribute of a scale-question directive', function () {
                $scope.questionnaireData = {
                    structure: [
                        {
                            questionType: 'likert',
                            questionOptions: {
                                choices: [
                                    {
                                        label: 'Disagree strongly'
                                    },
                                    {
                                        label: 'Disagree a little'
                                    },
                                    {
                                        label: 'Neither agree nor disagree'
                                    },
                                    {
                                        label: 'Agree a little'
                                    },
                                    {
                                        label: 'Agree strongly'
                                    }
                                ]
                            }
                        }
                    ]
                };

                $compile(element)($scope);

                var scaleQuestionElement= $(element).find('scale-question');
                expect($(scaleQuestionElement).data('questionOptions')).toEqual($scope.questionnaireData.structure[0].questionOptions);
            });

            it('should forward the questionRequired property on to the data' +
                ' attribute', function() {

                $scope.questionnaireData = {
                    structure: [
                        {
                            questionType: 'likert',
                            questionOptions: {
                                choices: [
                                    {
                                        label: 'Disagree strongly'
                                    },
                                    {
                                        label: 'Disagree a little'
                                    },
                                    {
                                        label: 'Neither agree nor disagree'
                                    },
                                    {
                                        label: 'Agree a little'
                                    },
                                    {
                                        label: 'Agree strongly'
                                    }
                                ]
                            },
                            questionRequired: 'foo'
                        }
                    ]
                };

                $compile(element)($scope);

                var scaleQuestionElement= $(element).find('scale-question');
                expect(scaleQuestionElement.data('questionRequired'))
                    .toEqual('foo');
            });
        });

        describe('dropdown-question directives', function () {
            it('should add a dropdown-question directive for those entries with radio as questionType', function () {
                $scope.questionnaireData = {
                    structure: [
                        {
                            questionType: 'radio'
                        },
                        {
                            questionType: 'dropdown'
                        },
                        {
                            questionType: 'likert'
                        },
                        {
                            questionType: 'dropdown'
                        }
                    ]
                };
                $compile(element)($scope);

                var radioQuestionElements = $(element).find('dropdown-question');
                expect(radioQuestionElements.length).toBe(2);
            });

            it('should add the question-id for a radio-question directive', function () {
                $scope.questionnaireData = {
                    structure: [
                        {
                            questionType: 'dropdown',
                            questionId: 'nationality'
                        }
                    ]
                };

                $compile(element)($scope);

                var radioQuestionElements = $(element).find('dropdown-question');
                expect($(radioQuestionElements[0]).attr('question-id')).toBe('nationality');
            });

            it('should add the title for a dropdown-question directive', function () {
                $scope.questionnaireData = {
                    structure: [
                        {
                            questionType: 'dropdown',
                            questionLabel: 'Question Label'
                        }
                    ]
                };

                $compile(element)($scope);

                var radioQuestionElements = $(element).find('dropdown-question');
                expect($(radioQuestionElements).attr('question-label')).toBe('Question Label');
            });

            it('should add the media association attribute for a dropdown-question directive', function () {
                $scope.questionnaireData = {
                    structure: [
                        {
                            questionType: 'dropdown',
                            questionIsAssociatedToMedia: true
                        }
                    ]
                };

                $compile(element)($scope);

                var radioQuestionElements = $(element).find('dropdown-question');
                expect($(radioQuestionElements).attr('associated-to-media')).toBe('true');
            });

            it('should add the storage path attribute for a dropdown-question directive', function () {
                $scope.questionnaireData = {
                    structure: [
                        {
                            questionType: 'dropdown',
                            questionStoragePath: 'a.b.c.d'
                        }
                    ]
                };

                $compile(element)($scope);

                var radioQuestionElements = $(element).find('dropdown-question');
                expect($(radioQuestionElements).attr('controller-data-path')).toBe('a.b.c.d');
            });

            it('should add the dropdown options to the data of a' +
                ' dropdown-question directive', function () {
                $scope.questionnaireData = {
                    structure: [
                        {
                            questionType: 'dropdown',
                            questionOptions: ['a', 'b', 'c', 'd']
                        }
                    ]
                };

                $compile(element)($scope);

                var radioQuestionElements = $(element).find('dropdown-question');
                expect($(radioQuestionElements).data('dropdownOptions')).toEqual($scope.questionnaireData.structure[0].questionDropdownOptions);
            });

            it('should forward the questionRequired property on to the data' +
                ' attribute', function() {

                $scope.questionnaireData = {
                    structure: [
                        {
                            questionType: 'dropdown',
                            questionOptions: ['a', 'b', 'c', 'd'],
                            questionRequired: 'foo'
                        }
                    ]
                };

                $compile(element)($scope);

                var dropdownElement = $(element).find('dropdown-question');
                expect($(dropdownElement)
                    .data('questionRequired'))
                    .toEqual('foo');
            });
        });

        describe('checkbox-question directives', function () {
            it('should add a checkbox-question directive for those entries with checkbox as questionType', function () {
                $scope.questionnaireData = {
                    structure: [
                        {
                            questionType: 'radio'
                        },
                        {
                            questionType: 'checkbox'
                        },
                        {
                            questionType: 'likert'
                        },
                        {
                            questionType: 'checkbox'
                        }
                    ]
                };
                $compile(element)($scope);

                var checkboxQuestionElements = $(element).find('checkbox-question');
                expect(checkboxQuestionElements.length).toBe(2);
            });

            it('should add the question-id for a checkbox-question directive', function () {
                $scope.questionnaireData = {
                    structure: [
                        {
                            questionType: 'checkbox',
                            questionId: 'musicStyles'
                        }
                    ]
                };

                $compile(element)($scope);

                var checkboxQuestionElements = $(element).find('checkbox-question');
                expect($(checkboxQuestionElements[0]).attr('question-id')).toBe('musicStyles');
            });

            it('should add the title for a checkbox-question directive', function () {
                $scope.questionnaireData = {
                    structure: [
                        {
                            questionType: 'checkbox',
                            questionLabel: 'Question Label'
                        }
                    ]
                };

                $compile(element)($scope);

                var checkboxQuestionElements = $(element).find('checkbox-question');
                expect($(checkboxQuestionElements).attr('question-label')).toBe('Question Label');
            });

            it('should add the media association attribute for a checkbox-question directive', function () {
                $scope.questionnaireData = {
                    structure: [
                        {
                            questionType: 'checkbox',
                            questionIsAssociatedToMedia: true
                        }
                    ]
                };

                $compile(element)($scope);

                var checkboxQuestionElements = $(element).find('checkbox-question');
                expect($(checkboxQuestionElements).attr('associated-to-media')).toBe('true');
            });

            it('should add the storage path attribute for a checkbox-question directive', function () {
                $scope.questionnaireData = {
                    structure: [
                        {
                            questionType: 'checkbox',
                            questionStoragePath: 'a.b.c.d'
                        }
                    ]
                };

                $compile(element)($scope);

                var checkboxQuestionElements = $(element).find('checkbox-question');
                expect($(checkboxQuestionElements).attr('controller-data-path')).toBe('a.b.c.d');
            });

            it('should add the checkbox options on the data attribute of a checkbox-question directive', function () {
                $scope.questionnaireData = {
                    structure: [
                        {
                            questionType: 'checkbox',
                            questionOptions: { choices: [
                                {label: 'Rock', value: 'Rock'},
                                {label: 'Pop', value: 'Pop'},
                                {label: 'Folk', value: 'Folk'}
                            ]}
                        }
                    ]
                };

                $compile(element)($scope);

                var checkboxQuestionElements = $(element).find('checkbox-question');
                expect($(checkboxQuestionElements).data('checkboxOptions')).toEqual($scope.questionnaireData.structure[0].questionCheckboxOptions);
            });

            it('should add the question-required attribute for a checkbox-question directive if it is required', function () {
                $scope.questionnaireData = {
                    structure: [
                        {
                            questionType: 'checkbox',
                            questionRequired: true
                        }
                    ]
                };

                $compile(element)($scope);

                var checkboxQuestionElements = $(element).find('checkbox-question');
                expect($(checkboxQuestionElements).attr('question-required')).toBe('true');
            });

            it('should not add the question-required attribute for a checkbox-question directive if it is not required', function () {
                $scope.questionnaireData = {
                    structure: [
                        {
                            questionType: 'checkbox',
                            questionRequired: false
                        }
                    ]
                };

                $compile(element)($scope);

                var checkboxQuestionElements = $(element).find('checkbox-question');
                expect($(checkboxQuestionElements).attr('question-required')).toBe(undefined);
            });

            it('should default to setting the question-required attribute for a checkbox-question directive if it is not defined', function () {
                $scope.questionnaireData = {
                    structure: [
                        {
                            questionType: 'checkbox',
                        }
                    ]
                };

                $compile(element)($scope);

                var checkboxQuestionElements = $(element).find('checkbox-question');
                expect($(checkboxQuestionElements).attr('question-required')).toBe('true');
            });
        });
    });
})();
'use strict';

(function() {
    describe('questionnaire directive', function() {

        //Initialize global variables
        var $scope, $compile, element;

        // Load the main application module
        beforeEach(module(ApplicationConfiguration.applicationModuleName));

        beforeEach(inject(function(_$rootScope_, _$compile_) {
            $scope = _$rootScope_.$new();
            $compile = _$compile_;
            element = angular.element('<questionnaire questionnaire-data="questionnaireData"></questionnaire>');
        }));
        
        it('should add a header for the page title', function() {
            $scope.questionnaireData = {
                title: 'Media Questions',
                structure: []
            };
            $compile(element)($scope);

            expect(element.html()).toMatch(/<h1>Media Questions<\/h1>/);
        });

        it('should add a form with name questionnaireForm to the page', function() {
            $scope.questionnaireData = {
                title: 'Media Questions',
                structure: []
            };
            $compile(element)($scope);

            var formElements = $(element).find('form.form[name="questionnaireForm"][novalidate=""]');
            expect(formElements.length).toBe(1);
        });

        describe('question-scale directives', function() {
            it('should add a question-scale directive for those entries with likert as questionType', function() {
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

                var questionScaleElements = $(element).find('scale-question');
                expect(questionScaleElements.length).toBe(2);
            });

            it('should add the title for a question-scale directive', function() {
                $scope.questionnaireData = {
                    structure: [
                        {
                            questionType: 'likert',
                            questionLabel: 'Question Label'
                        }
                    ]
                };

                $compile(element)($scope);

                var questionScaleElements = $(element).find('scale-question');
                expect($(questionScaleElements).attr('question-label')).toBe('Question Label');
            });

            it('should add the minimum description for a question-scale directive', function() {
                $scope.questionnaireData = {
                    structure: [
                        {
                            questionType: 'likert',
                            questionLikertMinimumDescription: 'Minimum Description'
                        }
                    ]
                };

                $compile(element)($scope);

                var questionScaleElements = $(element).find('scale-question');
                expect($(questionScaleElements).attr('minimum-description')).toBe('Minimum Description');
            });

            it('should add the maximum description for a question-scale directive', function() {
                $scope.questionnaireData = {
                    structure: [
                        {
                            questionType: 'likert',
                            questionLikertMaximumDescription: 'Maximum Description'
                        }
                    ]
                };

                $compile(element)($scope);

                var questionScaleElements = $(element).find('scale-question');
                expect($(questionScaleElements).attr('maximum-description')).toBe('Maximum Description');
            });

            it('should add the image source for a single image question-scale directive', function() {
                $scope.questionnaireData = {
                    structure: [
                        {
                            questionType: 'likert',
                            questionLikertSingleImageSrc: '/img.png'
                        }
                    ]
                };

                $compile(element)($scope);

                var questionScaleElements = $(element).find('scale-question');
                expect($(questionScaleElements).attr('single-img-src')).toBe('/img.png');
            });

            it('should add the left image source for an extremes images question-scale directive', function() {
                $scope.questionnaireData = {
                    structure: [
                        {
                            questionType: 'likert',
                            questionLikertLeftImageSrc: '/left.png'
                        }
                    ]
                };

                $compile(element)($scope);

                var questionScaleElements = $(element).find('scale-question');
                expect($(questionScaleElements).attr('left-img-src')).toBe('/left.png');
            });

            it('should add the right image source for an extremes images question-scale directive', function() {
                $scope.questionnaireData = {
                    structure: [
                        {
                            questionType: 'likert',
                            questionLikertRightImageSrc: '/right.png'
                        }
                    ]
                };

                $compile(element)($scope);

                var questionScaleElements = $(element).find('scale-question');
                expect($(questionScaleElements).attr('right-img-src')).toBe('/right.png');
            });

            it('should add the media association attribute for a question-scale directive', function() {
                $scope.questionnaireData = {
                    structure: [
                        {
                            questionType: 'likert',
                            questionIsAssociatedToMedia: true
                        }
                    ]
                };

                $compile(element)($scope);

                var questionScaleElements = $(element).find('scale-question');
                expect($(questionScaleElements).attr('associated-to-media')).toBe('true');
            });

            it('should add the storage path attribute for a question-scale directive', function() {
                $scope.questionnaireData = {
                    structure: [
                        {
                            questionType: 'likert',
                            questionStoragePath: 'a.b.c.d'
                        }
                    ]
                };

                $compile(element)($scope);

                var questionScaleElements = $(element).find('scale-question');
                expect($(questionScaleElements).attr('controller-data-path')).toBe('a.b.c.d');
            });

            it('should add a spacer after the descriptions', function() {
                $scope.questionnaireData = {
                    structure: [
                        {
                            questionType: 'likert',
                        }
                    ]
                };

                $compile(element)($scope);

                var questionScaleElements = $(element).find('scale-question');
                var spacerDiv = $(questionScaleElements).next().children()[0];
                expect($(spacerDiv).hasClass('questionSpacer')).toBe(true);
            });
        });
    });
})();
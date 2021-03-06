'use strict';

(function() {
    describe('dropdown-question directive', function() {

        //Initialize global variables
        var $scope, $compile, element, TrialData;

        // Load the main application module
        beforeEach(module(ApplicationConfiguration.applicationModuleName));

        beforeEach(inject(function(_$rootScope_, _$compile_, _TrialData_, _$httpBackend_) {
            $scope = _$rootScope_.$new();
            $compile = _$compile_;
            TrialData = _TrialData_;

            _$httpBackend_.whenGET('/api/config').respond();
        }));

        it('should add a label for the question text', function() {
            element = angular.element('<dropdown-question question-label="Nationality" question-id="nationality"></radio-question>');
            $compile(element)($scope);
            var labelElement = $(element).find('label');
            $scope.$digest();

            expect(labelElement.text()).toBe('Nationality');
            expect(labelElement.attr('for')).toBe('nationality');
            expect(labelElement.hasClass('control-label')).toBe(true);
        });

        describe('dropdown options', function() {
            it('should add a select element with associated options', function() {
                var options = {
                    choices: ['a','b','c']
                };
                element = angular.element('<dropdown-question question-id="nationality"></dropdown-question>');
                element.data('questionOptions', options);
                $compile(element)($scope);
                $scope.$digest();
                var selectChildren = $(element).find('select').children();
                expect(selectChildren.length).toBe(options.choices.length + 1);
            });

            it('should associate the select element with the correct model', function() {
                var options = {
                    choices: ['a','b','c']
                };
                element = angular.element('<dropdown-question question-id="nationality"></dropdown-question>');
                element.data('questionOptions', options);
                $compile(element)($scope);
                $scope.$digest();
                var select = $(element).find('select');
                expect(select.attr('ng-model')).toBe('nationalitySelect');
            });

            it('should give the select element the form-group class', function() {
                var options = {
                    choices: ['a','b','c']
                };
                element = angular.element('<dropdown-question question-id="nationality"></dropdown-question>');
                element.data('questionOptions', options);
                $compile(element)($scope);
                $scope.$digest();
                var select = $(element).find('select');
                expect(select.hasClass('form-control')).toBe(true);
            });

            it('should give the select element the correct id', function() {
                var options = {
                    choices: ['a','b','c']
                };
                element = angular.element('<dropdown-question question-id="nationality"></dropdown-question>');
                element.data('questionOptions', options);
                $compile(element)($scope);
                $scope.$digest();
                var select = $(element).find('select');
                expect(select.attr('id')).toBe('nationality');
            });

            it('should give the select element the correct name', function() {
                var options = {
                    choices: ['a','b','c']
                };
                element = angular.element('<dropdown-question question-id="nationality"></dropdown-question>');
                element.data('questionOptions', options);
                $compile(element)($scope);
                $scope.$digest();
                var select = $(element).find('select');
                expect(select.attr('name')).toBe('nationality');
            });

            it('should wrap the select in a div.form-group', function() {
                var options = {
                    choices: ['a','b','c']
                };
                element = angular.element('<dropdown-question question-id="nationality"></dropdown-question>');
                element.data('questionOptions', options);
                $compile(element)($scope);
                $scope.$digest();
                var selectParent = $(element).find('select').parent();
                expect(selectParent.hasClass('form-group')).toBe(true);
            });

            describe('should mark the element', function() {

                var options = {
                    choices: ['a','b','c']
                };
                var element;

                beforeEach(function() {
                    element = angular.element('<dropdown-question' +
                        ' question-id="nationality"></dropdown-question>');
                    element.data('questionOptions', options);
                });

                it('as required by default', function() {
                    $compile(element)($scope);
                    $scope.$digest();
                    var select = $(element).find('select');
                    expect(select.prop('required')).toBe(true);
                });

                it('as required when explicitly specified', function() {
                    element.data('questionRequired', true);
                    $compile(element)($scope);
                    $scope.$digest();
                    var select = $(element).find('select');
                    expect(select.prop('required')).toBe(true);
                });

                it('as not required when explicitly specified', function() {
                    element.data('questionRequired', false);
                    $compile(element)($scope);
                    $scope.$digest();
                    var select = $(element).find('select');
                    expect(select.prop('required')).toBe(false);
                });
            });
        });

        describe('data binding', function() {
            it('should call TrialData with the correct data when an option is selected', function() {
                var options = {
                    choices: ['a','b','c']
                };
                element = angular.element('<dropdown-question question-id="nationality" controller-data-path="data.answers.nationality"></dropdown-question>');
                element.data('questionOptions', options);
                $compile(element)($scope);
                $scope.$digest();

                spyOn(TrialData, 'setValueForPath');

                var select = element.find('select');
                select.scope().nationalitySelect = 'foo';
                select.scope().$apply();

                expect(TrialData.setValueForPath.calls.count()).toBe(1);
                expect(TrialData.setValueForPath.calls.argsFor(0)[0]).toBe('data.answers.nationality');
                expect(TrialData.setValueForPath.calls.argsFor(0)[1]).toBe('foo');
            });

            it('should call TrialData with the correct data when an option is selected and the question is associated to media', function() {
                var options = {
                    choices: ['a','b','c']
                };
                element = angular.element('<dropdown-question question-id="nationality" controller-data-path="data.answers.ratings.nationality" associated-to-media="true"></dropdown-question>');
                element.data('questionOptions', options);
                $compile(element)($scope);
                $scope.$digest();

                TrialData.data.state.mediaPlayCount = 2;
                spyOn(TrialData, 'setValueForPathForCurrentMedia');

                var select = element.find('select');
                select.scope().nationalitySelect = 'foo';
                select.scope().$apply();

                expect(TrialData.setValueForPathForCurrentMedia.calls.count()).toBe(1);
                expect(TrialData.setValueForPathForCurrentMedia.calls.argsFor(0)[0]).toBe('data.answers.ratings.nationality');
                expect(TrialData.setValueForPathForCurrentMedia.calls.argsFor(0)[1]).toBe('foo');
            });
        });
    });
})();
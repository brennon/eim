'use strict';

(function() {
    describe('radio-question directive', function() {

        //Initialize global variables
        var $scope, $compile, element, TrialData;

        // Load the main application module
        beforeEach(module(ApplicationConfiguration.applicationModuleName));

        beforeEach(inject(function(_$rootScope_, _$compile_, _TrialData_) {
            $scope = _$rootScope_;
            $compile = _$compile_;
            TrialData = _TrialData_;
        }));

        it('should create a row for the element', function() {
            element = angular.element('<radio-question question-label="qText" question-id="gender"></radio-question>');
            $compile(element)($scope);
            var firstChild = $(element).children()[0];
            firstChild = $(firstChild);
            expect(firstChild.hasClass('row')).toBe(true);
        });

        it('should create a column set / form group for the contents', function() {
            element = angular.element('<radio-question question-label="qText" question-id="gender"></radio-question>');
            $compile(element)($scope);
            var grandchild = $($(element).children()[0]).children()[0];
            grandchild = $(grandchild);
            expect(grandchild.hasClass('col-md-12')).toBe(true);
        });

        it('should add a label for the question text as the first child of the column group', function() {
            element = angular.element('<radio-question question-label="qText" question-id="gender"></radio-question>');
            $compile(element)($scope);
            var greatGrandchild = $($($(element).children()[0]).children()[0]).children()[0];
            greatGrandchild = $(greatGrandchild);
            $scope.$digest();

            expect(greatGrandchild.text()).toBe('qText');
            expect(greatGrandchild.attr('for')).toBe('genderRadio');
            expect(greatGrandchild.hasClass('control-label')).toBe(false);
        });

        describe('radio buttons', function() {
            it('should add a button for each option and wrap each in a label', function() {
                var options = [{ label: 'Yes', value: true }, { label: 'No', value: false }];
                element = angular.element('<radio-question question-label="Gender" question-id="gender"></radio-question>');
                element.data('radioOptions', options);
                $compile(element)($scope);

                var radios = $(element).find('input[type="radio"]');
                expect(radios.length).toBe(2);

                for (var i = 0; i < radios.length; i++) {
                    var radio = radios[i];
                    var parent = $(radio).parent();
                    expect(parent.hasClass('radio-inline')).toBe(true);
                }
            });

            it('should set the correct name on each button', function() {
                var options = [{ label: 'Yes', value: true }, { label: 'No', value: false }];
                element = angular.element('<radio-question question-id="gender"></radio-question>');
                element.data('radioOptions', options);
                $compile(element)($scope);
                var radios = $(element).find('input[type="radio"]');
                for (var i = 0; i < radios.length; i++) {
                    var obj = radios[i];
                    expect($(obj).attr('name')).toBe('genderRadioGroup');
                }
            });

            it('should set the correct id on each button', function() {
                var options = [{ label: 'Yes', value: true }, { label: 'No', value: false }];
                element = angular.element('<radio-question question-id="gender"></radio-question>');
                element.data('radioOptions', options);
                $compile(element)($scope);
                var radios = $(element).find('input[type="radio"]');
                expect(radios[0].id).toBe('genderRadioYes');
                expect(radios[1].id).toBe('genderRadioNo');
            });

            it('should set the correct value on each button', function() {
                var options = [{ label: 'Yes', value: true }, { label: 'No', value: false }];
                element = angular.element('<radio-question question-id="gender"></radio-question>');
                element.data('radioOptions', options);
                $compile(element)($scope);
                var radios = $(element).find('input[type="radio"]');
                expect(radios[0].value).toBe('true');
                expect(radios[1].value).toBe('false');
            });

            it('should set the required attribute on each button', function() {
                var options = [{ label: 'Yes', value: true }, { label: 'No', value: false }];
                element = angular.element('<radio-question question-id="gender"></radio-question>');
                element.data('radioOptions', options);
                $compile(element)($scope);
                var radios = $(element).find('input[type="radio"]');
                for (var i = 0; i < radios.length; i++) {
                    var obj = radios[i];
                    expect(obj.required).toBe(true);
                }
            });

            it('should set the correct model on each radio button', function() {
                var options = [{ label: 'Yes', value: true }, { label: 'No', value: false }];
                element = angular.element('<radio-question question-id="gender"></radio-question>');
                element.data('radioOptions', options);
                $compile(element)($scope);
                var inputs = $(element).find('input[type="radio"][name="genderRadioGroup"]');
                for (var i = 0; i < inputs.length; i++) {
                    expect($(inputs[i]).attr('ng-model')).toBe('genderRadioGroup');
                }
            });

            it('should wrap each button with a label', function() {
                var options = [{ label: 'Yes', value: true }, { label: 'No', value: false }];
                element = angular.element('<radio-question question-id="gender"></radio-question>');
                element.data('radioOptions', options);
                $compile(element)($scope);
                $scope.$digest();

                var radios = $(element).find('input[type="radio"]');
                for (var i = 0; i < radios.length; i++) {
                    var obj = radios[i];
                    var parent = $(obj).parent('label');
                    expect(parent.length).toBe(1);
                    expect(parent.text()).toBe(options[i].label);
                    expect(parent.hasClass('radio-inline')).toBe(true);
                }
            });
        });

        describe('data binding', function() {
            it('should call TrialData with the correct data when an option is selected', function() {
                var options = [{ label: 'foo', value: 'bar' }, { label: 'bit', value: 'baz' }];
                element = angular.element('<radio-question question-id="gender" controller-data-path="data.answers.gender"></radio-question>');
                element.data('radioOptions', options);
                $compile(element)($scope);
                var inputs = $(element).find('input[type="radio"]');
                var secondInput = $(inputs[1]);

                spyOn(TrialData, 'setValueForPath');

                secondInput.scope().genderRadioGroup = 'foobar';
                secondInput.scope().$apply();

                expect(TrialData.setValueForPath.calls.count()).toBe(1);
                expect(TrialData.setValueForPath.calls.argsFor(0)[0]).toBe('data.answers.gender');
                expect(TrialData.setValueForPath.calls.argsFor(0)[1]).toBe('foobar');
            });

            it('should call TrialData with the correct data when an option is selected and the question is associated to media', function() {
                var options = [{ label: 'foo', value: 'bar' }, { label: 'bit', value: 'baz' }];
                element = angular.element('<radio-question question-id="gender" controller-data-path="data.answers.gender" associated-to-media="true"></radio-question>');
                element.data('radioOptions', options);
                $compile(element)($scope);
                var inputs = $(element).find('input[type="radio"]');
                var secondInput = $(inputs[1]);

                TrialData.data.state.mediaPlayCount = 2;
                spyOn(TrialData, 'setValueForPathForCurrentMedia');

                secondInput.scope().genderRadioGroup = 'foobar';
                secondInput.scope().$apply();

                expect(TrialData.setValueForPathForCurrentMedia.calls.count()).toBe(1);
                expect(TrialData.setValueForPathForCurrentMedia.calls.argsFor(0)[0]).toBe('data.answers.gender');
                expect(TrialData.setValueForPathForCurrentMedia.calls.argsFor(0)[1]).toBe('foobar');
            });

            it('should convert true strings to literals', function() {
                var options = [{ label: 'foo', value: 'bar' }, { label: 'bit', value: 'baz' }];
                element = angular.element('<radio-question question-id="gender" controller-data-path="data.answers.gender"></radio-question>');
                element.data('radioOptions', options);
                $compile(element)($scope);
                var inputs = $(element).find('input[type="radio"]');
                var secondInput = $(inputs[1]);

                spyOn(TrialData, 'setValueForPath');

                secondInput.scope().genderRadioGroup = 'true';
                secondInput.scope().$apply();

                expect(TrialData.setValueForPath.calls.count()).toBe(1);
                expect(TrialData.setValueForPath.calls.argsFor(0)[0]).toBe('data.answers.gender');
                expect(TrialData.setValueForPath.calls.argsFor(0)[1]).toBe(true);
            });

            it('should convert false strings to literals', function() {
                var options = [{ label: 'foo', value: 'bar' }, { label: 'bit', value: 'baz' }];
                element = angular.element('<radio-question question-id="gender" controller-data-path="data.answers.gender"></radio-question>');
                element.data('radioOptions', options);
                $compile(element)($scope);
                var inputs = $(element).find('input[type="radio"]');
                var secondInput = $(inputs[1]);

                spyOn(TrialData, 'setValueForPath');

                secondInput.scope().genderRadioGroup = 'false';
                secondInput.scope().$apply();

                expect(TrialData.setValueForPath.calls.count()).toBe(1);
                expect(TrialData.setValueForPath.calls.argsFor(0)[0]).toBe('data.answers.gender');
                expect(TrialData.setValueForPath.calls.argsFor(0)[1]).toBe(false);
            });
        });
    });
})();
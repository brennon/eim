'use strict';

(function() {
    describe('checkbox-question directive', function() {

        //Initialize global variables
        var $scope, $compile, element, TrialData;

        // Load the main application module
        beforeEach(module(ApplicationConfiguration.applicationModuleName));

        beforeEach(inject(function(_$rootScope_, _$compile_, _TrialData_) {
            $scope = _$rootScope_.$new();
            $compile = _$compile_;
            TrialData = _TrialData_;
        }));

        it('should add a label for the question text', function() {
            element = angular.element('<checkbox-question question-label="Music Styles" question-id="musicStyles"></checkbox-question>');
            $compile(element)($scope);
            var labelElement = $(element).find('label');
            $scope.$digest();


            expect(labelElement.text()).toBe('Music Styles');
            expect(labelElement.attr('for')).toBe('musicStylesCheckbox');
        });

        it('should add a row and column div for the contents', function() {
            element = angular.element('<checkbox-question question-label="Music Styles" question-id="musicStyles"></checkbox-question>');
            $compile(element)($scope);

            element = $(element);
            var rowDiv = $(element.children()[0]);
            var colDiv = $(rowDiv.children()[0]);

            expect(rowDiv.prop('tagName')).toBe('DIV');
            expect(rowDiv.hasClass('row')).toBe(true);
            expect(colDiv.prop('tagName')).toBe('DIV');
            expect(colDiv.hasClass('col-md-12')).toBe(true);
        });

        describe('checkboxes', function() {
            it('should add a checkbox for each option', function() {
                var options = ['Rock', 'Pop', 'Folk'];
                element = angular.element('<checkbox-question question-label="Music Styles" question-id="musicStyles"></checkbox-question>');
                element.data('checkboxOptions', options);
                $compile(element)($scope);

                var checkboxes = element.find('input[type="checkbox"]');
                expect(checkboxes.length).toBe(options.length);
                for (var i = 0; i < checkboxes.length; i++) {
                    var checkbox = checkboxes[i];
                    expect(checkbox.value).toBe(options[i]);
                    expect(checkbox.id).toBe('musicStylesCheckbox' + options[i]);
                    expect(checkbox.name).toBe('musicStylesCheckbox');
                    expect($(checkbox).attr('checked')).toBeUndefined();
                }
            });

            it('should wrap each checkbox with a label', function() {
                var options = ['Rock', 'Pop', 'Folk'];
                element = angular.element('<checkbox-question question-label="Music Styles" question-id="musicStyles"></checkbox-question>');
                element.data('checkboxOptions', options);
                $compile(element)($scope);
                $scope.$digest();

                var checkboxes = element.find('input[type="checkbox"]');
                for (var i = 0; i < checkboxes.length; i++) {
                    var checkbox = $(checkboxes[i]);
                    var label = $(checkbox.parent());

                    expect(label.prop('tagName')).toBe('LABEL');
                    expect(label.text()).toBe(options[i]);
                    expect(label.hasClass('checkbox-inline')).toBe(true);
                }
            });

            it('should set the correct ng-model for each checkbox', function() {
                var options = ['Rock', 'Pop', 'Folk'];
                element = angular.element('<checkbox-question question-label="Music Styles" question-id="musicStyles"></checkbox-question>');
                element.data('checkboxOptions', options);
                $compile(element)($scope);

                var checkboxes = element.find('input[type="checkbox"]');
                for (var i = 0; i < checkboxes.length; i++) {
                    var checkbox = $(checkboxes[i]);
                    expect(checkbox.attr('ng-model')).toBe('musicStylesCheckbox' + options[i]);
                }
            });

            it('should set the correct ng-change for each checkbox', function() {
                var options = ['Rock', 'Pop', 'Folk'];
                element = angular.element('<checkbox-question question-label="Music Styles" question-id="musicStyles"></checkbox-question>');
                element.data('checkboxOptions', options);
                $compile(element)($scope);

                var checkboxes = element.find('input[type="checkbox"]');
                for (var i = 0; i < checkboxes.length; i++) {
                    var checkbox = $(checkboxes[i]);
                    expect(checkbox.attr('ng-change')).toBe('updateCheckboxes()');
                }
            });

            it('should bind ng-required to someSelected if question is required', function() {
                var options = ['Rock', 'Pop', 'Folk'];
                element = angular.element('<checkbox-question question-label="Music Styles" question-id="musicStyles" question-required="true"></checkbox-question>');
                element.data('checkboxOptions', options);
                $compile(element)($scope);

                var checkboxes = element.find('input[type="checkbox"]');
                for (var i = 0; i < checkboxes.length; i++) {
                    var checkbox = $(checkboxes[i]);
                    expect(checkbox.attr('ng-required')).toBe('!someSelected');
                }
            });

            it('should only bind ng-required to someSelected question-required is present', function() {
                var options = ['Rock', 'Pop', 'Folk'];
                element = angular.element('<checkbox-question question-label="Music Styles" question-id="musicStyles"></checkbox-question>');
                element.data('checkboxOptions', options);
                $compile(element)($scope);

                var checkboxes = element.find('input[type="checkbox"]');
                for (var i = 0; i < checkboxes.length; i++) {
                    var checkbox = $(checkboxes[i]);
                    expect(checkbox.attr('ng-required')).toBe(undefined);
                }
            });
        });

        describe('#updateCheckboxes', function() {
            it('should send the correct values to #sendToTrialData', function() {
                var options = ['Rock', 'Pop', 'Folk'];
                element = angular.element('<checkbox-question question-label="Music Styles" question-id="musicStyles"></checkbox-question>');
                element.data('checkboxOptions', options);
                $compile(element)($scope);

                element.isolateScope().musicStylesCheckboxRock = false;
                element.isolateScope().musicStylesCheckboxPop = true;
                element.isolateScope().musicStylesCheckboxFolk = true;

                element.isolateScope().$digest();

                spyOn(element.isolateScope(), 'sendToTrialData');
                element.isolateScope().updateCheckboxes();

                var calls = element.isolateScope().sendToTrialData.calls;

                expect(calls.count()).toBe(1);
                expect(calls.argsFor(0)[1]).toEqual(['folk', 'pop']);
            });

            it('should set someSelected to true if some boxes are checked', function() {
                var options = ['Rock', 'Pop', 'Folk'];
                element = angular.element('<checkbox-question question-label="Music Styles" question-id="musicStyles"></checkbox-question>');
                element.data('checkboxOptions', options);
                $compile(element)($scope);

                element.isolateScope().someSelected = false;

                element.isolateScope().musicStylesCheckboxRock = true;
                element.isolateScope().musicStylesCheckboxPop = true;
                element.isolateScope().musicStylesCheckboxFolk = true;

                element.isolateScope().$digest();

                element.isolateScope().updateCheckboxes();

                expect(element.isolateScope().someSelected).toBe(true);
            });

            it('should set someSelected to false if no boxes are checked', function() {
                var options = ['Rock', 'Pop', 'Folk'];
                element = angular.element('<checkbox-question question-label="Music Styles" question-id="musicStyles"></checkbox-question>');
                element.data('checkboxOptions', options);
                $compile(element)($scope);

                element.isolateScope().someSelected = true;

                element.isolateScope().musicStylesCheckboxRock = false;
                element.isolateScope().musicStylesCheckboxPop = false;
                element.isolateScope().musicStylesCheckboxFolk = false;

                element.isolateScope().$digest();

                element.isolateScope().updateCheckboxes();

                expect(element.isolateScope().someSelected).toBe(false);
            });
        });

        describe('data binding', function() {
            it('should call TrialData with the correct data when a box is checked', function() {
                var options = ['Rock', 'Pop', 'Folk'];
                element = angular.element('<checkbox-question question-label="Music Styles" question-id="musicStyles" controller-data-path="data.answers.music_styles"></checkbox-question>');
                element.data('checkboxOptions', options);
                $compile(element)($scope);
                $scope.$digest();

                spyOn(TrialData, 'setValueForPath');

                element.isolateScope().sendToTrialData('a.b.c.d', ['rock', 'pop']);

                expect(TrialData.setValueForPath.calls.count()).toBe(1);
                expect(TrialData.setValueForPath.calls.argsFor(0)[0]).toBe('a.b.c.d');
                expect(TrialData.setValueForPath.calls.argsFor(0)[1]).toEqual(['rock', 'pop']);
            });

            it('should call TrialData with the correct data when an option is selected and the question is associated to media', function() {
                var options = ['Rock', 'Pop', 'Folk'];
                element = angular.element('<checkbox-question question-label="Music Styles" question-id="musicStyles" controller-data-path="data.answers.music_styles" associated-to-media="true"></checkbox-question>');
                element.data('checkboxOptions', options);
                $compile(element)($scope);
                $scope.$digest();

                TrialData.data.state.mediaPlayCount = 2;
                spyOn(TrialData, 'setValueForPathForCurrentMedia');

                element.isolateScope().sendToTrialData('a.b.c.d', ['rock', 'pop']);

                expect(TrialData.setValueForPathForCurrentMedia.calls.count()).toBe(1);
                expect(TrialData.setValueForPathForCurrentMedia.calls.argsFor(0)[0]).toBe('a.b.c.d');
                expect(TrialData.setValueForPathForCurrentMedia.calls.argsFor(0)[1]).toEqual(['rock', 'pop']);
            });
        });
    });
})();
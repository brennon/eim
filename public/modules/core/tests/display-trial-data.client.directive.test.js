'use strict';

(function() {
    describe('display-trial-data directive', function() {

        // Initialize global variables
        var $scope, $compile, element, TrialData;

        // Load the main application module
        beforeEach(module(ApplicationConfiguration.applicationModuleName));

        beforeEach(inject(function(_$rootScope_, _$compile_, _TrialData_, _$httpBackend_) {
            $scope = _$rootScope_.$new();
            $compile = _$compile_;
            TrialData = _TrialData_;
            _$httpBackend_.whenGET('/api/config').respond();
        }));

        it('should add row and column divs', function() {
            element = angular.element('<display-trial-data></display-trial-data>');
            $compile(element)($scope);
            var rowDiv = $($(element).children()[0]);
            var columnDiv = $(rowDiv.children()[0]);

            expect(rowDiv.hasClass('row')).toBe(true);
            expect(columnDiv.hasClass('col-md-12')).toBe(true);
        });

        it('should add a header for the trial data section', function() {
            element = angular.element('<display-trial-data></display-trial-data>');
            $compile(element)($scope);
            var rowDiv = $($(element).children(0)[0]);
            var columnDiv = $(rowDiv.children(0)[0]);
            var header = $(columnDiv.children(0)[0]);

            expect(header.prop('tagName')).toBe('H3');
            expect(header.text()).toMatch(/Trial Data/);
        });

        it('should add a pre section for the trial data', function() {
            element = angular.element('<display-trial-data></display-trial-data>');
            $compile(element)($scope);
            var rowDiv = $($(element).children()[0]);
            var columnDiv = $(rowDiv.children()[0]);
            var pre = $(columnDiv.children()[1]);

            expect(pre.prop('tagName')).toBe('PRE');
        });

        it('should add the trial data to the pre section', function() {
            element = angular.element('<display-trial-data></display-trial-data>');
            $scope.trialDataJson = function() {
                return 'foo';
            };
            $compile(element)($scope);
            $scope.$apply();

            var rowDiv = $($(element).children()[0]);
            var columnDiv = $(rowDiv.children()[0]);
            var pre = $(columnDiv.children()[1]);

            expect(pre.html()).toBe($scope.trialDataJson());
        });
    });
})();

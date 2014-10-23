'use strict';

(function() {
    describe('DemographicsController', function() {

        //Initialize global variables
        var mockScope, mockExperimentManager, $controllerConstructor;

        // Load the main application module
        beforeEach(module(ApplicationConfiguration.applicationModuleName));

        beforeEach(inject(function($controller, $rootScope) {
            $controllerConstructor = $controller;
            mockScope = $rootScope.$new();
        }));

        describe('initialization', function() {
            it('should populate $scope.nationalities', function() {
                $controllerConstructor('DemographicsController',
                    { $scope: mockScope, TrialData: {}, ExperimentManager: {} });

                expect(mockScope.nationalities.length).toBeGreaterThan(0);
            });

            it('should populate $scope.years', function() {
                $controllerConstructor('DemographicsController',
                    { $scope: mockScope, TrialData: {}, ExperimentManager: {} });

                expect(mockScope.years.length).toBe(111);
            });

            it('should populate $scope.years in reverse order', function() {
                $controllerConstructor('DemographicsController',
                    { $scope: mockScope, TrialData: {}, ExperimentManager: {} });

                expect(mockScope.years[0] - mockScope.years[1]).toBe(1);
            });

            it('should set the first year in $scope.years to the current year', function() {
                $controllerConstructor('DemographicsController',
                    { $scope: mockScope, TrialData: {}, ExperimentManager: {} });

                expect(mockScope.years[0]).toBe(new Date().getFullYear());
            });
        });

        describe('data persistence', function() {
            it('should save downcased nationality with $scope.nationalityChanged()', function() {
                var mockTrialData = { data: { answers: {} } };
                $controllerConstructor('DemographicsController',
                    { $scope: mockScope, TrialData: mockTrialData, ExperimentManager: {} });

                mockScope.nationalityChanged('sOmEwHeRe');
                expect(mockTrialData.data.answers.nationality).toBe('somewhere');
            });

            it('should save birthyear with $scope.yearChanged()', function() {
                var mockTrialData = { data: { answers: {} } };
                $controllerConstructor('DemographicsController',
                    { $scope: mockScope, TrialData: mockTrialData, ExperimentManager: {} });

                mockScope.yearChanged(1991);
                expect(mockTrialData.data.answers.dob).toBe(1991);
            });

            it('should save gender with $scope.genderChanged()', function() {
                var mockTrialData = { data: { answers: {} } };
                $controllerConstructor('DemographicsController',
                    { $scope: mockScope, TrialData: mockTrialData, ExperimentManager: {} });

                mockScope.genderChanged('male');
                expect(mockTrialData.data.answers.sex).toBe('male');
            });
        });
    });
})();
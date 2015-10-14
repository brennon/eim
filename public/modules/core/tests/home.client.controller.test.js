'use strict';

(function() {
    describe('HomeController', function() {

        //Initialize global variables
        var mockScope, mockExperimentManager, $controller, $q;

        // Load the main application module
        beforeEach(module(ApplicationConfiguration.applicationModuleName));

        beforeEach(inject(function(_$controller_, $rootScope, _$q_, _$httpBackend_) {
            $controller = _$controller_;
            mockScope = $rootScope.$new();
            $q = _$q_;
            _$httpBackend_.whenGET('/api/config').respond();
        }));

        describe('initialization', function() {
            it('should set readyToAdvance to false', function() {
                mockExperimentManager = {
                    masterReset: function() {
                        var deferred = $q.defer();
                        return deferred.promise;
                    }
                };

                $controller('HomeController',
                    { $scope: mockScope, TrialData: {}, ExperimentManager: mockExperimentManager });

                expect(mockScope.readyToAdvance).toBe(false);
            });
        });

        describe('reset', function() {
            it('should call ExperimentManager.masterReset()', function() {
                mockExperimentManager = { masterReset: function() {
                    var deferred = $q.defer();
                    return deferred.promise;
                }};

                var resetSpy = sinon.spy(mockExperimentManager, 'masterReset');

                $controller('HomeController',
                    { $scope: mockScope, TrialData: {}, ExperimentManager: mockExperimentManager });

                expect(resetSpy.calledOnce).toBe(true);
            });

            it('should set readyToAdvance to true on a successful reset', function() {
                var deferred = $q.defer();

                mockExperimentManager = { masterReset: function() {
                    return deferred.promise;
                }};

                $controller('HomeController',
                    { $scope: mockScope, TrialData: {}, ExperimentManager: mockExperimentManager });

                mockScope.readyToAdvance = false;

                deferred.resolve();
                mockScope.$apply();

                expect(mockScope.readyToAdvance).toBe(true);
            });

            it('should add an alert on a failed reset', function() {
                    var deferred = $q.defer();

                    mockExperimentManager = { masterReset: function() {
                        return deferred.promise;
                    }};

                    $controller('HomeController',
                        { $scope: mockScope, TrialData: {}, ExperimentManager: mockExperimentManager });

                    mockScope.addGenericErrorAlert = function() {
                    };
                    var addErrorSpy = sinon.spy(mockScope, 'addGenericErrorAlert');

                    deferred.reject();

                try {
                    mockScope.$apply();
                } catch (e) {
                    expect(addErrorSpy.calledOnce).toBe(true);
                }
            });

            it('should throw an error on a failed reset', function() {
                var shouldThrow = function() {
                    var deferred = $q.defer();

                    mockExperimentManager = { masterReset: function() {
                        return deferred.promise;
                    }};

                    $controller('HomeController',
                        { $scope: mockScope, TrialData: {}, ExperimentManager: mockExperimentManager });

                    mockScope.addGenericErrorAlert = function() {
                    };
                    var addErrorSpy = sinon.spy(mockScope, 'addGenericErrorAlert');

                    deferred.reject();

                    mockScope.$apply();
                };

                expect(shouldThrow).toThrow();
            });
        });
    });
})();
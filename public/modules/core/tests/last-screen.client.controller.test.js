'use strict';

(function() {
    describe('LastScreenController', function() {

        //Initialize global variables
        var mockScope, $controller, $httpBackend, TrialData;

        // Load the main application module
        beforeEach(module(ApplicationConfiguration.applicationModuleName));

        beforeEach(
            inject(
                function(_$controller_, $rootScope, _$httpBackend_,
                         _TrialData_) {
                    $controller = _$controller_;
                    mockScope = $rootScope.$new();
                    $httpBackend = _$httpBackend_;
                    TrialData = _TrialData_;

                    _$httpBackend_.whenGET('/api/config').respond();
                }
            )
        );

        it('should exist', function() {
            var createController = function() {
                $controller('LastScreenController', {
                    $scope: mockScope
                });
            };

            expect(createController).not.toThrow();
        });

        describe('initialization', function() {
            it('should post TrialData to the server', function() {

                TrialData.data = {
                    metadata: {
                        session_number: 'abc-123'
                    }
                };

                $httpBackend.expectPOST('/api/trials', TrialData.data)
                    .respond(200);

                $controller('LastScreenController',
                    { $scope: mockScope, TrialData: TrialData });

                $httpBackend.verifyNoOutstandingExpectation();
            });

            it('should log an error if it received an error from the server',
                function() {

                    $httpBackend.expectPOST('/api/trials').respond(500);
                    $controller('LastScreenController',
                        {$scope: mockScope});

                    expect($httpBackend.flush).toThrow();
                }
            );
        });
    });
})();
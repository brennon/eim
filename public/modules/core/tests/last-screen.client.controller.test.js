'use strict';

(function() {
    describe('LastScreenController', function() {

        //Initialize global variables
        var mockScope, $controller, $httpBackend;

        // Load the main application module
        beforeEach(module(ApplicationConfiguration.applicationModuleName));

        beforeEach(inject(function(_$controller_, $rootScope, _$httpBackend_) {
            $controller = _$controller_;
            mockScope = $rootScope.$new();
            $httpBackend = _$httpBackend_;
        }));

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

                var mockTrialData = {
                    data: {
                        metadata: {
                            session_number: "abc-123"
                        }
                    }
                };

                $httpBackend.expectPOST('/api/trials', mockTrialData.data).respond(200);

                $controller('LastScreenController',
                    { $scope: mockScope, TrialData: mockTrialData });

                $httpBackend.verifyNoOutstandingExpectation();
            });
        });
    });
})();
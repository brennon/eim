'use strict';

(function() {
    describe('QuestionnaireController', function() {

        //Initialize global variables
        var mockScope, $controller, TrialData, slide/*, SocketIOService, $timeout*/;

        // Load the main application module
        beforeEach(module(ApplicationConfiguration.applicationModuleName));

        beforeEach(inject(function(_$controller_, $rootScope, _TrialData_/*, _SocketIOService_, _$timeout_*/) {
            $controller = _$controller_;
            mockScope = $rootScope.$new();
            TrialData = _TrialData_;

            slide = {
                data: {
                    foo: 'bar'
                }
            };
            TrialData.data.state.currentSlideIndex = 0;
            TrialData.data.schema = [];
            TrialData.data.schema.push(slide);
        }));

        describe('initialization', function() {
            it('should be defined', function() {
                var createController = function() {
                    $controller('QuestionnaireController',
                        {$scope: mockScope}
                    );
                };

                expect(createController).not.toThrow();
            });

            it('should make schema available on scope', function() {
                $controller('QuestionnaireController',
                    {$scope: mockScope}
                );

                expect(mockScope.questionnaireData).toBe(slide.data);
            });
        });
    });
})();
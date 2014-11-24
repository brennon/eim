'use strict';

(function() {
    describe('EmotionIndexController', function() {

        //Initialize global variables
        var $controller, mockScope;

        // Load the main application module
        beforeEach(module(ApplicationConfiguration.applicationModuleName));

        beforeEach(inject(function(_$controller_, $rootScope) {
            $controller = _$controller_;
            mockScope = $rootScope.$new();
        }));

        iit('should exist', function() {
            var createController = function() {
                $controller('EmotionIndexController', {
                    $scope: mockScope,
                    TrialData: { data: { answers: { emotion_indices: [] }}}
                });
            };

            expect(createController).not.toThrow();
        });

        iit('should max the emotion index available on the $scope', function() {
            var mockTrialData = {
                data: {
                    answers: {
                        emotion_indices: [4, 16, 64]
                    }
                }
            };

            $controller('EmotionIndexController', {
                $scope: mockScope,
                TrialData: mockTrialData
            });

            expect(mockScope.emotionIndices).toBe(mockTrialData.data.answers.emotion_indices);
        });
    });
})();
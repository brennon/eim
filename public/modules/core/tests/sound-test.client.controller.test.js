'use strict';

(function() {
    describe('SoundTestController', function() {

        //Initialize global variables
        var mockScope, $controller, SocketIOService, mockTrialData;

        // Load the main application module
        beforeEach(module(ApplicationConfiguration.applicationModuleName));

        beforeEach(inject(function(_$controller_, $rootScope, _SocketIOService_) {
            $controller = _$controller_;
            mockScope = $rootScope.$new();
            SocketIOService = _SocketIOService_;
            mockTrialData = {
                data: {
                    metadata: {
                        session_number: 42
                    }
                }
            };
        }));

        describe('OSC messages', function() {
            it('should emit the correct OSC message on init', function() {
                SocketIOService.emits = {};

                $controller('SoundTestController',
                    { $scope: mockScope, TrialData: mockTrialData }
                );

                var emittedData = SocketIOService.emits.sendOSCMessage[0][0];

                expect(emittedData).toEqual({
                    oscType: 'message',
                    address: '/eim/control/soundTest',
                    args: [
                        {
                            type: 'integer',
                            value: 1
                        },
                        {
                            type: 'string',
                            value: '' + mockTrialData.data.metadata.session_number
                        }
                    ]
                });
            });

            it('$scope.stopSoundTest should send the correct OSC message', function() {
                $controller('SoundTestController',
                    { $scope: mockScope, TrialData: mockTrialData }
                );

                SocketIOService.emits = {};

                mockScope.stopSoundTest();

                var emittedData = SocketIOService.emits.sendOSCMessage[0][0];

                expect(emittedData).toEqual({
                    oscType: 'message',
                    address: '/eim/control/soundTest',
                    args: [
                        {
                            type: 'integer',
                            value: 0
                        },
                        {
                            type: 'string',
                            value: '' + mockTrialData.data.metadata.session_number
                        }
                    ]
                });
            });

            it('should send the stopSoundTest message when the scope is destroyed', function() {
                $controller('SoundTestController',
                    { $scope: mockScope, TrialData: mockTrialData }
                );

                spyOn(mockScope, 'stopSoundTest');
                mockScope.$destroy();
                expect(mockScope.stopSoundTest.calls.count()).toBe(1);
            });
        });
    });
})();
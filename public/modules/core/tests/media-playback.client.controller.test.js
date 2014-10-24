'use strict';

(function() {
    describe('MediaPlaybackController', function() {

        //Initialize global variables
        var mockScope, $controller, SocketIOService, $timeout;

        // Load the main application module
        beforeEach(module(ApplicationConfiguration.applicationModuleName));

        beforeEach(inject(function(_$controller_, $rootScope, _SocketIOService_, _$timeout_) {
            $controller = _$controller_;
            mockScope = $rootScope.$new();
            SocketIOService = _SocketIOService_;
            $timeout = _$timeout_;
        }));

        describe('initialization', function() {
            it('should be defined', function() {
                var createController = function() {
                    $controller('MediaPlaybackController',
                        {$scope: mockScope}
                    );
                };

                expect(createController).not.toThrow();
            });
        });

        describe('view/state manipulation', function() {
            it('should set the button label to \'Begin Playback\'', function() {
                $controller('MediaPlaybackController',
                    {$scope: mockScope}
                );

                expect(mockScope.currentButtonLabel).toBe('Begin Playback');
            });

            it('should set mediaHasPlayed to false', function() {
                $controller('MediaPlaybackController',
                    {$scope: mockScope}
                );

                expect(mockScope.mediaHasPlayed).toBe(false);
            });
        });

        describe('OSC messages', function() {
            it('$scope.startMediaPlayback should send the correct start message to the socket', function() {

                var mockTrialData = {
                    data: {
                        media: ['a', 'b', 'c', 'd'],
                        state: {
                            mediaPlayCount: 3
                        },
                        metadata: {
                            session_number: 42
                        }
                    }
                };

                $controller('MediaPlaybackController',
                    {$scope: mockScope, TrialData: mockTrialData}
                );

                SocketIOService.emits = {};
                mockScope.startMediaPlayback();
                var emittedMessage = SocketIOService.emits.sendOSCMessage[0][0];
                expect(emittedMessage).toEqual(
                    {
                        oscType: 'message',
                        address: '/eim/control/mediaID',
                        args: [
                            {
                                type: 'string',
                                value: mockTrialData.data.media[mockTrialData.data.state.mediaPlayCount]
                            },
                            {
                                type: 'string',
                                value: '' + mockTrialData.data.metadata.session_number
                            }
                        ]
                    }
                );
            });

            describe('message received listener', function() {
                it('should be bound to the oscMessageReceived event', function() {
                    spyOn(SocketIOService, 'on');
                    var controller = $controller('MediaPlaybackController',
                        {$scope: mockScope}
                    );
                    expect(SocketIOService.on.calls.count()).toBe(1);
                    expect(SocketIOService.on.calls.argsFor(0)[0]).toBe('oscMessageReceived');
                    expect(SocketIOService.on.calls.argsFor(0)[1]).toBe(controller.oscMessageReceivedListener);
                });

                it('should call $scope.hideBody on a playback start message', function() {
                    mockScope.hideBody = function() {
                    };
                    $controller('MediaPlaybackController',
                        {$scope: mockScope}
                    );
                    spyOn(mockScope, 'hideBody');
                    SocketIOService.receive('oscMessageReceived',
                        {
                            address: '/eim/status/playback',
                            args: [
                                {
                                    value: 1
                                }
                            ]
                        }
                    );
                    expect(mockScope.hideBody.calls.count()).toBe(1);
                });

                it('should call $scope.showBody on a playback stop message', function() {
                    mockScope.showBody = function() {
                    };
                    $controller('MediaPlaybackController',
                        {$scope: mockScope}
                    );
                    spyOn(mockScope, 'showBody');
                    SocketIOService.receive('oscMessageReceived',
                        {
                            address: '/eim/status/playback',
                            args: [
                                {
                                    value: 0
                                }
                            ]
                        }
                    );
                    expect(mockScope.showBody.calls.count()).toBe(1);
                });

                it('should increment TrialData play count on a playback stop message if media has not yet played', function() {
                    mockScope.showBody = function() {
                    };
                    var mockTrialData = {
                        data: {
                            state: {
                                mediaPlayCount: 0
                            }
                        }
                    };
                    $controller('MediaPlaybackController',
                        {$scope: mockScope, TrialData: mockTrialData}
                    );

                    mockScope.mediaHasPlayed = false;
                    SocketIOService.receive('oscMessageReceived',
                        {
                            address: '/eim/status/playback',
                            args: [
                                {
                                    value: 0
                                }
                            ]
                        }
                    );
                    expect(mockTrialData.data.state.mediaPlayCount).toBe(1);
                });

                it('should update the button label on a playback stop message if media has not yet played', function() {
                    mockScope.showBody = function() {
                    };
                    $controller('MediaPlaybackController',
                        {$scope: mockScope}
                    );

                    mockScope.mediaHasPlayed = false;
                    mockScope.currentButtonLabel = '';
                    SocketIOService.receive('oscMessageReceived',
                        {
                            address: '/eim/status/playback',
                            args: [
                                {
                                    value: 0
                                }
                            ]
                        }
                    );

                    $timeout.flush();

                    expect(mockScope.currentButtonLabel).toBe('Continue');
                });

                it('should set mediaHasPlayed to true on a playback stop message if media has not yet played', function() {
                    mockScope.showBody = function() {
                    };
                    $controller('MediaPlaybackController',
                        {$scope: mockScope}
                    );

                    mockScope.mediaHasPlayed = false;
                    SocketIOService.receive('oscMessageReceived',
                        {
                            address: '/eim/status/playback',
                            args: [
                                {
                                    value: 0
                                }
                            ]
                        }
                    );

                    $timeout.flush();

                    expect(mockScope.mediaHasPlayed).toBe(true);
                });

                it('should be removed when the scope is destroyed', function() {
                    $controller('MediaPlaybackController',
                        {$scope: mockScope}
                    );

                    spyOn(SocketIOService, 'removeListener');
                    mockScope.$destroy();
                    expect(SocketIOService.removeListener.calls.count()).toBe(1);
                });
            });

            it('should send a stopMedia message when the scope is destroyed', function() {
                var mockTrialData = {
                    data: {
                        metadata: {
                            session_number: 42
                        }
                    }
                };
                $controller('MediaPlaybackController',
                    {$scope: mockScope, TrialData: mockTrialData}
                );

                SocketIOService.emits = {};
                mockScope.$destroy();
                var emittedMessage = SocketIOService.emits.sendOSCMessage[0][0];
                expect(emittedMessage).toEqual({
                    oscType: 'message',
                    address: '/eim/control/stopMedia',
                    args: {
                        type: 'string',
                        value: '' + mockTrialData.data.metadata.session_number
                    }
                });
            });
        });
    });
})();
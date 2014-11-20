'use strict';

(function() {
    describe('SignalTestController', function() {

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

        it('should be defined', function() {
            var createController = function() {
                $controller('SignalTestController', {
                    '$scope': mockScope
                });
            };

            expect(createController).not.toThrow();
        });

        describe('scope', function() {
            it('should initialize edaQuality to 0', function() {
                mockScope.edaQuality = 1;
                $controller('SignalTestController',
                    { '$scope': mockScope }
                );

                expect(mockScope.edaQuality).toBe(0);
            });

            it('should initialize poxQuality to 0', function() {
                mockScope.poxQuality = 1;
                $controller('SignalTestController',
                    { '$scope': mockScope }
                );

                expect(mockScope.poxQuality).toBe(0);
            });

            it('should initialize testRecordingComplete to false', function() {
                mockScope.testRecordingComplete = true;
                $controller('SignalTestController',
                    { '$scope': mockScope }
                );

                expect(mockScope.testRecordingComplete).toBe(false);
            });

            describe('#readyToAdvance', function() {
                it('should return false if debugMode is false and #allSignalsGood returns false', function() {
                    $controller('SignalTestController',
                        { '$scope': mockScope }
                    );

                    mockScope.allSignalsGood = function() { return false; };
                    mockScope.debugMode = false;

                    expect(mockScope.readyToAdvance()).toBe(false);
                });

                it('should return true if debugMode is true', function() {
                    $controller('SignalTestController',
                        { '$scope': mockScope }
                    );

                    mockScope.allSignalsGood = function() { return false; };
                    mockScope.debugMode = true;

                    expect(mockScope.readyToAdvance()).toBe(true);
                });

                it('should return true if #allSignalsGood returns true', function() {
                    $controller('SignalTestController',
                        { '$scope': mockScope }
                    );

                    mockScope.allSignalsGood = function() { return true; };
                    mockScope.debugMode = false;

                    expect(mockScope.readyToAdvance()).toBe(true);
                });
            });

            describe('#allSignalsGood', function() {
                it('should return false if edaQuality is false', function() {
                    $controller('SignalTestController',
                        { '$scope': mockScope }
                    );

                    mockScope.edaQuality = false;
                    mockScope.poxQuality = true;

                    expect(mockScope.allSignalsGood()).toBe(false);
                });

                it('should return false if poxQuality is false', function() {
                    $controller('SignalTestController',
                        { '$scope': mockScope }
                    );

                    mockScope.edaQuality = true;
                    mockScope.poxQuality = false;

                    expect(mockScope.allSignalsGood()).toBe(false);
                });

                it('should return true if both edaQuality and poxQuality are true', function() {
                    var c = $controller('SignalTestController',
                        { '$scope': mockScope }
                    );

                    mockScope.edaQuality = true;
                    mockScope.poxQuality = true;

                    expect(mockScope.allSignalsGood()).toBe(true);
                });
            });
        });

        describe('OSC messages', function() {
            it('should emit the correct OSC message on init', function() {
                var controller = $controller('SignalTestController',
                    { $scope: mockScope, TrialData: mockTrialData }
                );

                SocketIOService.emits = {};

                controller.sendStartSignalTestMessage();

                var emittedData = SocketIOService.emits.sendOSCMessage[0][0];

                expect(emittedData).toEqual({
                    oscType: 'message',
                    address: '/eim/control/signalTest',
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

            it('should call sendStartSignalTestMessage when the controller is created', function() {
                SocketIOService.emits = {};

                $controller('SignalTestController',
                    { $scope: mockScope, TrialData: mockTrialData }
                );

                var emittedData = SocketIOService.emits.sendOSCMessage[0][0];

                expect(emittedData).toEqual({
                    oscType: 'message',
                    address: '/eim/control/signalTest',
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

            it('#sendStopSignalTestMessage should send the correct OSC message', function() {
                var controller = $controller('SignalTestController',
                    { $scope: mockScope, TrialData: mockTrialData }
                );

                SocketIOService.emits = {};
                controller.sendStopSignalTestMessage();

                var emittedData = SocketIOService.emits.sendOSCMessage[0][0];

                expect(emittedData).toEqual({
                    oscType: 'message',
                    address: '/eim/control/signalTest',
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

            it('should call sendStopSignalTestMessage when the scope is destroyed', function() {
                var controller = $controller('SignalTestController',
                    { $scope: mockScope, TrialData: mockTrialData }
                );

                spyOn(controller, 'sendStopSignalTestMessage');

                mockScope.$destroy();

                expect(controller.sendStopSignalTestMessage.calls.count()).toBe(1);
            });

            describe('message received listener', function() {
                it('should be added on initialization', function() {
                    spyOn(SocketIOService, 'on');

                    var controller = $controller('SignalTestController',
                        { $scope: mockScope }
                    );

                    var callArgs = SocketIOService.on.calls.argsFor(0);
                    expect(callArgs[1]).toBe(controller.oscMessageReceivedListener);
                });

                it('should be removed on destruction', function() {
                    spyOn(SocketIOService, 'removeListener');

                    var controller = $controller('SignalTestController',
                        { $scope: mockScope }
                    );

                    mockScope.$destroy();

                    var callArgs = SocketIOService.removeListener.calls.argsFor(0);
                    expect(callArgs[1]).toBe(controller.oscMessageReceivedListener);
                });

                it('should set edaQuality to 1 with the correct OSC message', function() {
                    var controller = $controller('SignalTestController',
                        { $scope: mockScope, TrialData: mockTrialData }
                    );

                    var mockMessage = {
                        address: '/eim/status/signalQuality/eda',
                        args: [
                            {
                                value: 0
                            }
                        ]
                    };

                    mockScope.edaQuality = 1;

                    controller.oscMessageReceivedListener(mockMessage);

                    expect(mockScope.edaQuality).toBe(0);
                });

                it('should set edaQuality to 0 with the correct OSC message', function() {
                    var controller = $controller('SignalTestController',
                        { $scope: mockScope, TrialData: mockTrialData }
                    );

                    var mockMessage = {
                        address: '/eim/status/signalQuality/eda',
                        args: [
                            {
                                value: 1
                            }
                        ]
                    };

                    mockScope.edaQuality = 0;

                    controller.oscMessageReceivedListener(mockMessage);

                    expect(mockScope.edaQuality).toBe(1);
                });

                it('should set poxQuality to 1 with the correct OSC message', function() {
                    var controller = $controller('SignalTestController',
                        { $scope: mockScope, TrialData: mockTrialData }
                    );

                    var mockMessage = {
                        address: '/eim/status/signalQuality/pox',
                        args: [
                            {
                                value: 0
                            }
                        ]
                    };

                    mockScope.poxQuality = 1;

                    controller.oscMessageReceivedListener(mockMessage);

                    expect(mockScope.poxQuality).toBe(0);
                });

                it('should set poxQuality to 0 with the correct OSC message', function() {
                    var controller = $controller('SignalTestController',
                        { $scope: mockScope, TrialData: mockTrialData }
                    );

                    var mockMessage = {
                        address: '/eim/status/signalQuality/pox',
                        args: [
                            {
                                value: 1
                            }
                        ]
                    };

                    mockScope.poxQuality = 0;

                    controller.oscMessageReceivedListener(mockMessage);

                    expect(mockScope.poxQuality).toBe(1);
                });

                it('should set testRecordingComplete to true with the correct OSC message', function() {
                    var controller = $controller('SignalTestController',
                        { $scope: mockScope, TrialData: mockTrialData }
                    );

                    var mockMessage = {
                        address: '/eim/status/testRecordingComplete',
                    };

                    mockScope.testRecordingComplete = false;

                    controller.oscMessageReceivedListener(mockMessage);

                    expect(mockScope.testRecordingComplete).toBe(true);
                });

                it('should call #sendStopSignalTest with the correct OSC message', function() {
                    var controller = $controller('SignalTestController',
                        { $scope: mockScope, TrialData: mockTrialData }
                    );

                    var mockMessage = {
                        address: '/eim/status/testRecordingComplete',
                    };

                    spyOn(controller, 'sendStopSignalTestMessage');

                    controller.oscMessageReceivedListener(mockMessage);

                    expect(controller.sendStopSignalTestMessage.calls.count()).toBe(1);
                });
            });
        });
    });
})();
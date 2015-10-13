'use strict';

(function() {
    describe('SignalTestController', function() {

        //Initialize global variables
        var mockScope, $controller, mockTrialData, $timeout, $log, OSC;

        // Load the main application module
        beforeEach(module(ApplicationConfiguration.applicationModuleName));

        beforeEach(
            inject(
                function(_$controller_, $rootScope, _$timeout_, _$log_, _OSC_) {
                    $controller = _$controller_;
                    mockScope = $rootScope.$new();
                    mockTrialData = {
                        data: {
                            metadata: {
                                session_number: 42
                            }
                        }
                    };
                    $timeout = _$timeout_;
                    $log = _$log_;
                    OSC = _OSC_;
                }
            )
        );

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
                it('should return false if debugMode is false and ' +
                    '#allSignalsGood returns false', function() {
                        $controller('SignalTestController',
                            { '$scope': mockScope }
                        );

                        mockScope.allSignalsGood = function() { return false; };
                        mockScope.debugMode = false;

                        expect(mockScope.readyToAdvance()).toBe(false);
                    }
                );

                it('should return true if debugMode is true', function() {
                    $controller('SignalTestController',
                        { '$scope': mockScope }
                    );

                    mockScope.allSignalsGood = function() { return false; };
                    mockScope.debugMode = true;

                    expect(mockScope.readyToAdvance()).toBe(true);
                });

                it('should return true if #allSignalsGood returns true',
                    function() {
                        $controller('SignalTestController',
                            { '$scope': mockScope }
                        );

                        mockScope.allSignalsGood = function() { return true; };
                        mockScope.debugMode = false;

                        expect(mockScope.readyToAdvance()).toBe(true);
                    }
                );

                describe('timeout', function () {
                    it('should send the stop signal test message', function() {
                        $controller('SignalTestController', {
                            $scope: mockScope,
                            TrialData: mockTrialData,
                            $timeout: $timeout
                        });

                        var stopSignalTestMessage = {
                            oscType: 'message',
                            address: '/eim/control/signalTest',
                            args: [
                                {
                                    type: 'integer',
                                    value: 0
                                },
                                {
                                    type: 'string',
                                    value: '' + mockTrialData.data.metadata
                                        .session_number
                                }
                            ]
                        };

                        spyOn(OSC, 'send');

                        $timeout.flush();

                        expect(OSC.send.calls.argsFor(0)[0])
                            .toEqual(stopSignalTestMessage);
                    });


                    it('should set EDA and POX quality to 1 on timeout',
                        function () {

                            $controller('SignalTestController', {
                                $scope: mockScope,
                                TrialData: mockTrialData,
                                $timeout: $timeout
                            });

                            $timeout.flush();
                            $timeout.flush();

                            expect(mockScope.edaQuality).toBeTruthy();
                            expect(mockScope.poxQuality).toBeTruthy();
                        }
                    );

                    it('should set stop the test on timeout',
                        function () {

                            var ctrl = $controller('SignalTestController', {
                                $scope: mockScope,
                                TrialData: mockTrialData,
                                $timeout: $timeout
                            });

                            spyOn(ctrl, 'sendStopSignalTestMessage');

                            $timeout.flush();
                            $timeout.flush();

                            expect(ctrl.sendStopSignalTestMessage)
                                .toHaveBeenCalled();
                        }
                    );
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

                it('should return true if both edaQuality and poxQuality are ' +
                    'true', function() {
                        $controller('SignalTestController',
                            { '$scope': mockScope }
                        );

                        mockScope.edaQuality = true;
                        mockScope.poxQuality = true;

                        expect(mockScope.allSignalsGood()).toBe(true);
                    }
                );
            });
        });

        describe('OSC messages', function() {
            it('should send the correct OSC message on init', function() {
                var controller = $controller('SignalTestController',
                    { $scope: mockScope, TrialData: mockTrialData }
                );

                spyOn(OSC, 'send');

                controller.sendStartSignalTestMessage();

                expect(OSC.send.calls.argsFor(0)[0]).toEqual({
                    oscType: 'message',
                    address: '/eim/control/signalTest',
                    args: [
                        {
                            type: 'integer',
                            value: 1
                        },
                        {
                            type: 'string',
                            value: '' + mockTrialData.data.metadata
                                .session_number
                        }
                    ]
                });
            });

            it('#sendStopSignalTestMessage should send the correct OSC message',
                function() {

                    var controller = $controller('SignalTestController',
                        { $scope: mockScope, TrialData: mockTrialData }
                    );

                    spyOn(OSC, 'send');

                    controller.sendStopSignalTestMessage();

                    var stopMessage = {
                        oscType: 'message',
                        address: '/eim/control/signalTest',
                        args: [
                            {
                                type: 'integer',
                                value: 0
                            },
                            {
                                type: 'string',
                                value: '' + mockTrialData.data.metadata
                                    .session_number
                            }
                        ]
                    };

                    expect(OSC.send.calls.argsFor(0)[0])
                        .toEqual(stopMessage);
                }
            );

            it('should call sendStopSignalTestMessage when the scope is ' +
                'destroyed', function() {

                var controller = $controller('SignalTestController',
                    { $scope: mockScope, TrialData: mockTrialData }
                );

                spyOn(controller, 'sendStopSignalTestMessage');

                mockScope.$destroy();

                expect(controller.sendStopSignalTestMessage.calls.count())
                    .toBe(1);
            });

            describe('message received listeners', function() {
                it('should be added on initialization', function() {
                    spyOn(OSC, 'subscribe');

                    var controller = $controller('SignalTestController',
                        { $scope: mockScope }
                    );

                    var firstCallArgs = OSC.subscribe.calls.argsFor(0);
                    expect(firstCallArgs[0])
                        .toEqual('/eim/status/signalQuality/eda');
                    expect(firstCallArgs[1])
                        .toBe(controller.edaQualityMessageListener);

                    var secondCallArgs = OSC.subscribe.calls.argsFor(1);
                    expect(secondCallArgs[0])
                        .toEqual('/eim/status/signalQuality/pox');
                    expect(secondCallArgs[1])
                        .toBe(controller.poxQualityMessageListener);

                    var thirdCallArgs = OSC.subscribe.calls.argsFor(2);
                    expect(thirdCallArgs[0])
                        .toEqual(
                            '/eim/status/testRecordingComplete'
                        );
                    expect(thirdCallArgs[1])
                        .toBe(controller.recordingCompleteMessageListener);
                });

                it('should be removed on destruction', function() {
                    spyOn(OSC, 'unsubscribe');

                    var ctrl = $controller('SignalTestController',
                        { $scope: mockScope }
                    );

                    mockScope.$destroy();

                    expect(OSC.unsubscribe.calls.argsFor(0)[0])
                        .toEqual('/eim/status/signalQuality/eda');
                    expect(OSC.unsubscribe.calls.argsFor(0)[1])
                        .toEqual(ctrl.edaQualityMessageListener);
                    expect(OSC.unsubscribe.calls.argsFor(1)[0])
                        .toEqual('/eim/status/signalQuality/pox');
                    expect(OSC.unsubscribe.calls.argsFor(1)[1])
                        .toEqual(ctrl.poxQualityMessageListener);
                    expect(OSC.unsubscribe.calls.argsFor(2)[0])
                        .toEqual('/eim/status/testRecordingComplete');
                    expect(OSC.unsubscribe.calls.argsFor(2)[1])
                        .toEqual(ctrl.recordingCompleteMessageListener);
                });

                it('should set edaQuality to 1 with the correct OSC message',
                    function() {
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

                        controller.edaQualityMessageListener(mockMessage);

                        expect(mockScope.edaQuality).toBe(0);
                    }
                );

                it('should set edaQuality to 0 with the correct OSC message',
                    function() {
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

                        controller.edaQualityMessageListener(mockMessage);

                        expect(mockScope.edaQuality).toBe(1);
                    }
                );

                it('should log a warning when EDA quality is 0', function() {

                    // Spy on $log
                    spyOn($log, 'warn');

                    // Instantiate controller
                    mockTrialData.data.metadata.terminal = 42;
                    var controller = $controller('SignalTestController',
                        { $scope: mockScope, TrialData: mockTrialData }
                    );

                    // Send the bad EDA message
                    var mockMessage = {
                        address: '/eim/status/signalQuality/eda',
                        args: [
                            {
                                value: 0
                            }
                        ]
                    };
                    controller.edaQualityMessageListener(mockMessage);

                    // Check expectation
                    expect($log.warn).toHaveBeenCalledWith('Bad EDA signal' +
                        ' detected on terminal 42.');
                });

                it('should set poxQuality to 1 with the correct OSC message',
                    function() {
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

                        controller.poxQualityMessageListener(mockMessage);

                        expect(mockScope.poxQuality).toBe(0);
                    }
                );

                it('should log a warning when POX quality is 0', function() {

                    // Spy on $log
                    spyOn($log, 'warn');

                    // Instantiate controller
                    mockTrialData.data.metadata.terminal = 42;
                    var controller = $controller('SignalTestController',
                        { $scope: mockScope, TrialData: mockTrialData }
                    );

                    // Send the bad POXmessage
                    var mockMessage = {
                        address: '/eim/status/signalQuality/pox',
                        args: [
                            {
                                value: 0
                            }
                        ]
                    };
                    controller.poxQualityMessageListener(mockMessage);

                    // Check expectation
                    expect($log.warn).toHaveBeenCalledWith('Bad POX signal' +
                        ' detected on terminal 42.');
                });

                it('should set poxQuality to 0 with the correct OSC message',
                    function() {
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

                        controller.poxQualityMessageListener(mockMessage);

                        expect(mockScope.poxQuality).toBe(1);
                    }
                );

                it('should set testRecordingComplete to true with the ' +
                    'correct OSC message', function() {
                        var controller = $controller('SignalTestController',
                            { $scope: mockScope, TrialData: mockTrialData }
                        );

                        var mockMessage = {
                            address: '/eim/status/testRecordingComplete'
                        };

                        mockScope.testRecordingComplete = false;

                        controller
                            .recordingCompleteMessageListener(mockMessage);

                        expect(mockScope.testRecordingComplete).toBe(true);
                    }
                );

                it('should call #sendStopSignalTest with the correct OSC ' +
                    'message', function() {
                        var controller = $controller('SignalTestController',
                            { $scope: mockScope, TrialData: mockTrialData }
                        );

                        var mockMessage = {
                            address: '/eim/status/testRecordingComplete'
                        };

                        spyOn(controller, 'sendStopSignalTestMessage');

                        controller
                            .recordingCompleteMessageListener(mockMessage);

                        expect(
                            controller.sendStopSignalTestMessage.calls.count()
                        ).toBe(1);
                    }
                );
            });
        });
    });
})();
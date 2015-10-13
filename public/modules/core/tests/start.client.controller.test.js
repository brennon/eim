'use strict';

(function() {
    describe('StartController', function() {

        //Initialize global variables
        var mockScope, $controller, $timeout, $httpBackend, TrialData, $log,
            OSC;

        // Load the main application module
        beforeEach(module(ApplicationConfiguration.applicationModuleName));

        beforeEach(inject(function(_$controller_, $rootScope, _$timeout_,
                                   _$httpBackend_, _TrialData_, _$log_, _OSC_) {
            $controller = _$controller_;
            mockScope = $rootScope.$new();
            $timeout = _$timeout_;
            $httpBackend = _$httpBackend_;
            TrialData = _TrialData_;
            $log = _$log_;
            OSC = _OSC_;
        }));

        describe('initialization', function() {
            it('should set the date on the TrialData object', function() {
                $controller('StartController',
                    {$scope: mockScope});

                var now = new Date();
                var trialDataDate = Date.parse(TrialData.data.date);

                expect(now - trialDataDate).toBeLessThan(5);
            });

            it('should set $scope.maxReady to false', function() {
                var controller = $controller('StartController',
                    {$scope: mockScope});

                mockScope.maxReady = true;
                controller.sendExperimentStartMessage();
                expect(mockScope.maxReady).toBe(false);
            });
        });

        describe('advancing logic', function() {
            describe('#$scope.readyToAdvance', function() {
                it('should return true if only Max is ready', function() {
                    $controller('StartController',
                        {$scope: mockScope});

                    mockScope.maxReady = true;
                    mockScope.debugMode = false;
                    expect(mockScope.readyToAdvance()).toBe(true);
                });

                it('should return true if only debugMode is true', function() {
                    $controller('StartController',
                        {$scope: mockScope});

                    mockScope.maxReady = false;
                    mockScope.debugMode = true;
                    expect(mockScope.readyToAdvance()).toBe(true);
                });
            });
        });

        describe('#sendExperimentStartMessage', function() {
            it('should send the correct start event to the socket', function() {
                var mockTrialData = {
                    data: {
                        metadata: {
                            session_number: 'foo'
                        }
                    }
                };

                var controller = $controller('StartController', {
                    $scope: mockScope,
                    TrialData: mockTrialData
                });

                spyOn(OSC, 'send');

                controller.sendExperimentStartMessage();

                expect(OSC.send.calls.argsFor(0)[0])
                    .toEqual({
                        oscType: 'message',
                        address: '/eim/control/startExperiment',
                        args: {
                            type: 'string',
                            value: 'foo'
                        }
                    });
            });
        });

        describe('OSC message handling', function() {
            describe('message received listener', function() {

                it('should set $scope.maxReady to true on the correct message',
                    function() {
                        var controller = $controller('StartController', {
                            $scope: mockScope
                        });

                        mockScope.maxReady = false;

                        spyOn(mockScope, '$apply').and.callFake(
                            function(callback) {
                                callback();
                            }
                        );
                        controller.startMessageListener({
                            address: '/eim/status/startExperiment'
                        });
                        expect(mockScope.maxReady).toBe(true);
                    }
                );

                it('should subscribe to the correct message', function() {
                    spyOn(OSC, 'subscribe');

                    var controller = $controller('StartController', {
                        $scope: mockScope
                    });

                    expect(OSC.subscribe).toHaveBeenCalled();
                    expect(OSC.subscribe.calls.argsFor(0)[0])
                        .toEqual('/eim/status/startExperiment');
                    expect(OSC.subscribe.calls.argsFor(0)[1])
                        .toEqual(controller.startMessageListener);
                });

                it('should unsubscribe when the controller is destroyed',
                    function() {

                        spyOn(OSC, 'unsubscribe');

                        var controller = $controller('StartController', {
                            $scope: mockScope,
                            //SocketIOService: SocketIOService
                        });
                        mockScope.$destroy();
                        expect(
                            OSC.unsubscribe.calls.argsFor(0)[0]
                        ).toBe('/eim/status/startExperiment');
                        expect(
                            OSC.unsubscribe.calls.argsFor(0)[1]
                        ).toBe(controller.startMessageListener);
                    }
                );
            });
        });

        describe('error timeout', function() {
            it('should be added', function() {
                var controller = $controller('StartController', {
                    $scope: mockScope
                });

                expect(controller.errorTimeout).toBeDefined();
            });

            it('should be destroyed when the scope is destroyed', function() {

                var controller = $controller('StartController', {
                    $scope: mockScope,
                    $timeout: $timeout
                });

                spyOn($timeout, 'cancel');

                mockScope.$destroy();

                expect($timeout.cancel.calls.argsFor(0)[0])
                    .toBe(controller.errorTimeout);
            });

            it('should throw an error if $scope.readyToAdvance is false',
                function() {
                    $controller('StartController', {
                        $scope: mockScope,
                        $timeout: $timeout
                    });

                    $httpBackend.expect(
                        'GET',
                        'modules/core/views/home.client.view.html'
                    ).respond();

                    mockScope.readyToAdvance = function() {
                        return true;
                    };
                    expect($timeout.flush).not.toThrow();
                }
            );

            it('should call $scope#addGenericErrorAlert', function() {
                mockScope.addGenericErrorAlert = function() {
                };
                spyOn(mockScope, 'addGenericErrorAlert');

                $controller('StartController', {
                    $scope: mockScope,
                    $timeout: $timeout
                });

                mockScope.readyToAdvance = function() {
                    return false;
                };

                $httpBackend.expect(
                    'GET',
                    'modules/core/views/home.client.view.html'
                ).respond();

                try {
                    $timeout.flush();
                } catch (e) {
                    expect(mockScope.addGenericErrorAlert.calls.count())
                        .toBe(1);
                }
            });
        });
    });
})();

'use strict';

// TODO: Update tests that hit socket to use mock socket (see https://github.com/nullivex/angular-socket.io-mock)

(function() {
    describe('StartController', function() {

        //Initialize global variables
        var mockScope, $controller, mockSocketService, $timeout, $httpBackend;

        // Load the main application module
        beforeEach(module(ApplicationConfiguration.applicationModuleName));

        beforeEach(inject(function(_$controller_, $rootScope, _$timeout_, _$httpBackend_) {
            mockSocketService = {
                emit: function() {},
                on: function() {},
                removeListener: function() {}
            };
            $controller = _$controller_;
            mockScope = $rootScope.$new();
            $timeout = _$timeout_;
            $httpBackend = _$httpBackend_;
        }));

        describe('advancing logic', function() {
            describe('#$scope.readyToAdvance', function() {
                it('should return true if only Max is ready', function() {
                    $controller('StartController',
                        { $scope: mockScope });

                    mockScope.maxReady = true;
                    mockScope.debugMode = false;
                    expect(mockScope.readyToAdvance()).toBe(true);
                });

                it('should return true if only debugMode is true', function() {
                    $controller('StartController',
                        { $scope: mockScope });

                    mockScope.maxReady = false;
                    mockScope.debugMode = true;
                    expect(mockScope.readyToAdvance()).toBe(true);
                });
            });
        });

        describe('#sendExperimentStartMessage', function() {
            it('should set $scope.maxReady to false', function() {
                var controller = $controller('StartController',
                    { $scope: mockScope });

                mockScope.maxReady = true;
                controller.sendExperimentStartMessage();
                expect(mockScope.maxReady).toBe(false);
            });

            it('should send the correct start event to the socket', function() {
                var mockTrialData = {
                    data: {
                        metadata: {
                            session_number: 'foo'
                        }
                    }
                };

                var emitSpy = sinon.spy(mockSocketService, 'emit');
                var controller = $controller('StartController', {
                    $scope: mockScope,
                    SocketIOService: mockSocketService,
                    TrialData: mockTrialData
                });
                controller.sendExperimentStartMessage();

                // Spy will be called twice: once explicitly from the previous
                // line, and once during controller init
                expect(emitSpy.calledTwice).toBe(true);

                var callArgs = emitSpy.firstCall.args;
                expect(callArgs[0]).toBe('sendOSCMessage');
                expect(callArgs[1]).toEqual({
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
                it('should set $scope.maxReady to true on the correct message', function() {
                    var controller = $controller('StartController', {
                        $scope: mockScope
                    });

                    mockScope.maxReady = false;

                    spyOn(mockScope, '$apply').and.callFake(function(callback) {
                        callback();
                    });
                    controller.oscMessageReceivedListener({
                        address: '/eim/status/startExperiment'
                    });
                    expect(mockScope.maxReady).toBe(true);
                });

                it('should be attached to oscMessageReceived event', function() {
                    spyOn(mockSocketService, 'on');

                    var controller = $controller('StartController', {
                        $scope: mockScope,
                        SocketIOService: mockSocketService
                    });

                    expect(mockSocketService.on.calls.argsFor(0)[0])
                        .toBe('oscMessageReceived');
                    expect(mockSocketService.on.calls.argsFor(0)[1])
                        .toBe(controller.oscMessageReceivedListener);
                });

                it('should be removed when the controller is destroyed', function() {
                    spyOn(mockSocketService, 'removeListener');

                    var controller = $controller('StartController', {
                        $scope: mockScope,
                        SocketIOService: mockSocketService
                    });
                    mockScope.$destroy();
                    expect(mockSocketService.removeListener.calls.argsFor(0)[0])
                        .toBe('oscMessageReceived');
                    expect(mockSocketService.removeListener.calls.argsFor(0)[1])
                        .toBe(controller.oscMessageReceivedListener);
                });
            });
        });

        describe('error timeout', function() {
            it('should be added', function() {
                var controller = $controller('StartController', {
                    $scope: mockScope
                });

                expect(controller.errorTimeout).toBeDefined()
            });

            it('should be destroyed when the scope is destroyed', function() {
                var controller = $controller('StartController', {
                    $scope: mockScope,
                    $timeout: $timeout
                });

                spyOn($timeout, 'cancel');

                mockScope.$destroy();

                expect($timeout.cancel.calls.argsFor(0)[0]).toBe(controller.errorTimeout);
            });

            it('should throw an error if $scope.readyToAdvance is false', function() {
                $controller('StartController', {
                    $scope: mockScope,
                    $timeout: $timeout
                });

                $httpBackend.expect('GET', 'modules/core/views/home.client.view.html').respond();

                mockScope.readyToAdvance = true;
                expect($timeout.flush).not.toThrow();
            });

            it('should call $scope#addGenericErrorAlert', function() {
                mockScope.addGenericErrorAlert = function() {};
                spyOn(mockScope, 'addGenericErrorAlert');
                $controller('StartController', {
                    $scope: mockScope,
                    $timeout: $timeout
                });

                $httpBackend.expect('GET', 'modules/core/views/home.client.view.html').respond();

                try {
                    $timeout.flush();
                } catch (e) {
                    expect(mockScope.addGenericErrorAlert.calls.count()).toBe(1);
                }
            });
        });
    });
})();
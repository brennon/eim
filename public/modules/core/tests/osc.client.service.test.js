/**
 * Created by brennon on 10/8/15.
 */

'use strict';

(function() {
    describe('OSC service', function() {

        // Load the main application module
        beforeEach(module(ApplicationConfiguration.applicationModuleName));

        describe('initialization', function() {
            it('should listen for all incoming OSC messages', function() {

                // Spin up socket service first
                inject(function(_SocketIOService_) {

                    var socketService = _SocketIOService_;
                    spyOn(socketService, 'on');

                    // Then spin up OSC service
                    inject(function(_OSC_) {

                        var OSC = _OSC_;

                        // OSC service should attach its incomingMessageHandler
                        // as an event handler for socket service's
                        // oscMessageReceived events
                        expect(socketService.on).toHaveBeenCalled();
                        expect(socketService.on.calls.argsFor(0)[0])
                            .toEqual('oscMessageReceived');
                        expect(socketService.on.calls.argsFor(0)[1])
                            .toEqual(OSC.incomingMessageHandler);
                    });
                });
            });
        });

        describe('behavior', function() {

            // Describe-wide variables
            var OSC, SocketIOService, $log;

            beforeEach(inject(function(_OSC_, _SocketIOService_, _$log_) {
                OSC = _OSC_;
                SocketIOService = _SocketIOService_;
                $log = _$log_;
            }));

            it('should be defined', function() {
                expect(OSC).toBeDefined();
            });

            describe('subscribing', function() {
                it('should add subscribers for a message to its tracking',
                    function() {

                        function myListener() {
                        }

                        // Listen for messages to /foo/bar with myListener
                        OSC.subscribe('/foo/bar', myListener);

                        // Expect socket service to add our listener to its list
                        expect(OSC.listeners['/foo/bar'][0])
                            .toEqual(myListener);
                    }
                );

                it('should log an error if the subscription address was not ' +
                    'given', function() {
                        spyOn($log, 'error');
                        OSC.subscribe(undefined, function() {
                        });
                        expect($log.error)
                            .toHaveBeenCalledWith(
                                'You must specify both an address and a ' +
                                'callback to subscribe.'
                            );
                    }
                );

                it('should log an error if the subscription callback was not ' +
                    'given', function() {
                        spyOn($log, 'error');
                        OSC.subscribe('/foo/bar', undefined);
                        expect($log.error)
                            .toHaveBeenCalledWith(
                                'You must specify both an address and a ' +
                                'callback to subscribe.'
                            );
                    }
                );

                it('should log an error if the subscription address was not ' +
                    'a string', function() {
                        spyOn($log, 'error');
                        OSC.subscribe(42, function() {
                        });
                        expect($log.error)
                            .toHaveBeenCalledWith(
                                'Address must be a string.'
                            );
                    }
                );

                it('should log an error if the subscription callback was not ' +
                    'a function', function() {
                        spyOn($log, 'error');
                        OSC.subscribe('/foo/bar', 42);
                        expect($log.error)
                            .toHaveBeenCalledWith(
                                'Callback must be a function.'
                            );
                    }
                );
            });

            describe('unsubscribing', function() {
                it('should remove subscribers from a message from its ' +
                    'tracking', function() {

                        function myListener() {}

                        // Listen for messages to /foo/bar with myListener
                        OSC.subscribe('/foo/bar', myListener);

                        // Stop listening
                        OSC.unsubscribe('/foo/bar', myListener);

                        // Expect socket service to add our listener to its list
                        expect(OSC.listeners['/foo/bar'][0])
                            .not.toEqual(myListener);
                    }
                );

                it('should log an error if the subscription address was not ' +
                    'given', function() {
                        spyOn($log, 'error');
                        OSC.unsubscribe(undefined, function() {});
                        expect($log.error)
                            .toHaveBeenCalledWith(
                                'You must specify both an address and a ' +
                                'callback to unsubscribe.'
                            );
                    }
                );

                it('should log an error if the subscription callback was not ' +
                    'given', function() {
                        spyOn($log, 'error');
                        OSC.unsubscribe('/foo/bar', undefined);
                        expect($log.error)
                            .toHaveBeenCalledWith(
                                'You must specify both an address and a ' +
                                'callback to unsubscribe.'
                            );
                    }
                );

                it('should log an error if the subscription address was not ' +
                    'a string', function() {
                        spyOn($log, 'error');
                        OSC.unsubscribe(42, function() {});
                        expect($log.error)
                            .toHaveBeenCalledWith(
                                'Address must be a string.'
                            );
                    }
                );

                it('should log a warning if there were no subscribers for ' +
                    'address', function() {
                        spyOn($log, 'error');
                        OSC.unsubscribe('/foo/bar', function() {});
                        expect($log.error)
                            .toHaveBeenCalledWith(
                                'There are no subscribers for OSC messages ' +
                                'to address: \'/foo/bar\''
                            );
                    }
                );
            });

            describe('message handling', function() {

                var message = {
                    oscType: 'message',
                    address: '/foo/bar',
                    args: [{
                        type: 'integer',
                        value: 42
                    }]
                };

                describe('incoming messages', function() {
                    it('should be forwarded to subscribers', function(done) {
                        var handler = function() {
                            done();
                        };
                        OSC.subscribe('/foo/bar', handler);
                        SocketIOService.receive('oscMessageReceived', message);
                    });

                    it('should include the original message', function(done) {
                        var handler = function(data) {
                            expect(data).toEqual(message);
                            done();
                        };
                        OSC.subscribe('/foo/bar', handler);
                        SocketIOService.receive('oscMessageReceived', message);
                    });

                    it('should log all unhandled messages', function() {
                        spyOn($log, 'info');
                        SocketIOService.receive('oscMessageReceived', message);
                        expect($log.info).toHaveBeenCalled();
                    });
                });

                describe('outgoing messages', function() {
                    it('should be forwarded to the socket', function() {
                        spyOn(SocketIOService, 'emit');
                        OSC.send(message);
                        expect(SocketIOService.emit.calls.argsFor(0)[0])
                            .toEqual('sendOSCMessage');
                        expect(SocketIOService.emit.calls.argsFor(0)[1])
                            .toEqual(message);
                    });

                    it('should pass a provided callback to the socket',
                        function(done) {
                            OSC.send(message, function() {
                                done();
                            });
                            SocketIOService.receive('sendOSCMessage');
                        }
                    );
                });
            });
        });
    });
})();

'use strict';

(function() {
    describe('SocketIOService', function() {

        //Initialize global variables
        var SocketIOService, socket, $rootScope;

        // Load the main application module
        beforeEach(module(ApplicationConfiguration.applicationModuleName));

        beforeEach(inject(function(_SocketIOService_, _$rootScope_) {
            SocketIOService = _SocketIOService_;
            /* global io */
            socket = io();
            $rootScope = _$rootScope_;
        }));

        describe('initialization', function() {
            it('should be defined', function() {
                expect(SocketIOService).toBeDefined();
            });
        });

        describe('methods', function() {
            it('#emit should be defined', function() {
                expect(SocketIOService.emit).toBeDefined();
            });

            it('#on should be defined', function() {
                expect(SocketIOService.on).toBeDefined();
            });

            it('#removeListener should be defined', function() {
                expect(SocketIOService.removeListener).toBeDefined();
            });
        });
    });
})();
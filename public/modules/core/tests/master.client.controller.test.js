'use strict';

(function() {
    describe('MasterController', function() {

        //Initialize global variables
        var mockScope, mockTrialData, mockHotkeys, $controllerConstructor, ExperimentManager, $httpBackend, gettextCatalog, $timeout, TrialData;

        // Load the main application module
        beforeEach(module(ApplicationConfiguration.applicationModuleName));

        beforeEach(inject(function($controller, $rootScope, _ExperimentManager_, _$httpBackend_, _gettextCatalog_, _$timeout_, _TrialData_) {
            $controllerConstructor = $controller;
            mockScope = $rootScope.$new();
            mockHotkeys = { add: function() {} };
            ExperimentManager = _ExperimentManager_;
            $httpBackend = _$httpBackend_;
            gettextCatalog = _gettextCatalog_;
            $timeout = _$timeout_;
            TrialData = _TrialData_;
            mockTrialData = { language: function() {} };
        }));

        describe('initialization', function() {

            it('should initialize $scope.debugMode to false', function() {

                $controllerConstructor('MasterController',
                    { $scope: mockScope, TrialData: mockTrialData, hotkeys: mockHotkeys });

                expect(mockScope.debugMode).toBeDefined();
                expect(mockScope.debugMode).toBe(false);
            });

            it('should initialize the alerts array to an empty array', function() {

                $controllerConstructor('MasterController',
                    { $scope: mockScope, TrialData: mockTrialData, hotkeys: mockHotkeys });

                expect(mockScope.alerts).toBeDefined();
                expect(Array.isArray(mockScope.alerts)).toBe(true);
                expect(mockScope.alerts.length).toBe(0);
            });

            it('should initialize blackoutClass to false', function() {

                $controllerConstructor('MasterController',
                    { $scope: mockScope, TrialData: mockTrialData, hotkeys: mockHotkeys });

                expect(mockScope.blackoutClass).toBe(false);
            });

            it('should call ExperimentManager#advanceSlide through $scope#advanceSlide', function() {
                var mockExperimentManager = {
                    advanceSlide: function() {}
                };

                $controllerConstructor('MasterController', {
                    $scope: mockScope,
                    TrialData: mockTrialData,
                    hotkeys: mockHotkeys,
                    ExperimentManager: mockExperimentManager
                });

                // Spy on ExperimentManager#advanceSlide and call
                // our own #advanceSlide
                spyOn(mockExperimentManager, 'advanceSlide');
                mockScope.advanceSlide();

                // Ensure that EM's was called
                expect(mockExperimentManager.advanceSlide.calls.count()).toBe(1);
            });
        });

        it('#$scope.trialDataJson should return TrialData.toJson()', function() {

            var mockTrialData = {
                toJson: function() {
                    return 'trial-data';
                },

                language: function() {}
            };

            $controllerConstructor('MasterController',
                { $scope: mockScope, TrialData: mockTrialData, hotkeys: mockHotkeys });

            expect(mockScope.trialDataJson()).toBe('trial-data');
        });

        describe('$scope#selectLanguage', function() {

            beforeEach(function() {

                spyOn(gettextCatalog, 'setCurrentLanguage');
                spyOn(TrialData, 'language');

                $controllerConstructor('MasterController', { $scope: mockScope });

                mockScope.setLanguage('zh_TW');
            });

            it('should call gettext with the correct parameter', function() {

                expect(gettextCatalog.setCurrentLanguage.calls.argsFor(0)[0]).toBe('zh_TW');
            });

            it('should set the new language on TrialData', function() {

                expect(TrialData.language.calls.argsFor(0)[0]).toBe('zh_TW');
            });
        });

        describe('#$scope.toggleDebugMode()', function() {

            beforeEach(function() {

                $controllerConstructor('MasterController',
                    { $scope: mockScope, TrialData: mockTrialData, hotkeys: mockHotkeys });
            });

            it('should toggle debugMode', function() {

                mockScope.debugMode = true;
                mockScope.toggleDebugMode();
                expect(mockScope.debugMode).toBe(false);
            });

            it('should add a notice to alerts array', function() {

                mockScope.alerts = [];
                mockScope.toggleDebugMode();
                expect(mockScope.alerts.length).toBe(1);
            });
        });

        describe('alerts', function() {

            beforeEach(function() {

                $controllerConstructor('MasterController',
                    { $scope: mockScope, TrialData: mockTrialData, hotkeys: mockHotkeys });

                mockScope.alerts = [];
            });

            describe('#$scope.addAlert()', function() {

                it('should add alerts to the alerts array', function() {

                    mockScope.addAlert({type: 'info', msg: 'Info alert'});
                    expect(mockScope.alerts.length).toBe(1);
                });

                it('should not add duplicate alerts to the alerts array', function() {

                    mockScope.addAlert({type: 'info', msg: 'Info alert'});
                    mockScope.addAlert({type: 'warn', msg: 'Warning alert'});
                    mockScope.addAlert({type: 'info', msg: 'Info alert'});
                    expect(mockScope.alerts.length).toBe(2);
                });
            });

            describe('#$scope.closeAlert()', function() {
                it('should remove the alert at the provided index', function() {

                    mockScope.alerts = ['a', 'b', 'c'];
                    mockScope.closeAlert(1);
                    expect(mockScope.alerts).toEqual(['a', 'c']);
                });
            });

            describe('#$scope.addGenericErrorAlert()', function() {
                it('should add a danger alert', function() {

                    mockScope.addGenericErrorAlert();
                    expect(mockScope.alerts[0].type).toBe('danger');
                });
            });
        });

        describe('hotkeys', function() {

            var addSpy;

            beforeEach(function() {

                addSpy = sinon.spy(mockHotkeys, 'add');

                $controllerConstructor('MasterController',
                    { $scope: {}, TrialData: mockTrialData, hotkeys: mockHotkeys });
            });

            it('should add a hotkey for d-d', function() {

                expect(addSpy.calledTwice).toBe(true);
                expect(addSpy.args[0][0].combo).toBe('d d');
            });

            it('should add a hotkey for the right arrow key', function() {

                expect(addSpy.calledTwice).toBe(true);
                expect(addSpy.args[1][0].combo).toBe('right');
            });

            it('should add a description for d-d', function() {

                expect(addSpy.args[0][0].description).toBeDefined();
            });

            it('should add a description for right', function() {

                expect(addSpy.args[1][0].description).toBeDefined();
            });

            // FIXME: Find a way to test this
            xit('should toggle debugMode on d-d', function() {

                mockScope.toggleDebugMode = function() {};

                $controllerConstructor('MasterController',
                    { $scope: mockScope, TrialData: mockTrialData, hotkeys: mockHotkeys });

                mockScope.debugMode = true;
                var ddCallback = addSpy.args[0][0].callback;
                expect(ddCallback).toBe(mockScope.toggleDebugMode);
            });

            // FIXME: Find a way to test this--callback assignment isn't using mock
            xit('should advance slide on right', function() {

                var mockExperimentManager = {
                    advanceSlide: function() { console.log('the stand-in'); },
                };

                mockTrialData.data = { schema: [] };

                $controllerConstructor('MasterController', {
                    $scope: mockScope,
                    TrialData: mockTrialData,
                    hotkeys: mockHotkeys,
                    ExperimentManager: mockExperimentManager
                });

                var advanceCallback = addSpy.args[1][0].callback;

                spyOn(mockExperimentManager, 'advanceSlide');
                advanceCallback();
                expect(mockExperimentManager.advanceSlide.calls.count()).toBe(1);
            });
        });

        describe('inactivity timeout', function() {

            var mockState, ctrl;

            beforeEach(function() {

                mockState = {
                    go: function () {}
                };

                ctrl = $controllerConstructor('MasterController', {
                    $scope: mockScope,
                    TrialData: mockTrialData,
                    hotkeys: mockHotkeys,
                    $state: mockState
                });
            });

            describe('#startOver', function () {
                it('should return to the main screen', function () {

                    spyOn(mockState, 'go');
                    ctrl.startOver();
                    expect(mockState.go.calls.count()).toBe(1);
                });

                it('should force a reload', function () {

                    spyOn(mockState, 'go');
                    ctrl.startOver();
                    expect(mockState.go.calls.argsFor(0)[2]).toEqual({reload: true});
                });
            });

            it('#resetInactivityTimeout should cancel the existing timeout', function () {

                spyOn($timeout, 'cancel');

                ctrl.resetInactivityTimeout();

                expect($timeout.cancel.calls.count()).toBe(1);
                expect($timeout.cancel.calls.argsFor(0)[0].$$timeoutId).toBe(1);
            });

            it('should exist', function () {

                expect(ctrl.inactivityTimeout).toBeDefined();
            });

            it('should be a promise', function () {

                expect(ctrl.inactivityTimeout.then).toBeDefined();
                expect(ctrl.inactivityTimeout.catch).toBeDefined();
                expect(ctrl.inactivityTimeout.finally).toBeDefined();
            });
        });

        describe('blackout', function() {

            beforeEach(function() {

                $controllerConstructor('MasterController',
                    { $scope: mockScope, TrialData: mockTrialData, hotkeys: mockHotkeys });

                $httpBackend.expect('GET', 'modules/core/views/home.client.view.html').respond();
            });

           it('#$scope.hideBody() should set blackoutClass to true', function() {

               mockScope.blackoutClass = false;

               mockScope.hideBody();
               expect(mockScope.blackoutClass).toBe(true);
           });

            it('#$scope.showBody() should set blackoutClass to false', function() {

                mockScope.blackoutClass = true;

                mockScope.showBody();
                expect(mockScope.blackoutClass).toBe(false);
            });

            it('#$scope.toggleBodyVisibility() should toggle blackoutClass between true and false', function() {

                mockScope.blackoutClass = true;

                mockScope.toggleBodyVisibility();
                expect(mockScope.blackoutClass).toBe(false);
                mockScope.toggleBodyVisibility();
                expect(mockScope.blackoutClass).toBe(true);
            });
        });
    });
})();
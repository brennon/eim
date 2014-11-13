'use strict';

(function() {
    describe('MasterController', function() {

        //Initialize global variables
        var mockScope, mockHotkeys, $controllerConstructor, ExperimentManager, $httpBackend, gettextCatalog;

        // Load the main application module
        beforeEach(module(ApplicationConfiguration.applicationModuleName));

        beforeEach(inject(function($controller, $rootScope, _ExperimentManager_, _$httpBackend_, _gettextCatalog_) {
            $controllerConstructor = $controller;
            mockScope = $rootScope.$new();
            mockHotkeys = { add: function() {} };
            ExperimentManager = _ExperimentManager_;
            $httpBackend = _$httpBackend_;
            gettextCatalog = _gettextCatalog_;
        }));

        describe('initialization', function() {

            it('should initialize $scope.debugMode to false', function() {

                $controllerConstructor('MasterController',
                    { $scope: mockScope, TrialData: {}, hotkeys: mockHotkeys });

                expect(mockScope.debugMode).toBeDefined();
                expect(mockScope.debugMode).toBe(false);
            });

            it('should initialize the alerts array to an empty array', function() {

                $controllerConstructor('MasterController',
                    { $scope: mockScope, TrialData: {}, hotkeys: mockHotkeys });

                expect(mockScope.alerts).toBeDefined();
                expect(Array.isArray(mockScope.alerts)).toBe(true);
                expect(mockScope.alerts.length).toBe(0);
            });

            it('should initialize blackoutClass to false', function() {

                $controllerConstructor('MasterController',
                    { $scope: mockScope, TrialData: {}, hotkeys: mockHotkeys });

                expect(mockScope.blackoutClass).toBe(false);
            });

            it('should bind $scope.advanceSlide to the ExperimentManager', function() {
                $controllerConstructor('MasterController',
                    { $scope: mockScope, TrialData: {}, hotkeys: mockHotkeys });

                expect(mockScope.advanceSlide).toBe(ExperimentManager.advanceSlide);
            });
        });

        it('#$scope.trialDataJson should return TrialData.toJson()', function() {

            var mockTrialData = { toJson: function() {
                return 'trial-data';
            } };

            $controllerConstructor('MasterController',
                { $scope: mockScope, TrialData: mockTrialData, hotkeys: mockHotkeys });

            expect(mockScope.trialDataJson()).toBe('trial-data');
        });

        describe('$scope#selectLanguage', function() {
            it('should call gettext with the correct parameter', function() {
                $controllerConstructor('MasterController',
                    { $scope: mockScope });

                spyOn(gettextCatalog, 'setCurrentLanguage');

                mockScope.setLanguage('foo');

                expect(gettextCatalog.setCurrentLanguage.calls.argsFor(0)[0]).toBe('foo');
            });
        });

        describe('#$scope.toggleDebugMode()', function() {

            it('should toggle debugMode', function() {
                $controllerConstructor('MasterController',
                    { $scope: mockScope, TrialData: {}, hotkeys: mockHotkeys });

                mockScope.debugMode = true;
                mockScope.toggleDebugMode();
                expect(mockScope.debugMode).toBe(false);
            });

            it('should add a notice to alerts array', function() {

                $controllerConstructor('MasterController',
                    { $scope: mockScope, TrialData: {}, hotkeys: mockHotkeys });
                mockScope.alerts = [];
                mockScope.toggleDebugMode();
                expect(mockScope.alerts.length).toBe(1);
            });
        });

        describe('alerts', function() {
            describe('#$scope.addAlert()', function() {
                it('should add alerts to the alerts array', function() {

                    $controllerConstructor('MasterController',
                        { $scope: mockScope, TrialData: {}, hotkeys: mockHotkeys });

                    mockScope.alerts = [];
                    mockScope.addAlert({type: 'info', msg: 'Info alert'});
                    expect(mockScope.alerts.length).toBe(1);
                });

                it('should not add duplicate alerts to the alerts array', function() {

                    $controllerConstructor('MasterController',
                        { $scope: mockScope, TrialData: {}, hotkeys: mockHotkeys });

                    mockScope.alerts = [];
                    mockScope.addAlert({type: 'info', msg: 'Info alert'});
                    mockScope.addAlert({type: 'warn', msg: 'Warning alert'});
                    mockScope.addAlert({type: 'info', msg: 'Info alert'});
                    expect(mockScope.alerts.length).toBe(2);
                });
            });

            describe('#$scope.closeAlert()', function() {
                it('should remove the alert at the provided index', function() {

                    $controllerConstructor('MasterController',
                        { $scope: mockScope, TrialData: {}, hotkeys: mockHotkeys });

                    mockScope.alerts = ['a', 'b', 'c'];
                    mockScope.closeAlert(1);
                    expect(mockScope.alerts).toEqual(['a', 'c']);
                });
            });

            describe('#$scope.addGenericErrorAlert()', function() {
                it('should add a danger alert', function() {

                    $controllerConstructor('MasterController',
                        { $scope: mockScope, TrialData: {}, hotkeys: mockHotkeys });

                    mockScope.alerts = [];
                    mockScope.addGenericErrorAlert();
                    expect(mockScope.alerts[0].type).toBe('danger');
                });
            });
        });

        describe('hotkeys', function() {
            it('should add a hotkey for d-d', function() {

                var addSpy = sinon.spy(mockHotkeys, 'add');

                $controllerConstructor('MasterController',
                    { $scope: {}, TrialData: {}, hotkeys: mockHotkeys });

                expect(addSpy.calledTwice).toBe(true);
                expect(addSpy.args[0][0].combo).toBe('d d');
            });

            it('should add a hotkey for the right arrow key', function() {

                var addSpy = sinon.spy(mockHotkeys, 'add');

                $controllerConstructor('MasterController',
                    { $scope: {}, TrialData: {}, hotkeys: mockHotkeys });

                expect(addSpy.calledTwice).toBe(true);
                expect(addSpy.args[1][0].combo).toBe('right');
            });

            it('should add a description for d-d', function() {

                var addSpy = sinon.spy(mockHotkeys, 'add');

                $controllerConstructor('MasterController',
                    { $scope: {}, TrialData: {}, hotkeys: mockHotkeys });

                expect(addSpy.args[0][0].description).toBeDefined();
            });

            it('should add a description for right', function() {

                var addSpy = sinon.spy(mockHotkeys, 'add');

                $controllerConstructor('MasterController',
                    { $scope: {}, TrialData: {}, hotkeys: mockHotkeys });

                expect(addSpy.args[1][0].description).toBeDefined();
            });

            it('should toggle debugMode on d-d', function() {

                var addSpy = sinon.spy(mockHotkeys, 'add');

                $controllerConstructor('MasterController',
                    { $scope: mockScope, TrialData: {}, hotkeys: mockHotkeys });

                mockScope.debugMode = true;
                var ddCallback = addSpy.args[0][0].callback;
                expect(ddCallback).toBe(mockScope.toggleDebugMode);
            });

            it('should advance slide on right', function() {

                var addSpy = sinon.spy(mockHotkeys, 'add');

                $controllerConstructor('MasterController',
                    { $scope: mockScope, TrialData: {}, hotkeys: mockHotkeys });

                var advanceCallback = addSpy.args[1][0].callback;
                expect(advanceCallback).toBe(ExperimentManager.advanceSlide);
            });
        });

        describe('blackout', function() {
           it('#$scope.hideBody() should set blackoutClass to true', function() {

               $controllerConstructor('MasterController',
                   { $scope: mockScope, TrialData: {}, hotkeys: mockHotkeys });

               mockScope.blackoutClass = false;

               $httpBackend.expect('GET', 'modules/core/views/home.client.view.html').respond();

               mockScope.hideBody();
               expect(mockScope.blackoutClass).toBe(true);
           });

            it('#$scope.showBody() should set blackoutClass to false', function() {

                $controllerConstructor('MasterController',
                    { $scope: mockScope, TrialData: {}, hotkeys: mockHotkeys });

                mockScope.blackoutClass = true;

                $httpBackend.expect('GET', 'modules/core/views/home.client.view.html').respond();

                mockScope.showBody();
                expect(mockScope.blackoutClass).toBe(false);
            });

            it('#$scope.toggleBodyVisibility() should toggle blackoutClass between true and false', function() {

                $controllerConstructor('MasterController',
                    { $scope: mockScope, TrialData: {}, hotkeys: mockHotkeys });

                mockScope.blackoutClass = true;

                $httpBackend.expect('GET', 'modules/core/views/home.client.view.html').respond();

                mockScope.toggleBodyVisibility();
                expect(mockScope.blackoutClass).toBe(false);
                mockScope.toggleBodyVisibility();
                expect(mockScope.blackoutClass).toBe(true);
            });
        });
    });
})();
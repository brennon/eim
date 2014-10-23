'use strict';

(function() {
    describe('ExperimentManager', function() {

        //Initialize global variables
        var ExperimentManager, mockTrialData, $state, $httpBackend, $rootScope;

        // Load the main application module
        beforeEach(module(ApplicationConfiguration.applicationModuleName));

        beforeEach(function() {
            mockTrialData = {
                reset: function() {
                },
                data: {
                    metadata: {
                        session_number: null
                    },
                    state: {
                        currentSlideIndex: 0
                    },
                    schema: [
                        {
                            name: 'home'
                        },
                        {
                            name: 'start'
                        },
                        {
                            name: 'end'
                        }
                    ]
                }
            };

            module(function($provide) {
                $provide.value('TrialData', mockTrialData);
            });

            inject(function(_ExperimentManager_, _$state_, _$httpBackend_, _$rootScope_) {
                ExperimentManager = _ExperimentManager_;
                $state = _$state_;
                $httpBackend = _$httpBackend_;
                $rootScope = _$rootScope_;
            });
        });

        describe('initialization', function() {
            it('should be defined', function() {
                expect(ExperimentManager).toBeDefined();
            });
        });

        describe('#advanceSlide', function() {
            it('should be defined', function() {
                expect(ExperimentManager.advanceSlide).toBeDefined();
            });

            it('should increment TrialData.data.state.currentSlideIndex', function() {
                mockTrialData.data.state.currentSlideIndex = 0;
                ExperimentManager.advanceSlide();
                expect(mockTrialData.data.state.currentSlideIndex).toBe(1);
            });

            it('should go home if TrialData says we\'re on the last slide', function() {
                spyOn($state, 'go');

                mockTrialData.data.state.currentSlideIndex = 2;

                ExperimentManager.advanceSlide();

                expect($state.go.calls.argsFor(0)[0]).toBe('home');
            });

            it('should go to the next state if TrialData says we\'re not on the last slide', function() {
                spyOn($state, 'go');

                mockTrialData.data.state.currentSlideIndex = 1;

                ExperimentManager.advanceSlide();

                expect($state.go.calls.argsFor(0)[0]).toBe('end');
            });
        });

        describe('#masterReset', function() {
            it('should be defined', function() {
                expect(ExperimentManager.masterReset).toBeDefined();
            });

            it('should reset TrialData', function() {
                spyOn(mockTrialData, 'reset');
                ExperimentManager.masterReset();
                expect(mockTrialData.reset.calls.count()).toBe(1);
            });

            it('should generate a session ID', function() {
                spyOn(UUID, 'generate');
                ExperimentManager.masterReset();
                expect(UUID.generate.calls.count()).toBe(1);
            });

            it('should set the session ID on TrialData', function() {
                mockTrialData.data.metadata.session_number = null;
                ExperimentManager.masterReset();
                expect(mockTrialData.data.metadata.session_number).not.toBeNull();
            });

            describe('fetching experiment schemas', function() {
                it('should fetch an experiment schema', function() {
                    $httpBackend.expectGET('modules/core/views/home.client.view.html').respond();
                    $httpBackend.verifyNoOutstandingExpectation();
                    $httpBackend.expectGET('/api/experiment-schemas/random').respond();
                    ExperimentManager.masterReset();
                    $httpBackend.verifyNoOutstandingExpectation();
                });

                describe('on success', function() {
                    it('should assign the set of media from the experiment schema to TrialData', function() {
                        $httpBackend.expectGET('modules/core/views/home.client.view.html').respond();
                        $httpBackend.flush();
                        mockTrialData.data.media = [];
                        $httpBackend.expectGET('/api/experiment-schemas/random').respond({
                            media: ['one','two']
                        });
                        ExperimentManager.masterReset();
                        $httpBackend.flush();
                        $httpBackend.verifyNoOutstandingExpectation();
                        expect(mockTrialData.data.media).toEqual(['one','two']);
                    });

                    it('should assign the schema from the experiment schema to TrialData', function() {
                        $httpBackend.expectGET('modules/core/views/home.client.view.html').respond();
                        $httpBackend.flush();
                        mockTrialData.data.schema = [];
                        $httpBackend.expectGET('/api/experiment-schemas/random').respond({
                            structure: ['one','two']
                        });
                        ExperimentManager.masterReset();
                        $httpBackend.flush();
                        $httpBackend.verifyNoOutstandingExpectation();
                        expect(mockTrialData.data.schema).toEqual(['one','two']);
                    });

                    it('should resolve the promise', function(done) {
                        $httpBackend.expectGET('modules/core/views/home.client.view.html').respond();
                        $httpBackend.flush();
                        $httpBackend.expectGET('/api/experiment-schemas/random').respond({
                            data: null,
                            media: null
                        });
                        ExperimentManager.masterReset().then(function() {
                            done();
                        });
                        $httpBackend.flush();
                    });
                });

                describe('on failure', function() {
                    it('should reject the promise', function(done) {
                        $httpBackend.expectGET('modules/core/views/home.client.view.html').respond();
                        $httpBackend.flush();
                        $httpBackend.expectGET('/api/experiment-schemas/random').respond(404);
                        ExperimentManager.masterReset().catch(function() {
                            done();
                        });
                        $httpBackend.flush();
                    });
                });
            });

            it('should return a promise-like object', function() {
                var returnValue = ExperimentManager.masterReset();
                expect(returnValue.then).toBeDefined();
                expect(typeof returnValue.then).toBe('function');
                expect(returnValue.catch).toBeDefined();
                expect(typeof returnValue.catch).toBe('function');
                expect(returnValue.finally).toBeDefined();
                expect(typeof returnValue.finally).toBe('function');
            });
        });
    });
})();
'use strict';

(function() {
    describe('TrialData', function() {

        //Initialize global variables
        var TrialData;
        var blankDataObject = {
            answers: {},

            date: null,
            media: [],
            timestamps: {
                start: null,
                test: null,
                media: [],
                end: null
            },
            metadata: {
                language: null,
                session_number: null,
                location: null,
                terminal: null
            },
            state: {
                currentSlideIndex: -1,
                mediaPlayCount: 0
            }
        };

        // Load the main application module
        beforeEach(module(ApplicationConfiguration.applicationModuleName));

        beforeEach(inject(function(_TrialData_) {
            TrialData = _TrialData_;
        }));

        describe('initialization', function() {
            it('should be defined', function() {
                expect(TrialData).toBeDefined();
            });

            it('should return an object with a properly formatted data member', function() {
                expect(TrialData.data).toBeDefined();
                expect(TrialData.data.metadata).toBeDefined();
                expect(TrialData.data.metadata.language).toBeDefined();
                expect(TrialData.data.state).toBeDefined();
                expect(TrialData.data.answers).toBeDefined();
                expect(TrialData.data.date).toBeNull();
                expect(TrialData.data.media).toBeDefined();
                expect(TrialData.data.media.length).toBe(0);
                expect(TrialData.data.timestamps).toBeDefined();
                expect(TrialData.data.timestamps.start).toBeNull();
                expect(TrialData.data.timestamps.test).toBeNull();
                expect(TrialData.data.timestamps.end).toBeNull();
                expect(TrialData.data.timestamps.media).toBeDefined();
                expect(TrialData.data.timestamps.media.length).toBe(0);
                expect(TrialData.data.metadata.session_number).toBeNull();
                expect(TrialData.data.metadata.location).toBeNull();
                expect(TrialData.data.metadata.terminal).toBeNull();
                expect(TrialData.data.state.currentSlideIndex).toBe(-1);
                expect(TrialData.data.state.mediaPlayCount).toBe(0);
            });
        });
        
        describe('metadata', function() {
            
            describe('#language', function() {
                
                it('should set the language when a string argument is passed', function() {

                    TrialData.data.metadata.language = '';
                    TrialData.language('zh_TW');
                    expect(TrialData.data.metadata.language).toBe('zh_TW');
                });

                it('should return the current language when no argument is passed', function() {

                    TrialData.data.metadata.language = 'es_CL';
                    expect(TrialData.language()).toBe('es_CL');
                });
            });
        });

        describe('#toJson', function() {
            it('should be defined', function() {
                expect(TrialData.toJson).toBeDefined();
                expect(typeof TrialData.toJson).toBe('function');
            });

            it('should return a JSON representation of the data property',
                function() {
                    var mockData = {foo: 'bar'};
                    TrialData.data = mockData;
                    expect(TrialData.toJson()).toEqual(angular.toJson(mockData, true));
                }
            );
        });

        describe('#toJsonCompact', function() {
            it('should return a compact JSON representation of the data ' +
                'property', function() {
                    TrialData.data = {
                        foo: 'bar',
                        numbers: {
                            un: 'one',
                            deux: 'two'
                        },
                        bad: 'property'
                    };
                    TrialData.exportedProperties = ['foo', 'numbers'];

                    expect(TrialData.toJsonCompact())
                        .toEqual(angular.toJson({
                            foo: 'bar',
                            numbers: {
                                un: 'one',
                                deux: 'two'
                            }
                        }, true));
                }
            );

            it('should return toJson if no exported properties are set',
                function() {
                    TrialData.data = {
                        foo: 'bar',
                        numbers: {
                            un: 'one',
                            deux: 'two,'
                        },
                        bad: 'property'
                    };
                    TrialData.exportedProperties = [];

                    expect(TrialData.toJsonCompact())
                        .toEqual(TrialData.toJson());
                }
            );
        });

        describe('#toJsonCompact', function() {
            it('should return a compact copy of the data property', function() {
                    TrialData.data = {
                        foo: 'bar',
                        numbers: {
                            un: 'one',
                            deux: 'two,'
                        },
                        bad: 'property'
                    };
                    TrialData.exportedProperties = ['foo', 'numbers'];

                    expect(TrialData.toCompact())
                        .toEqual({
                            foo: 'bar',
                            numbers: {
                                un: 'one',
                                deux: 'two,'
                            }
                        });
            });

            it('should return a compact copy of the data property', function() {
                TrialData.data = {
                    foo: 'bar',
                    numbers: {
                        un: 'one',
                        deux: 'two,'
                    },
                    bad: 'property'
                };
                TrialData.exportedProperties = [];

                expect(TrialData.toCompact())
                    .toEqual(TrialData.data);
            });
        });

        describe('#reset', function() {
            it('should be defined', function() {
                expect(TrialData.reset).toBeDefined();
                expect(typeof TrialData.reset).toBe('function');
            });

            it('should return a blank data object', function() {
                TrialData.data = {foo: 'bar'};
                TrialData.reset();
                expect(TrialData.data).toEqual(blankDataObject);
            });
        });

        describe('data persistence', function() {
            it('should persist changes to the data property', function() {
                TrialData.data.answers.musical_expertise = 'damn good';
                expect(TrialData.data.answers.musical_expertise).toBe('damn good');
            });

            describe('#setValueForPath', function() {
                it('should set a simple path\'s value', function() {
                    TrialData.data.answers.hearing_impairments = false;
                    TrialData.setValueForPath('data.answers.hearing_impairments', true);
                    expect(TrialData.data.answers.hearing_impairments).toBe(true);
                });

                it('shouldn\'t do anything if a value is not supplied', function() {
                    TrialData.data.answers.hearing_impairments = false;
                    TrialData.setValueForPath('data.answers.hearing_impairments');
                    expect(TrialData.data.answers.hearing_impairments).toBe(false);
                });

                it('should correctly set a value for deep path that doesn\'t yet exist', function() {
                    TrialData.setValueForPath('foo.bar.baz', 42);
                    expect(TrialData.foo.bar.baz).toBe(42);
                });

                it('should set a simple path\'s value and respect the array_index option', function() {
                    TrialData.data.answers.emotion_indices = ['a','b','c'];
                    TrialData.setValueForPath('data.answers.emotion_indices', 'z', {array_index:2});
                    expect(TrialData.data.answers.emotion_indices[2]).toBe('z');
                });

                it('should convert "true" to boolean true', function() {
                    TrialData.data.answers.emotion_indices = ['a','b','c'];
                    TrialData.setValueForPath('data.answers.emotion_indices', 'true', {array_index:2});
                    expect(TrialData.data.answers.emotion_indices[2]).toBe(true);
                });

                it('should convert "false" to boolean false', function() {
                    TrialData.data.answers.emotion_indices = ['a','b','c'];
                    TrialData.setValueForPath('data.answers.emotion_indices', 'false', {array_index:2});
                    expect(TrialData.data.answers.emotion_indices[2]).toBe(false);
                });

                it('should convert a integer string to a number', function() {
                    TrialData.data.answers.emotion_indices = ['a','b','c'];
                    TrialData.setValueForPath('data.answers.emotion_indices', '42', {array_index:2});
                    expect(TrialData.data.answers.emotion_indices[2]).toBe(42);
                });

                it('should convert a float string to a number', function() {
                    TrialData.data.answers.emotion_indices = ['a','b','c'];
                    TrialData.setValueForPath('data.answers.emotion_indices', '42.24', {array_index:2});
                    expect(TrialData.data.answers.emotion_indices[2]).toBe(42.24);
                });

                it('should downcase simple strings', function() {
                    TrialData.data.answers.emotion_indices = ['a','b','c'];
                    TrialData.setValueForPath('data.answers.emotion_indices', 'Brennon Bortz', {array_index:2});
                    expect(TrialData.data.answers.emotion_indices[2]).toBe('brennon bortz');
                });
            });

            describe('#setValueForPathForCurrentMedia', function() {
                it('should set a simple path\'s value when no media have played', function() {
                    TrialData.data.answers.emotion_indices = ['a','b','c'];
                    TrialData.data.state.mediaPlayCount = 0;
                    TrialData.setValueForPathForCurrentMedia('data.answers.emotion_indices', 'z');
                    expect(TrialData.data.answers.emotion_indices[0]).toBe('z');
                });

                it('should set a simple path\'s value for the first index with a blank data object', function() {
                    TrialData.data.answers.emotion_indices = ['a','b','c'];
                    TrialData.setValueForPathForCurrentMedia('data.answers.emotion_indices', 'z');
                    expect(TrialData.data.answers.emotion_indices[0]).toBe('z');
                });

                it('should set a simple path\'s value when some media have played', function() {
                    TrialData.data.answers.emotion_indices = ['a','b','c'];
                    TrialData.data.state.mediaPlayCount = 2;
                    TrialData.setValueForPathForCurrentMedia('data.answers.emotion_indices', 'z');
                    expect(TrialData.data.answers.emotion_indices[1]).toBe('z');
                });

                it('should set a path\'s value when the array doesn\'t yet exist', function() {
                    TrialData.data.state.mediaPlayCount = 0;
                    TrialData.setValueForPathForCurrentMedia('data.answers.ratings.foo', false);
                    expect(TrialData.data.answers.ratings.foo[0]).toBe(false);
                });

                it('should expand an array to include a new value', function() {
                    TrialData.data.answers.emotion_indices = [];
                    TrialData.data.state.mediaPlayCount = 2;
                    TrialData.setValueForPathForCurrentMedia('data.answers.emotion_indices', '42');
                    expect(TrialData.data.answers.emotion_indices).toEqual([null, 42]);
                });
            });
        });
    });
})();
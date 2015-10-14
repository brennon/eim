/**
 * Created by brennon on 10/13/15.
 */

'use strict';

(function() {
    describe('ExperimentManager', function() {

        // Load the main application module
        beforeEach(module(ApplicationConfiguration.applicationModuleName));

        it('should exist', function() {
            expect(function() {
                inject(function(_ExperimentValidator_) {});
            }).not.toThrow();
        });

        ////Initialize global variables
        //var Experiment, mockTrialData, $state, $httpBackend,
        //    $rootScope, rfc4122;
        //
        var ExperimentValidator, validSchema;
        var validSchemaGenerator = function validSchemaGeneratorFn() {
            return {
                structure: [
                     {
                         name: 'consent-form'
                     },
                    //// Questionnaire
                    //// - Must have a data property that is a non-empty string
                    //// Questionnaire data
                    //// - Must have a title property that is a non-empty string
                    //// - Must have a structure property that is a non-empty array
                    //// Questionnaire data structure entry
                    //
                    // {
                    //    'name': 'questionnaire',
                    //    'data': {
                    //        'title': 'Personal Details',
                    //        'structure': [{
                    //            'questionType': 'radio',
                    //            'questionId': 'gender',
                    //            'questionLabel': 'Gender',
                    //            'questionOptions': {
                    //                'choices': [{
                    //                    'label': 'Male',
                    //                    'value': 'male'
                    //                }, {'label': 'Female', 'value': 'female'}]
                    //            },
                    //            'questionStoragePath': 'data.answers.sex'
                    //        }, {
                    //            'questionType': 'dropdown',
                    //            'questionId': 'nationality',
                    //            'questionLabel': 'Nationality',
                    //            'questionOptions': {
                    //                'choices': [
                    //                    {
                    //                        'label': 'Taiwanese',
                    //                        'value': 'Taiwanese'
                    //                    }, {
                    //                        'label': 'Afghan',
                    //                        'value': 'Afghan'
                    //                    }
                    //                ]
                    //            },
                    //            'questionStoragePath': 'data.answers.nationality'
                    //        }, {
                    //            'questionType': 'dropdown',
                    //            'questionId': 'age',
                    //            'questionLabel': 'Age',
                    //            'questionOptions': {
                    //                'choices': [
                    //                    {
                    //                        'label': 1,
                    //                        'value': 1
                    //                    }, {'label': 2, 'value': 2}
                    //                ]
                    //            },
                    //            'questionStoragePath': 'data.answers.age'
                    //        }]
                    //    }
                    //}
                    //,{
                    //    'name': 'questionnaire',
                    //    'data': {
                    //        'title': 'Musical Background',
                    //        'structure': [{
                    //            'questionType': 'likert',
                    //            'questionId': 'musicalExpertise',
                    //            'questionLabel': 'How would you rate your musical expertise?',
                    //            'questionLabelType': 'labelLeft',
                    //            'questionLikertMinimumDescription': 'No expertise whatsoever',
                    //            'questionLikertMaximumDescription': 'An expert',
                    //            'questionStoragePath': 'data.answers.musical_expertise'
                    //        }, {
                    //            'questionType': 'radio',
                    //            'questionId': 'hearingImpairments',
                    //            'questionLabel': 'Do you have any hearing impairments? (If so, you may still participate in the experiment!)',
                    //            'questionOptions': {
                    //                'choices': [{
                    //                    'label': 'Yes',
                    //                    'value': true
                    //                }, {'label': 'No', 'value': false}]
                    //            },
                    //            'questionStoragePath': 'data.answers.hearing_impairments'
                    //        }]
                    //    }
                    //}, {
                    //    'name': 'questionnaire',
                    //    'data': {
                    //        'title': 'Additional Questions',
                    //        'introductoryText': 'How well do the following statements describe your personality?',
                    //        'structure': [{
                    //            'questionType': 'likert',
                    //            'questionId': 'reserved',
                    //            'questionLabel': 'I see myself as someone who is reserved.',
                    //            'questionLabelType': 'labelLeft',
                    //            'questionStoragePath': 'data.answers.personality.reserved',
                    //            'questionOptions': {'choices': [{'label': 'Disagree strongly'}, {'label': 'Disagree a little'}, {'label': 'Neither agree nor disagree'}, {'label': 'Agree a little'}, {'label': 'Agree strongly'}]}
                    //        }]
                    //    }
                    //}, {
                    //    'name': 'media-playback',
                    //    'mediaType': 'fixed',
                    //    'media': '547c92416577a50a2ebde517'
                    //}, {
                    //    'name': 'questionnaire',
                    //    'data': {
                    //        'title': 'Media Questions',
                    //        'introductoryText': 'This questionnaire uses some simple scales to find out how you responded to the media excerpt. We will compare your responses to the biosignals that we measured as you were listening.',
                    //        'structure': [{
                    //            'questionType': 'likert',
                    //            'questionId': 'engaged',
                    //            'questionLikertMinimumDescription': 'Not at all engaged, my mind was elsewhere',
                    //            'questionLikertMaximumDescription': 'I was engaged with it and responding to it emotionally',
                    //            'questionLikertLeftImageSrc': '/modules/core/img/scale-left-engaged.png',
                    //            'questionLikertRightImageSrc': '/modules/core/img/scale-right-engaged.png',
                    //            'questionLabel': 'How involved and engaged were you with what you have just heard?',
                    //            'questionStoragePath': 'data.answers.ratings.engagement',
                    //            'questionIsAssociatedToMedia': true,
                    //            'questionOptions': {'choices': [{'label': '1'}, {'label': '2'}, {'label': '3'}, {'label': '4'}, {'label': '5'}]}
                    //        }, {
                    //            'questionType': 'likert',
                    //            'questionId': 'positivity',
                    //            'questionLikertMinimumDescription': 'Very negative',
                    //            'questionLikertMaximumDescription': 'Very positive',
                    //            'questionLikertUseImage': true,
                    //            'questionLikertSingleImageSrc': '/modules/core/img/scale-above-positivity.png',
                    //            'questionLabel': 'How positive or negative did what you have just heard make you feel?',
                    //            'questionStoragePath': 'data.answers.ratings.positivity',
                    //            'questionIsAssociatedToMedia': true,
                    //            'questionOptions': {'choices': [{'label': '1'}, {'label': '2'}, {'label': '3'}, {'label': '4'}, {'label': '5'}]}
                    //        }, {
                    //            'questionType': 'likert',
                    //            'questionId': 'activity',
                    //            'questionLikertMinimumDescription': 'Very drowsy',
                    //            'questionLikertMaximumDescription': 'Very lively',
                    //            'questionLikertSingleImageSrc': '/modules/core/img/scale-above-drowsylively.png',
                    //            'questionLabel': 'How active or passive did what you have just heard make you feel?',
                    //            'questionStoragePath': 'data.answers.ratings.activity',
                    //            'questionIsAssociatedToMedia': true,
                    //            'questionOptions': {'choices': [{'label': '1'}, {'label': '2'}, {'label': '3'}, {'label': '4'}, {'label': '5'}]}
                    //        }, {
                    //            'questionType': 'likert',
                    //            'questionId': 'power',
                    //            'questionLikertMinimumDescription': 'Weak (without control, submissive)',
                    //            'questionLikertMaximumDescription': 'Empowered (in control of everything, dominant)',
                    //            'questionLikertSingleImageSrc': '/modules/core/img/scale-above-power.png',
                    //            'questionLabel': 'How in control did you feel?',
                    //            'questionStoragePath': 'data.answers.ratings.power',
                    //            'questionIsAssociatedToMedia': true,
                    //            'questionOptions': {'choices': [{'label': '1'}, {'label': '2'}, {'label': '3'}, {'label': '4'}, {'label': '5'}]}
                    //        }, {
                    //            'questionType': 'likert',
                    //            'questionId': 'tension',
                    //            'questionLikertMinimumDescription': 'Very tense',
                    //            'questionLikertMaximumDescription': 'Very relaxed',
                    //            'questionLabel': 'How tense or relaxed did you feel while you were listening?',
                    //            'questionStoragePath': 'data.answers.ratings.tension',
                    //            'questionIsAssociatedToMedia': true,
                    //            'questionOptions': {'choices': [{'label': '1'}, {'label': '2'}, {'label': '3'}, {'label': '4'}, {'label': '5'}]}
                    //        }, {
                    //            'questionType': 'likert',
                    //            'questionId': 'likeDislike',
                    //            'questionLikertMinimumDescription': 'I hated it',
                    //            'questionLikertMaximumDescription': 'I loved it',
                    //            'questionLabel': 'How much did you like/dislike what you have just heard?',
                    //            'questionStoragePath': 'data.answers.ratings.like_dislike',
                    //            'questionIsAssociatedToMedia': true,
                    //            'questionOptions': {'choices': [{'label': '1'}, {'label': '2'}, {'label': '3'}, {'label': '4'}, {'label': '5'}]}
                    //        }]
                    //    }
                    //}, {
                    //    'name': 'media-playback',
                    //    'mediaType': 'random'
                    //}, {
                    //    'name': 'questionnaire',
                    //    'data': {
                    //        'title': 'Media Questions',
                    //        'introductoryText': 'This questionnaire uses some simple scales to find out how you responded to the media excerpt. We will compare your responses to the biosignals that we measured as you were listening.',
                    //        'structure': [{
                    //            'questionType': 'likert',
                    //            'questionId': 'engaged',
                    //            'questionLikertMinimumDescription': 'Not at all engaged, my mind was elsewhere',
                    //            'questionLikertMaximumDescription': 'I was engaged with it and responding to it emotionally',
                    //            'questionLikertLeftImageSrc': '/modules/core/img/scale-left-engaged.png',
                    //            'questionLikertRightImageSrc': '/modules/core/img/scale-right-engaged.png',
                    //            'questionLabel': 'How involved and engaged were you with what you have just heard?',
                    //            'questionStoragePath': 'data.answers.ratings.engagement',
                    //            'questionIsAssociatedToMedia': true,
                    //            'questionOptions': {'choices': [{'label': '1'}, {'label': '2'}, {'label': '3'}, {'label': '4'}, {'label': '5'}]}
                    //        }, {
                    //            'questionType': 'likert',
                    //            'questionId': 'positivity',
                    //            'questionLikertMinimumDescription': 'Very negative',
                    //            'questionLikertMaximumDescription': 'Very positive',
                    //            'questionLikertUseImage': true,
                    //            'questionLikertSingleImageSrc': '/modules/core/img/scale-above-positivity.png',
                    //            'questionLabel': 'How positive or negative did what you have just heard make you feel?',
                    //            'questionStoragePath': 'data.answers.ratings.positivity',
                    //            'questionIsAssociatedToMedia': true,
                    //            'questionOptions': {'choices': [{'label': '1'}, {'label': '2'}, {'label': '3'}, {'label': '4'}, {'label': '5'}]}
                    //        }, {
                    //            'questionType': 'likert',
                    //            'questionId': 'activity',
                    //            'questionLikertMinimumDescription': 'Very drowsy',
                    //            'questionLikertMaximumDescription': 'Very lively',
                    //            'questionLikertSingleImageSrc': '/modules/core/img/scale-above-drowsylively.png',
                    //            'questionLabel': 'How active or passive did what you have just heard make you feel?',
                    //            'questionStoragePath': 'data.answers.ratings.activity',
                    //            'questionIsAssociatedToMedia': true,
                    //            'questionOptions': {'choices': [{'label': '1'}, {'label': '2'}, {'label': '3'}, {'label': '4'}, {'label': '5'}]}
                    //        }, {
                    //            'questionType': 'likert',
                    //            'questionId': 'power',
                    //            'questionLikertMinimumDescription': 'Weak (without control, submissive)',
                    //            'questionLikertMaximumDescription': 'Empowered (in control of everything, dominant)',
                    //            'questionLikertSingleImageSrc': '/modules/core/img/scale-above-power.png',
                    //            'questionLabel': 'How in control did you feel?',
                    //            'questionStoragePath': 'data.answers.ratings.power',
                    //            'questionIsAssociatedToMedia': true,
                    //            'questionOptions': {'choices': [{'label': '1'}, {'label': '2'}, {'label': '3'}, {'label': '4'}, {'label': '5'}]}
                    //        }, {
                    //            'questionType': 'likert',
                    //            'questionId': 'tension',
                    //            'questionLikertMinimumDescription': 'Very tense',
                    //            'questionLikertMaximumDescription': 'Very relaxed',
                    //            'questionLabel': 'How tense or relaxed did you feel while you were listening?',
                    //            'questionStoragePath': 'data.answers.ratings.tension',
                    //            'questionIsAssociatedToMedia': true,
                    //            'questionOptions': {'choices': [{'label': '1'}, {'label': '2'}, {'label': '3'}, {'label': '4'}, {'label': '5'}]}
                    //        }, {
                    //            'questionType': 'likert',
                    //            'questionId': 'likeDislike',
                    //            'questionLikertMinimumDescription': 'I hated it',
                    //            'questionLikertMaximumDescription': 'I loved it',
                    //            'questionLabel': 'How much did you like/dislike what you have just heard?',
                    //            'questionStoragePath': 'data.answers.ratings.like_dislike',
                    //            'questionIsAssociatedToMedia': true,
                    //            'questionOptions': {'choices': [{'label': '1'}, {'label': '2'}, {'label': '3'}, {'label': '4'}, {'label': '5'}]}
                    //        }, {
                    //            'questionType': 'likert',
                    //            'questionId': 'familiarity',
                    //            'questionLikertMinimumDescription': 'I had never heard it before',
                    //            'questionLikertMaximumDescription': 'I listen to it regularly',
                    //            'questionLabel': 'How familiar are you with what you have just heard?',
                    //            'questionStoragePath': 'data.answers.ratings.familiarity',
                    //            'questionIsAssociatedToMedia': true,
                    //            'questionOptions': {'choices': [{'label': '1'}, {'label': '2'}, {'label': '3'}, {'label': '4'}, {'label': '5'}]}
                    //        }]
                    //    }
                    //}, {
                    //    'name': 'questionnaire',
                    //    'data': {
                    //        'title': 'Final Questions',
                    //        'structure': [{
                    //            'questionType': 'checkbox',
                    //            'questionId': 'musicStyles',
                    //            'questionLabel': 'Select all of the following styles to which you regularly listen:',
                    //            'questionOptions': {
                    //                'choices': [{
                    //                    'label': 'Rock',
                    //                    'value': 'Rock'
                    //                }, {
                    //                    'label': 'Pop',
                    //                    'value': 'Pop'
                    //                }, {
                    //                    'label': 'Classical',
                    //                    'value': 'Classical'
                    //                }, {
                    //                    'label': 'Jazz',
                    //                    'value': 'Jazz'
                    //                }, {
                    //                    'label': 'Dance',
                    //                    'value': 'Dance'
                    //                }, {
                    //                    'label': 'Hip-Hop',
                    //                    'value': 'HipHop'
                    //                }, {
                    //                    'label': 'Folk',
                    //                    'value': 'Folk'
                    //                }, {'label': 'World', 'value': 'World'}]
                    //            },
                    //            'questionStoragePath': 'data.answers.music_styles',
                    //            'questionRequired': false
                    //        }, {
                    //            'questionType': 'likert',
                    //            'questionId': 'concentration',
                    //            'questionLabel': 'How concentrated were you during this experiment?',
                    //            'questionLabelType': 'labelLeft',
                    //            'questionLikertMinimumDescription': 'Very distracted',
                    //            'questionLikertMaximumDescription': 'Very concentrated',
                    //            'questionStoragePath': 'data.answers.concentration'
                    //        }]
                    //    }
                    //}, {'name': 'emotion-index'}, {'name': 'thank-you'}
                ],
                media: [
                    {
                        'artist': 'Synthesized',
                        'title': 'Pink Noise',
                        'label': 'C002'
                    },
                    {
                        'artist': 'Journey',
                        'label': 'H002',
                        'title': 'Don\'t Stop Believin\''
                    }
                ]
            };
        };

        beforeEach(function() {
        //    mockTrialData = {
        //        reset: function() {
        //        },
        //        data: {
        //            metadata: {
        //                session_number: null
        //            },
        //            state: {
        //                currentSlideIndex: 0
        //            },
        //            schema: [
        //                {
        //                    name: 'home'
        //                },
        //                {
        //                    name: 'start'
        //                },
        //                {
        //                    name: 'end'
        //                }
        //            ]
        //        }
        //    };
        //
        //    module(function($provide) {
        //        $provide.value('TrialData', mockTrialData);
        //    });
            validSchema = validSchemaGenerator();
        //
            inject(
                function(_ExperimentValidator_) {
                    ExperimentValidator = _ExperimentValidator_;
                }
            );
        });

        describe('validations', function() {
            describe('structure array', function() {
                it('is required', function() {
                    var invalidSchema = validSchema;
                    invalidSchema.structure = undefined;
                    expect(
                        ExperimentValidator.validateSchema(invalidSchema)
                    ).not.toEqual(undefined);
                });

                it('is required to be an array', function() {
                    var invalidSchema = validSchema;
                    invalidSchema.structure = {};
                    expect(
                        ExperimentValidator.validateSchema(invalidSchema)
                    ).not.toEqual(undefined);
                });

                it('is required to be of nonzero length', function() {
                    var invalidSchema = validSchema;
                    invalidSchema.structure = [];
                    expect(
                        ExperimentValidator.validateSchema(invalidSchema)
                    ).not.toEqual(undefined);
                });

                describe('items', function() {
                    describe('name', function() {
                        it('must be a string', function() {
                            var invalidSchema = validSchema;
                            invalidSchema.structure = [{
                                name: 42
                            }];
                            expect(
                                ExperimentValidator
                                    .validateStructureEntry(
                                        invalidSchema.structure[0]
                                    )
                            ).not.toEqual(undefined);
                        });

                        it('must be a string', function() {
                            var invalidSchema = validSchema;
                            invalidSchema.structure = [{
                                name: ''
                            }];
                            expect(
                                ExperimentValidator
                                    .validateStructureEntry(
                                    invalidSchema.structure[0]
                                )
                            ).not.toEqual(undefined);
                        });
                    });
                });
            });

            describe('media array', function() {
                it('is required', function() {
                    var invalidSchema = validSchema;
                    invalidSchema.media = undefined;
                    expect(
                        ExperimentValidator.validateSchema(invalidSchema)
                    ).not.toEqual(undefined);
                });

                it('is required to be an array', function() {
                    var invalidSchema = validSchema;
                    invalidSchema.media = {};
                    expect(
                        ExperimentValidator.validateSchema(invalidSchema)
                    ).not.toEqual(undefined);
                });

                it('is required to be of nonzero length', function() {
                    var invalidSchema = validSchema;
                    invalidSchema.media = [];
                    expect(
                        ExperimentValidator.validateSchema(invalidSchema)
                    ).not.toEqual(undefined);
                });

                describe('items', function() {
                    describe('artist', function() {
                        it('must be a string', function() {
                            var invalidSchema = validSchema;
                            invalidSchema.media = [{
                                artist: 42,
                                title: 'Pink Noise',
                                label: 'C002'
                            }];
                            expect(
                                ExperimentValidator
                                    .validateMediaEntry(invalidSchema.media[0])
                            ).not.toEqual(undefined);
                        });

                        it('must be a non-empty string', function() {
                            var invalidSchema = validSchema;
                            invalidSchema.media = [{
                                artist: '',
                                title: 'Pink Noise',
                                label: 'C002'
                            }];
                            expect(
                                ExperimentValidator
                                    .validateMediaEntry(invalidSchema.media[0])
                            ).not.toEqual(undefined);
                        });
                    });

                    describe('title', function() {
                        it('must be a string', function() {
                            var invalidSchema = validSchema;
                            invalidSchema.media = [{
                                artist: 'Pink Floyd',
                                title: 42,
                                label: 'C002'
                            }];
                            expect(
                                ExperimentValidator
                                    .validateMediaEntry(invalidSchema.media[0])
                            ).not.toEqual(undefined);
                        });

                        it('must be a non-empty string', function() {
                            var invalidSchema = validSchema;
                            invalidSchema.media = [{
                                artist: 'Pink Floyd',
                                title: 42,
                                label: 'C002'
                            }];
                            expect(
                                ExperimentValidator
                                    .validateMediaEntry(invalidSchema.media[0])
                            ).not.toEqual(undefined);
                        });
                    });

                    describe('label', function() {
                        it('must be a string', function() {
                            var invalidSchema = validSchema;
                            invalidSchema.media = [{
                                artist: 'Synthesized',
                                title: 'Pink Noise',
                                label: 42
                            }];
                            expect(
                                ExperimentValidator
                                    .validateMediaEntry(invalidSchema.media[0])
                            ).not.toEqual(undefined);
                        });

                        it('must be a non-empty string', function() {
                            var invalidSchema = validSchema;
                            invalidSchema.media = [{
                                artist: 'Synthesized',
                                title: 'Pink Noise',
                                label: ''
                            }];
                            expect(
                                ExperimentValidator
                                    .validateMediaEntry(invalidSchema.media[0])
                            ).not.toEqual(undefined);
                        });
                    });
                });
            });
        });
    });
})();
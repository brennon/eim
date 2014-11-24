'use strict';

angular.module('core').controller(['gettext',
    function(gettext) {
        var missingKeys = [
            gettext('No Signal'),
            gettext('Signal OK'),
            gettext('Personal Details'),
            gettext('Gender'),
            gettext('Male'),
            gettext('Female'),
            gettext('Nationality'),
            gettext('Afghan'),
            gettext('Albanian'),
            gettext('Algerian'),
            gettext('American'),
            gettext('Andorran'),
            gettext('Angolan'),
            gettext('Antiguans'),
            gettext('Argentinean'),
            gettext('Armenian'),
            gettext('Australian'),
            gettext('Austrian'),
            gettext('Azerbaijani'),
            gettext('Bahamian'),
            gettext('Bahraini'),
            gettext('Bangladeshi'),
            gettext('Barbadian'),
            gettext('Barbudans'),
            gettext('Batswana'),
            gettext('Belarusian'),
            gettext('Belgian'),
            gettext('Belizean'),
            gettext('Beninese'),
            gettext('Bhutanese'),
            gettext('Bolivian'),
            gettext('Bosnian'),
            gettext('Brazilian'),
            gettext('British'),
            gettext('Bruneian'),
            gettext('Bulgarian'),
            gettext('Burkinabe'),
            gettext('Burmese'),
            gettext('Burundian'),
            gettext('Cambodian'),
            gettext('Cameroonian'),
            gettext('Canadian'),
            gettext('Cape Verdean'),
            gettext('Central African'),
            gettext('Chadian'),
            gettext('Chilean'),
            gettext('Chinese'),
            gettext('Colombian'),
            gettext('Comoran'),
            gettext('Congolese'),
            gettext('Costa Rican'),
            gettext('Croatian'),
            gettext('Cuban'),
            gettext('Cypriot'),
            gettext('Czech'),
            gettext('Danish'),
            gettext('Djibouti'),
            gettext('Dominican'),
            gettext('Dutch'),
            gettext('East Timorese'),
            gettext('Ecuadorean'),
            gettext('Egyptian'),
            gettext('Emirian'),
            gettext('Equatorial Guinean'),
            gettext('Eritrean'),
            gettext('Estonian'),
            gettext('Ethiopian'),
            gettext('Fijian'),
            gettext('Filipino'),
            gettext('Finnish'),
            gettext('French'),
            gettext('Gabonese'),
            gettext('Gambian'),
            gettext('Georgian'),
            gettext('German'),
            gettext('Ghanaian'),
            gettext('Greek'),
            gettext('Grenadian'),
            gettext('Guatemalan'),
            gettext('Guinea-Bissauan'),
            gettext('Guinean'),
            gettext('Guyanese'),
            gettext('Haitian'),
            gettext('Herzegovinian'),
            gettext('Honduran'),
            gettext('Hungarian'),
            gettext('I-Kiribati'),
            gettext('Icelander'),
            gettext('Indian'),
            gettext('Indonesian'),
            gettext('Iranian'),
            gettext('Iraqi'),
            gettext('Irish'),
            gettext('Israeli'),
            gettext('Italian'),
            gettext('Ivorian'),
            gettext('Jamaican'),
            gettext('Japanese'),
            gettext('Jordanian'),
            gettext('Kazakhstani'),
            gettext('Kenyan'),
            gettext('Kittian and Nevisian'),
            gettext('Kuwaiti'),
            gettext('Kyrgyz'),
            gettext('Laotian'),
            gettext('Latvian'),
            gettext('Lebanese'),
            gettext('Liberian'),
            gettext('Libyan'),
            gettext('Liechtensteiner'),
            gettext('Lithuanian'),
            gettext('Luxembourger'),
            gettext('Macedonian'),
            gettext('Malagasy'),
            gettext('Malawian'),
            gettext('Malaysian'),
            gettext('Maldivan'),
            gettext('Malian'),
            gettext('Maltese'),
            gettext('Marshallese'),
            gettext('Mauritanian'),
            gettext('Mauritian'),
            gettext('Mexican'),
            gettext('Micronesian'),
            gettext('Moldovan'),
            gettext('Monacan'),
            gettext('Mongolian'),
            gettext('Moroccan'),
            gettext('Mosotho'),
            gettext('Motswana'),
            gettext('Mozambican'),
            gettext('Namibian'),
            gettext('Nauruan'),
            gettext('Nepalese'),
            gettext('New Zealander'),
            gettext('Nicaraguan'),
            gettext('Nigerian'),
            gettext('Nigerien'),
            gettext('North Korean'),
            gettext('Northern Irish'),
            gettext('Norwegian'),
            gettext('Omani'),
            gettext('Pakistani'),
            gettext('Palauan'),
            gettext('Panamanian'),
            gettext('Papua New Guinean'),
            gettext('Paraguayan'),
            gettext('Peruvian'),
            gettext('Polish'),
            gettext('Portuguese'),
            gettext('Qatari'),
            gettext('Romanian'),
            gettext('Russian'),
            gettext('Rwandan'),
            gettext('Saint Lucian'),
            gettext('Salvadoran'),
            gettext('Samoan'),
            gettext('San Marinese'),
            gettext('Sao Tomean'),
            gettext('Saudi'),
            gettext('Scottish'),
            gettext('Senegalese'),
            gettext('Serbian'),
            gettext('Seychellois'),
            gettext('Sierra Leonean'),
            gettext('Singaporean'),
            gettext('Slovakian'),
            gettext('Slovenian'),
            gettext('Solomon Islander'),
            gettext('Somali'),
            gettext('South African'),
            gettext('South Korean'),
            gettext('Spanish'),
            gettext('Sri Lankan'),
            gettext('Sudanese'),
            gettext('Surinamer'),
            gettext('Swazi'),
            gettext('Swedish'),
            gettext('Swiss'),
            gettext('Syrian'),
            gettext('Taiwanese'),
            gettext('Tajik'),
            gettext('Tanzanian'),
            gettext('Thai'),
            gettext('Togolese'),
            gettext('Tongan'),
            gettext('Trinidadian or Tobagonian'),
            gettext('Tunisian'),
            gettext('Turkish'),
            gettext('Tuvaluan'),
            gettext('Ugandan'),
            gettext('Ukrainian'),
            gettext('Uruguayan'),
            gettext('Uzbekistani'),
            gettext('Venezuelan'),
            gettext('Vietnamese'),
            gettext('Welsh'),
            gettext('Yemenite'),
            gettext('Zambian'),
            gettext('Zimbabwean'),
            gettext('Birth Year'),
            gettext('Musical Background'),
            gettext('Do you consider yourself a musician or to have specialist musical knowledge?'),
            gettext('Yes'),
            gettext('No'),
            gettext('On a scale of 1 to 5, how would you rate your musical expertise, with 1 being no expertise whatsoever and 5 being an expert?'),
            gettext('No expertise whatsoever'),
            gettext('An expert'),
            gettext('Do you have any hearing impairments? (If so, you may still participate in the experiment!)'),
            gettext('Yes'),
            gettext('No'),
            gettext('Do you have any visual impairments? (If so, you may still participate in the experiment!)'),
            gettext('Yes'),
            gettext('No'),
            gettext('Select all of the following styles to which you regularly listen:'),
            gettext('Rock'),
            gettext('Pop'),
            gettext('Classical'),
            gettext('Jazz'),
            gettext('Dance'),
            gettext('HipHop'),
            gettext('Folk'),
            gettext('World'),
            gettext('None'),
            gettext('Media Questions'),
            gettext('Have you ever heard this song before?'),
            gettext('Not at all engaged, my mind was elsewhere'),
            gettext('I was engaged with the music and responding to it emotionally'),
            gettext('How positive or negative did the music make you feel?'),
            gettext('Very negative'),
            gettext('Very positive'),
            gettext('How involved and engaged were you with the music you have just heard?'),
            gettext('Very drowsy'),
            gettext('Very lively'),
            gettext('How active or passive did the music make you feel?'),
            gettext('Weak<br />(without control, submissive)'),
            gettext('Empowered<br />(in control of everything, dominant)'),
            gettext('How in control did you feel?'),
            gettext('Not at all'),
            gettext('How strongly did you experience any of these physical reactions while you were listening: chills, shivers, thrills, or goosebumps?'),
            gettext('I hated it'),
            gettext('I loved it'),
            gettext('How much did you like/dislike the song?'),
            gettext('I had never heard it before'),
            gettext('I listen to it regularly'),
            gettext('How familiar are you with this music?')
        ];
    }
]);

/*
 {
 "_id" : ObjectId("53e91194201fbd39909a9df5"),
 "trialCount" : 2,
 "mediaPool" : [
 ObjectId("537e53b3df872bb71e4df264"),
 ObjectId("537e54b8df872bb71e4df265"),
 ObjectId("537e55bbdf872bb71e4df266"),
 ObjectId("537e5679df872bb71e4df267")
 ],
 "sensors" : [
 "eda",
 "pox"
 ],
 "structure" : [
 {
 "name" : "consent-form"
 },
 {
 "name" : "start"
 },
 {
 "name" : "sound-test"
 },
 {
 "name" : "eda-instructions"
 },
 {
 "name" : "pox-instructions"
 },
 {
 "name" : "signal-test"
 },
 {
 "name" : "questionnaire",
 "data" : {
 "title" : "Personal Details",
 "structure" : [
 {
 "questionType" : "radio",
 "questionId" : "gender",
 "questionLabel" : "Gender",
 "questionRadioOptions" : [
 {
 "label" : "Male",
 "value" : "male"
 },
 {
 "label" : "Female",
 "value" : "female"
 }
 ],
 "questionStoragePath" : "data.answers.sex"
 },
 {
 "questionType" : "dropdown",
 "questionId" : "nationality",
 "questionLabel" : "Nationality",
 "questionDropdownOptions" : [
 "Taiwanese",
 "Afghan",
 "Albanian",
 "Algerian",
 "American",
 "Andorran",
 "Angolan",
 "Antiguans",
 "Argentinean",
 "Armenian",
 "Australian",
 "Austrian",
 "Azerbaijani",
 "Bahamian",
 "Bahraini",
 "Bangladeshi",
 "Barbadian",
 "Barbudans",
 "Batswana",
 "Belarusian",
 "Belgian",
 "Belizean",
 "Beninese",
 "Bhutanese",
 "Bolivian",
 "Bosnian",
 "Brazilian",
 "British",
 "Bruneian",
 "Bulgarian",
 "Burkinabe",
 "Burmese",
 "Burundian",
 "Cambodian",
 "Cameroonian",
 "Canadian",
 "Cape Verdean",
 "Central African",
 "Chadian",
 "Chilean",
 "Chinese",
 "Colombian",
 "Comoran",
 "Congolese",
 "Costa Rican",
 "Croatian",
 "Cuban",
 "Cypriot",
 "Czech",
 "Danish",
 "Djibouti",
 "Dominican",
 "Dutch",
 "East Timorese",
 "Ecuadorean",
 "Egyptian",
 "Emirian",
 "Equatorial Guinean",
 "Eritrean",
 "Estonian",
 "Ethiopian",
 "Fijian",
 "Filipino",
 "Finnish",
 "French",
 "Gabonese",
 "Gambian",
 "Georgian",
 "German",
 "Ghanaian",
 "Greek",
 "Grenadian",
 "Guatemalan",
 "Guinea-Bissauan",
 "Guinean",
 "Guyanese",
 "Haitian",
 "Herzegovinian",
 "Honduran",
 "Hungarian",
 "I-Kiribati",
 "Icelander",
 "Indian",
 "Indonesian",
 "Iranian",
 "Iraqi",
 "Irish",
 "Israeli",
 "Italian",
 "Ivorian",
 "Jamaican",
 "Japanese",
 "Jordanian",
 "Kazakhstani",
 "Kenyan",
 "Kittian and Nevisian",
 "Kuwaiti",
 "Kyrgyz",
 "Laotian",
 "Latvian",
 "Lebanese",
 "Liberian",
 "Libyan",
 "Liechtensteiner",
 "Lithuanian",
 "Luxembourger",
 "Macedonian",
 "Malagasy",
 "Malawian",
 "Malaysian",
 "Maldivan",
 "Malian",
 "Maltese",
 "Marshallese",
 "Mauritanian",
 "Mauritian",
 "Mexican",
 "Micronesian",
 "Moldovan",
 "Monacan",
 "Mongolian",
 "Moroccan",
 "Mosotho",
 "Motswana",
 "Mozambican",
 "Namibian",
 "Nauruan",
 "Nepalese",
 "New Zealander",
 "Nicaraguan",
 "Nigerian",
 "Nigerien",
 "North Korean",
 "Northern Irish",
 "Norwegian",
 "Omani",
 "Pakistani",
 "Palauan",
 "Panamanian",
 "Papua New Guinean",
 "Paraguayan",
 "Peruvian",
 "Polish",
 "Portuguese",
 "Qatari",
 "Romanian",
 "Russian",
 "Rwandan",
 "Saint Lucian",
 "Salvadoran",
 "Samoan",
 "San Marinese",
 "Sao Tomean",
 "Saudi",
 "Scottish",
 "Senegalese",
 "Serbian",
 "Seychellois",
 "Sierra Leonean",
 "Singaporean",
 "Slovakian",
 "Slovenian",
 "Solomon Islander",
 "Somali",
 "South African",
 "South Korean",
 "Spanish",
 "Sri Lankan",
 "Sudanese",
 "Surinamer",
 "Swazi",
 "Swedish",
 "Swiss",
 "Syrian",
 "Tajik",
 "Tanzanian",
 "Thai",
 "Togolese",
 "Tongan",
 "Trinidadian or Tobagonian",
 "Tunisian",
 "Turkish",
 "Tuvaluan",
 "Ugandan",
 "Ukrainian",
 "Uruguayan",
 "Uzbekistani",
 "Venezuelan",
 "Vietnamese",
 "Welsh",
 "Yemenite",
 "Zambian",
 "Zimbabwean"
 ],
 "questionStoragePath" : "data.answers.nationality"
 },
 {
 "questionType" : "dropdown",
 "questionId" : "age",
 "questionLabel" : "Age",
 "questionDropdownOptions" : [
 1,
 2,
 3,
 4,
 5,
 6,
 7,
 8,
 9,
 10,
 11,
 12,
 13,
 14,
 15,
 16,
 17,
 18,
 19,
 20,
 21,
 22,
 23,
 24,
 25,
 26,
 27,
 28,
 29,
 30,
 31,
 32,
 33,
 34,
 35,
 36,
 37,
 38,
 39,
 40,
 41,
 42,
 43,
 44,
 45,
 46,
 47,
 48,
 49,
 50,
 51,
 52,
 53,
 54,
 55,
 56,
 57,
 58,
 59,
 60,
 61,
 62,
 63,
 64,
 65,
 66,
 67,
 68,
 69,
 70,
 71,
 72,
 73,
 74,
 75,
 76,
 77,
 78,
 79,
 80,
 81,
 82,
 83,
 84,
 85,
 86,
 87,
 88,
 89,
 90,
 91,
 92,
 93,
 94,
 95,
 96,
 97,
 98,
 99,
 100,
 101,
 102,
 103,
 104,
 105,
 106,
 107,
 108,
 109,
 110,
 111,
 112,
 113,
 114,
 115,
 116,
 117,
 118,
 119,
 120,
 121
 ],
 "questionStoragePath" : "data.answers.age"
 }
 ]
 }
 },
 {
 "name" : "questionnaire",
 "data" : {
 "title" : "Musical Background",
 "structure" : [
 {
 "questionType" : "likert",
 "questionId" : "musicalExpertise",
 "questionLabel" : "How would you rate your musical expertise?",
 "questionLabelType" : "labelLeft",
 "questionLikertMinimumDescription" : "No expertise whatsoever",
 "questionLikertMaximumDescription" : "An expert",
 "questionStoragePath" : "data.answers.musical_expertise"
 },
 {
 "questionType" : "radio",
 "questionId" : "hearingImpairments",
 "questionLabel" : "Do you have any hearing impairments? (If so, you may still participate in the experiment!)",
 "questionRadioOptions" : [
 {
 "label" : "Yes",
 "value" : true
 },
 {
 "label" : "No",
 "value" : false
 }
 ],
 "questionStoragePath" : "data.answers.hearing_impairments"
 }
 ]
 }
 },
 {
 "name" : "questionnaire",
 "data" : {
 "title" : "Additional Questions",
 "introductoryText" : "How well do the following statements describe your personality?",
 "structure" : [
 {
 "questionType" : "likert",
 "questionId" : "reserved",
 "questionLabel" : "I see myself as someone who is reserved.",
 "questionLabelType" : "labelLeft",
 "questionStoragePath" : "data.answers.personality.reserved",
 "questionOptions" : {
 "choices" : [
 {
 "label" : "Disagree strongly"
 },
 {
 "label" : "Disagree a little"
 },
 {
 "label" : "Neither agree nor disagree"
 },
 {
 "label" : "Agree a little"
 },
 {
 "label" : "Agree strongly"
 }
 ]
 }
 },
 {
 "questionType" : "likert",
 "questionId" : "trusting",
 "questionLabel" : "I see myself as someone who is generally trusting.",
 "questionLabelType" : "labelLeft",
 "questionStoragePath" : "data.answers.personality.trusting",
 "questionOptions" : {
 "choices" : [
 {
 "label" : "Disagree strongly"
 },
 {
 "label" : "Disagree a little"
 },
 {
 "label" : "Neither agree nor disagree"
 },
 {
 "label" : "Agree a little"
 },
 {
 "label" : "Agree strongly"
 }
 ]
 }
 },
 {
 "questionType" : "likert",
 "questionId" : "lazy",
 "questionLabel" : "I see myself as someone who tends to be lazy.",
 "questionLabelType" : "labelLeft",
 "questionStoragePath" : "data.answers.personality.lazy",
 "questionOptions" : {
 "choices" : [
 {
 "label" : "Disagree strongly"
 },
 {
 "label" : "Disagree a little"
 },
 {
 "label" : "Neither agree nor disagree"
 },
 {
 "label" : "Agree a little"
 },
 {
 "label" : "Agree strongly"
 }
 ]
 }
 },
 {
 "questionType" : "likert",
 "questionId" : "stress",
 "questionLabel" : "I see myself as someone who is relaxed, handles stress well.",
 "questionLabelType" : "labelLeft",
 "questionStoragePath" : "data.answers.personality.stress",
 "questionOptions" : {
 "choices" : [
 {
 "label" : "Disagree strongly"
 },
 {
 "label" : "Disagree a little"
 },
 {
 "label" : "Neither agree nor disagree"
 },
 {
 "label" : "Agree a little"
 },
 {
 "label" : "Agree strongly"
 }
 ]
 }
 },
 {
 "questionType" : "likert",
 "questionId" : "artistic",
 "questionLabel" : "I see myself as someone who has few artistic interests.",
 "questionLabelType" : "labelLeft",
 "questionStoragePath" : "data.answers.personality.artistic",
 "questionOptions" : {
 "choices" : [
 {
 "label" : "Disagree strongly"
 },
 {
 "label" : "Disagree a little"
 },
 {
 "label" : "Neither agree nor disagree"
 },
 {
 "label" : "Agree a little"
 },
 {
 "label" : "Agree strongly"
 }
 ]
 }
 },
 {
 "questionType" : "likert",
 "questionId" : "outgoing",
 "questionLabel" : "I see myself as someone who is outgoing, sociable.",
 "questionLabelType" : "labelLeft",
 "questionStoragePath" : "data.answers.personality.outgoing",
 "questionOptions" : {
 "choices" : [
 {
 "label" : "Disagree strongly"
 },
 {
 "label" : "Disagree a little"
 },
 {
 "label" : "Neither agree nor disagree"
 },
 {
 "label" : "Agree a little"
 },
 {
 "label" : "Agree strongly"
 }
 ]
 }
 },
 {
 "questionType" : "likert",
 "questionId" : "fault",
 "questionLabel" : "I see myself as someone who tends to find fault with others.",
 "questionLabelType" : "labelLeft",
 "questionStoragePath" : "data.answers.personality.fault",
 "questionOptions" : {
 "choices" : [
 {
 "label" : "Disagree strongly"
 },
 {
 "label" : "Disagree a little"
 },
 {
 "label" : "Neither agree nor disagree"
 },
 {
 "label" : "Agree a little"
 },
 {
 "label" : "Agree strongly"
 }
 ]
 }
 },
 {
 "questionType" : "likert",
 "questionId" : "thorough",
 "questionLabel" : "I see myself as someone who does a thorough job.",
 "questionLabelType" : "labelLeft",
 "questionStoragePath" : "data.answers.personality.thorough",
 "questionOptions" : {
 "choices" : [
 {
 "label" : "Disagree strongly"
 },
 {
 "label" : "Disagree a little"
 },
 {
 "label" : "Neither agree nor disagree"
 },
 {
 "label" : "Agree a little"
 },
 {
 "label" : "Agree strongly"
 }
 ]
 }
 },
 {
 "questionType" : "likert",
 "questionId" : "nervous",
 "questionLabel" : "I see myself as someone who gets nervous easily.",
 "questionLabelType" : "labelLeft",
 "questionStoragePath" : "data.answers.personality.nervous",
 "questionOptions" : {
 "choices" : [
 {
 "label" : "Disagree strongly"
 },
 {
 "label" : "Disagree a little"
 },
 {
 "label" : "Neither agree nor disagree"
 },
 {
 "label" : "Agree a little"
 },
 {
 "label" : "Agree strongly"
 }
 ]
 }
 },
 {
 "questionType" : "likert",
 "questionId" : "imagination",
 "questionLabel" : "I see myself as someone who has an active imagination.",
 "questionLabelType" : "labelLeft",
 "questionStoragePath" : "data.answers.personality.imagination",
 "questionOptions" : {
 "choices" : [
 {
 "label" : "Disagree strongly"
 },
 {
 "label" : "Disagree a little"
 },
 {
 "label" : "Neither agree nor disagree"
 },
 {
 "label" : "Agree a little"
 },
 {
 "label" : "Agree strongly"
 }
 ]
 }
 }
 ]
 }
 },
 {
 "name" : "media-playback",
 "mediaType" : "fixed",
 "media" : ObjectId("537e53b3df872bb71e4df264")
 },
 {
 "name" : "questionnaire",
 "data" : {
 "title" : "Media Questions",
 "introductoryText" : "This questionnaire uses some simple scales to find out how you responded to the media excerpt. We will compare your responses to the biosignals that we measured as you were listening.",
 "structure" : [
 {
 "questionType" : "likert",
 "questionId" : "engaged",
 "questionLikertMinimumDescription" : "Not at all engaged, my mind was elsewhere",
 "questionLikertMaximumDescription" : "I was engaged with it and responding to it emotionally",
 "questionLikertLeftImageSrc" : "/modules/core/img/scale-left-engaged.png",
 "questionLikertRightImageSrc" : "/modules/core/img/scale-right-engaged.png",
 "questionLabel" : "How involved and engaged were you with what you have just heard?",
 "questionStoragePath" : "data.answers.ratings.engagement",
 "questionIsAssociatedToMedia" : true
 },
 {
 "questionType" : "likert",
 "questionId" : "positivity",
 "questionLikertMinimumDescription" : "Very negative",
 "questionLikertMaximumDescription" : "Very positive",
 "questionLikertUseImage" : true,
 "questionLikertSingleImageSrc" : "/modules/core/img/scale-above-positivity.png",
 "questionLabel" : "How positive or negative did what you have just heard make you feel?",
 "questionStoragePath" : "data.answers.ratings.positivity",
 "questionIsAssociatedToMedia" : true
 },
 {
 "questionType" : "likert",
 "questionId" : "activity",
 "questionLikertMinimumDescription" : "Very drowsy",
 "questionLikertMaximumDescription" : "Very lively",
 "questionLikertSingleImageSrc" : "/modules/core/img/scale-above-drowsylively.png",
 "questionLabel" : "How active or passive did what you have just heard make you feel?",
 "questionStoragePath" : "data.answers.ratings.activity",
 "questionIsAssociatedToMedia" : true
 },
 {
 "questionType" : "likert",
 "questionId" : "power",
 "questionLikertMinimumDescription" : "Weak<br />(without control, submissive)",
 "questionLikertMaximumDescription" : "Empowered<br />(in control of everything, dominant)",
 "questionLikertSingleImageSrc" : "/modules/core/img/scale-above-power.png",
 "questionLabel" : "How in control did you feel?",
 "questionStoragePath" : "data.answers.ratings.power",
 "questionIsAssociatedToMedia" : true
 },
 {
 "questionType" : "likert",
 "questionId" : "tension",
 "questionLikertMinimumDescription" : "Very tense",
 "questionLikertMaximumDescription" : "Very relaxed",
 "questionLabel" : "How tense or relaxed did you feel while you were listening?",
 "questionStoragePath" : "data.answers.ratings.tension",
 "questionIsAssociatedToMedia" : true
 },
 {
 "questionType" : "likert",
 "questionId" : "likeDislike",
 "questionLikertMinimumDescription" : "I hated it",
 "questionLikertMaximumDescription" : "I loved it",
 "questionLabel" : "How much did you like/dislike what you have just heard?",
 "questionStoragePath" : "data.answers.ratings.like_dislike",
 "questionIsAssociatedToMedia" : true
 }
 ]
 }
 },
 {
 "name" : "media-playback",
 "mediaType" : "random"
 },
 {
 "name" : "questionnaire",
 "data" : {
 "title" : "Media Questions",
 "introductoryText" : "This questionnaire uses some simple scales to find out how you responded to the media excerpt. We will compare your responses to the biosignals that we measured as you were listening.",
 "structure" : [
 {
 "questionType" : "likert",
 "questionId" : "engaged",
 "questionLikertMinimumDescription" : "Not at all engaged, my mind was elsewhere",
 "questionLikertMaximumDescription" : "I was engaged with it and responding to it emotionally",
 "questionLikertLeftImageSrc" : "/modules/core/img/scale-left-engaged.png",
 "questionLikertRightImageSrc" : "/modules/core/img/scale-right-engaged.png",
 "questionLabel" : "How involved and engaged were you with what you have just heard?",
 "questionStoragePath" : "data.answers.ratings.engagement",
 "questionIsAssociatedToMedia" : true
 },
 {
 "questionType" : "likert",
 "questionId" : "positivity",
 "questionLikertMinimumDescription" : "Very negative",
 "questionLikertMaximumDescription" : "Very positive",
 "questionLikertUseImage" : true,
 "questionLikertSingleImageSrc" : "/modules/core/img/scale-above-positivity.png",
 "questionLabel" : "How positive or negative did what you have just heard make you feel?",
 "questionStoragePath" : "data.answers.ratings.positivity",
 "questionIsAssociatedToMedia" : true
 },
 {
 "questionType" : "likert",
 "questionId" : "activity",
 "questionLikertMinimumDescription" : "Very drowsy",
 "questionLikertMaximumDescription" : "Very lively",
 "questionLikertSingleImageSrc" : "/modules/core/img/scale-above-drowsylively.png",
 "questionLabel" : "How active or passive did what you have just heard make you feel?",
 "questionStoragePath" : "data.answers.ratings.activity",
 "questionIsAssociatedToMedia" : true
 },
 {
 "questionType" : "likert",
 "questionId" : "power",
 "questionLikertMinimumDescription" : "Weak<br />(without control, submissive)",
 "questionLikertMaximumDescription" : "Empowered<br />(in control of everything, dominant)",
 "questionLikertSingleImageSrc" : "/modules/core/img/scale-above-power.png",
 "questionLabel" : "How in control did you feel?",
 "questionStoragePath" : "data.answers.ratings.power",
 "questionIsAssociatedToMedia" : true
 },
 {
 "questionType" : "likert",
 "questionId" : "likeDislike",
 "questionLikertMinimumDescription" : "I hated it",
 "questionLikertMaximumDescription" : "I loved it",
 "questionLabel" : "How much did you like/dislike what you have just heard?",
 "questionStoragePath" : "data.answers.ratings.like_dislike",
 "questionIsAssociatedToMedia" : true
 },
 {
 "questionType" : "likert",
 "questionId" : "familiarity",
 "questionLikertMinimumDescription" : "I had never heard it before",
 "questionLikertMaximumDescription" : "I listen to it regularly",
 "questionLabel" : "How familiar are you with what you have just heard?",
 "questionStoragePath" : "data.answers.ratings.familiarity",
 "questionIsAssociatedToMedia" : true
 }
 ]
 }
 },
 {
 "name" : "questionnaire",
 "data" : {
 "title" : "Final Questions",
 "structure" : [
 {
 "questionType" : "checkbox",
 "questionId" : "musicStyles",
 "questionLabel" : "Select all of the following styles to which you regularly listen:",
 "questionCheckboxOptions" : [
 "Rock",
 "Pop",
 "Classical",
 "Jazz",
 "Dance",
 "HipHop",
 "Folk",
 "World",
 "None"
 ],
 "questionStoragePath" : "data.answers.music_styles"
 },
 {
 "questionType" : "likert",
 "questionId" : "concentration",
 "questionLabel" : "How concentrated were you during this experiment?",
 "questionLabelType" : "labelLeft",
 "questionLikertMinimumDescription" : "Very distracted",
 "questionLikertMaximumDescription" : "Very concentrated",
 "questionStoragePath" : "data.answers.concentration"
 }
 ]
 }
 },
 {
 "name" : "emotion-index"
 },
 {
 "name" : "thank-you"
 }
 ]
 }
 */
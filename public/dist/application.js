'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'emotion-in-motion';
	var applicationModuleVendorDependencies = ['ngResource', 'ngCookies',  'ngAnimate',  'ngTouch',  'ngSanitize',  'ui.router', 'ui.bootstrap', 'ui.utils', 'cfp.hotkeys', 'btford.socket-io', 'gettext', 'logglyLogger', 'uuid'];

	// Add a new vertical module
	var registerModule = function(moduleName) {
		// Create angular module
		angular.module(moduleName, []);

		// Add the module to the AngularJS configuration file
		angular.module(applicationModuleName).requires.push(moduleName);
	};

	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule
	};
})();
'use strict';

/**
 * @namespace Angular
 */

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
    function($locationProvider) {
        $locationProvider.hashPrefix('!');
    }
]);

/** BEGIN Emotion in Motion Customizations **/

// Use angular-loggly-logger to decorate $log so that log messages are
// sent to Loggly
angular.module(ApplicationConfiguration.applicationModuleName)
    .config(['LogglyLoggerProvider', function(LogglyLoggerProvider) {
        LogglyLoggerProvider
            .inputToken('81009487-63da-400f-af48-4b3f91d3bbd5')
            .includeUrl(true)
            .includeTimestamp(true)
            .sendConsoleErrors(true)
            .inputTag('AngularJS');
    }]);

// Configure nggettext
angular.module(ApplicationConfiguration.applicationModuleName).run(['gettextCatalog',
    function(gettextCatalog) {

        gettextCatalog.debug = true;
    }
]);

// Configure scroll-in of slides as participant advances
angular.module(ApplicationConfiguration.applicationModuleName).run(['$rootScope',
    function($rootScope) {
        $rootScope.$on('$stateChangeSuccess', function() {
            $("html, body").animate({scrollTop: 0}, 200);
        });
    }
]);

/** END Emotion in Motion Customizations **/

//Then define the init function for starting up the application
angular.element(document).ready(function() {
    //Fixing facebook bug with redirect
    if (window.location.hash === '#_=_') window.location.hash = '#!';

    //Then init the app
    angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');
'use strict';

/**
 * This **is not**, in fact, a class, but rather a file for defining those
 * strings that
 * [angular-gettext](https://angular-gettext.rocketeer.be/) does not
 * automatically extract for translation using the `nggettext_extract` Grunt
 * task. The file is located at
 * `/public/modules/core/config/core.client.missing-keys.js`.
 *
 * If you've translated your text following the instructions in the README,
 * and you still see text prepended with `[MISSING:]` when you browse to
 * your application, you'll need to do the following:
 *
 * 1. Add all such strings to this file. In particular, add a separate call
 * to `gettext('Your string here');` following those you see in this file.
 * 2. Run the `nggettext_extract` task again.
 * 3. Proceed with the translation instructions as given in the
 * [README](index.html).
 *
 * As an example, if the following were the contents of the
 * `core.client.missing-keys.js` file, the strings, `'No Signal'`, `'Signal
 * OK'`, and `'Personal Details'`, would be extracted (along with all
 * other strings that are automatically extracted) by the
 * `nggettext_extract` Grunt task and included in the file at
 * `/po/template.pot` for your use in creating translations.
 *
 * @example
 *
 * angular.module('core').controller(['gettext',
 *    function (gettext) {
 *         gettext('No Signal');
 *         gettext('Signal OK');
 *         gettext('Personal Details');
 *     }
 * ]);
 *
 * @class Angular.MissingKeys
 * @memberof Angular
 */

angular.module('core').controller(['gettext',
    function (gettext) {
        gettext('No Signal');
        gettext('Signal OK');
        gettext('Personal Details');
        gettext('Gender');
        gettext('Male');
        gettext('Female');
        gettext('Nationality');
        gettext('Afghan');
        gettext('Albanian');
        gettext('Algerian');
        gettext('American');
        gettext('Andorran');
        gettext('Angolan');
        gettext('Antiguans');
        gettext('Argentinean');
        gettext('Armenian');
        gettext('Australian');
        gettext('Austrian');
        gettext('Azerbaijani');
        gettext('Bahamian');
        gettext('Bahraini');
        gettext('Bangladeshi');
        gettext('Barbadian');
        gettext('Barbudans');
        gettext('Batswana');
        gettext('Belarusian');
        gettext('Belgian');
        gettext('Belizean');
        gettext('Beninese');
        gettext('Bhutanese');
        gettext('Bolivian');
        gettext('Bosnian');
        gettext('Brazilian');
        gettext('British');
        gettext('Bruneian');
        gettext('Bulgarian');
        gettext('Burkinabe');
        gettext('Burmese');
        gettext('Burundian');
        gettext('Cambodian');
        gettext('Cameroonian');
        gettext('Canadian');
        gettext('Cape Verdean');
        gettext('Central African');
        gettext('Chadian');
        gettext('Chilean');
        gettext('Chinese');
        gettext('Colombian');
        gettext('Comoran');
        gettext('Congolese');
        gettext('Costa Rican');
        gettext('Croatian');
        gettext('Cuban');
        gettext('Cypriot');
        gettext('Czech');
        gettext('Danish');
        gettext('Djibouti');
        gettext('Dominican');
        gettext('Dutch');
        gettext('East Timorese');
        gettext('Ecuadorean');
        gettext('Egyptian');
        gettext('Emirian');
        gettext('Equatorial Guinean');
        gettext('Eritrean');
        gettext('Estonian');
        gettext('Ethiopian');
        gettext('Fijian');
        gettext('Filipino');
        gettext('Finnish');
        gettext('French');
        gettext('Gabonese');
        gettext('Gambian');
        gettext('Georgian');
        gettext('German');
        gettext('Ghanaian');
        gettext('Greek');
        gettext('Grenadian');
        gettext('Guatemalan');
        gettext('Guinea-Bissauan');
        gettext('Guinean');
        gettext('Guyanese');
        gettext('Haitian');
        gettext('Herzegovinian');
        gettext('Honduran');
        gettext('Hungarian');
        gettext('I-Kiribati');
        gettext('Icelander');
        gettext('Indian');
        gettext('Indonesian');
        gettext('Iranian');
        gettext('Iraqi');
        gettext('Irish');
        gettext('Israeli');
        gettext('Italian');
        gettext('Ivorian');
        gettext('Jamaican');
        gettext('Japanese');
        gettext('Jordanian');
        gettext('Kazakhstani');
        gettext('Kenyan');
        gettext('Kittian and Nevisian');
        gettext('Kuwaiti');
        gettext('Kyrgyz');
        gettext('Laotian');
        gettext('Latvian');
        gettext('Lebanese');
        gettext('Liberian');
        gettext('Libyan');
        gettext('Liechtensteiner');
        gettext('Lithuanian');
        gettext('Luxembourger');
        gettext('Macedonian');
        gettext('Malagasy');
        gettext('Malawian');
        gettext('Malaysian');
        gettext('Maldivan');
        gettext('Malian');
        gettext('Maltese');
        gettext('Marshallese');
        gettext('Mauritanian');
        gettext('Mauritian');
        gettext('Mexican');
        gettext('Micronesian');
        gettext('Moldovan');
        gettext('Monacan');
        gettext('Mongolian');
        gettext('Moroccan');
        gettext('Mosotho');
        gettext('Motswana');
        gettext('Mozambican');
        gettext('Namibian');
        gettext('Nauruan');
        gettext('Nepalese');
        gettext('New Zealander');
        gettext('Nicaraguan');
        gettext('Nigerian');
        gettext('Nigerien');
        gettext('North Korean');
        gettext('Northern Irish');
        gettext('Norwegian');
        gettext('Omani');
        gettext('Pakistani');
        gettext('Palauan');
        gettext('Panamanian');
        gettext('Papua New Guinean');
        gettext('Paraguayan');
        gettext('Peruvian');
        gettext('Polish');
        gettext('Portuguese');
        gettext('Qatari');
        gettext('Romanian');
        gettext('Russian');
        gettext('Rwandan');
        gettext('Saint Lucian');
        gettext('Salvadoran');
        gettext('Samoan');
        gettext('San Marinese');
        gettext('Sao Tomean');
        gettext('Saudi');
        gettext('Scottish');
        gettext('Senegalese');
        gettext('Serbian');
        gettext('Seychellois');
        gettext('Sierra Leonean');
        gettext('Singaporean');
        gettext('Slovakian');
        gettext('Slovenian');
        gettext('Solomon Islander');
        gettext('Somali');
        gettext('South African');
        gettext('South Korean');
        gettext('Spanish');
        gettext('Sri Lankan');
        gettext('Sudanese');
        gettext('Surinamer');
        gettext('Swazi');
        gettext('Swedish');
        gettext('Swiss');
        gettext('Syrian');
        gettext('Taiwanese');
        gettext('Tajik');
        gettext('Tanzanian');
        gettext('Thai');
        gettext('Togolese');
        gettext('Tongan');
        gettext('Trinidadian or Tobagonian');
        gettext('Tunisian');
        gettext('Turkish');
        gettext('Tuvaluan');
        gettext('Ugandan');
        gettext('Ukrainian');
        gettext('Uruguayan');
        gettext('Uzbekistani');
        gettext('Venezuelan');
        gettext('Vietnamese');
        gettext('Welsh');
        gettext('Yemenite');
        gettext('Zambian');
        gettext('Zimbabwean');
        gettext('Birth Year');
        gettext('Musical Background');
        gettext('Do you consider yourself a musician or to have specialist musical knowledge?');
        gettext('Yes');
        gettext('No');
        gettext('No expertise whatsoever');
        gettext('An expert');
        gettext('Do you have any visual impairments? (If so, you may still participate in the experiment!)');
        gettext('Select all of the following styles to which you regularly listen:');
        gettext('Rock');
        gettext('Pop');
        gettext('Classical');
        gettext('Jazz');
        gettext('Dance');
        gettext('HipHop');
        gettext('Folk');
        gettext('World');
        gettext('None');
        gettext('Media Questions');
        gettext('I was engaged with it and responding to it emotionally');
        gettext('How involved and engaged were you with what you have just heard?');
        gettext('Very negative');
        gettext('Very positive');
        gettext('How positive or negative did what you have just heard make you feel?');
        gettext('Very drowsy');
        gettext('Very lively');
        gettext('How active or passive did what you have just heard make you feel?');
        gettext('Weak (without control, submissive)');
        gettext('Empowered (in control of everything, dominant)');
        gettext('How in control did you feel?');
        gettext('Not at all engaged, my mind was elsewhere');
        gettext('Very drowsy');
        gettext('Very lively');
        gettext('Weak (without control, submissive)');
        gettext('Empowered (in control of everything, dominant)');
        gettext('How in control did you feel?');
        gettext('Not at all');
        gettext('Very tense');
        gettext('Very relaxed');
        gettext('How tense or relaxed did you feel while you were listening?');
        gettext('I hated it');
        gettext('I loved it');
        gettext('How much did you like/dislike what you have just heard?');
        gettext('I had never heard it before');
        gettext('I listen to it regularly');
        gettext('How familiar are you with what you have just heard?');
        gettext('Age');
        gettext('How would you rate your musical expertise?');
        gettext('Do you have any hearing impairments? (If so, you may still participate in the experiment!)');
        gettext('Additional Questions');
        gettext('How well do the following statements describe your personality?');
        gettext('I see myself as someone who is reserved.');
        gettext('Disagree strongly');
        gettext('Disagree a little');
        gettext('Neither agree nor disagree');
        gettext('Agree a little');
        gettext('Agree strongly');
        gettext('I see myself as someone who is generally trusting.');
        gettext('I see myself as someone who tends to be lazy.');
        gettext('I see myself as someone who is relaxed, handles stress well.');
        gettext('I see myself as someone who has few artistic interests.');
        gettext('I see myself as someone who is outgoing, sociable.');
        gettext('I see myself as someone who tends to find fault with others.');
        gettext('I see myself as someone who does a thorough job.');
        gettext('I see myself as someone who gets nervous easily.');
        gettext('I see myself as someone who has an active imagination.');
        gettext('This questionnaire uses some simple scales to find out how you responded to the media excerpt. We will compare your responses to the biosignals that we measured as you were listening.');
        gettext('Final Questions');
        gettext('How concentrated were you during this experiment?');
        gettext('Very distracted');
        gettext('Very concentrated');
        gettext('1');
        gettext('2');
        gettext('3');
        gettext('4');
        gettext('5');
        gettext('6');
        gettext('7');
        gettext('8');
        gettext('9');
        gettext('10');
        gettext('11');
        gettext('12');
        gettext('13');
        gettext('14');
        gettext('15');
        gettext('16');
        gettext('17');
        gettext('18');
        gettext('19');
        gettext('20');
        gettext('21');
        gettext('22');
        gettext('23');
        gettext('24');
        gettext('25');
        gettext('26');
        gettext('27');
        gettext('28');
        gettext('29');
        gettext('30');
        gettext('31');
        gettext('32');
        gettext('33');
        gettext('34');
        gettext('35');
        gettext('36');
        gettext('37');
        gettext('38');
        gettext('39');
        gettext('40');
        gettext('41');
        gettext('42');
        gettext('43');
        gettext('44');
        gettext('45');
        gettext('46');
        gettext('47');
        gettext('48');
        gettext('49');
        gettext('50');
        gettext('51');
        gettext('52');
        gettext('53');
        gettext('54');
        gettext('55');
        gettext('56');
        gettext('57');
        gettext('58');
        gettext('59');
        gettext('60');
        gettext('61');
        gettext('62');
        gettext('63');
        gettext('64');
        gettext('65');
        gettext('66');
        gettext('67');
        gettext('68');
        gettext('69');
        gettext('70');
        gettext('71');
        gettext('72');
        gettext('73');
        gettext('74');
        gettext('75');
        gettext('76');
        gettext('77');
        gettext('78');
        gettext('79');
        gettext('80');
        gettext('81');
        gettext('82');
        gettext('83');
        gettext('84');
        gettext('85');
        gettext('86');
        gettext('87');
        gettext('88');
        gettext('89');
        gettext('90');
        gettext('91');
        gettext('92');
        gettext('93');
        gettext('94');
        gettext('95');
        gettext('96');
        gettext('97');
        gettext('98');
        gettext('99');
        gettext('100');
        gettext('101');
        gettext('102');
        gettext('103');
        gettext('104');
        gettext('105');
        gettext('106');
        gettext('107');
        gettext('108');
        gettext('109');
        gettext('110');
        gettext('111');
        gettext('112');
        gettext('113');
        gettext('114');
        gettext('115');
        gettext('116');
        gettext('117');
        gettext('118');
        gettext('119');
        gettext('120');
        gettext('121');
        gettext('Begin Playback');
    }
]);

'use strict';

/**
 * This **is not**, in fact, a class, but rather a file for defining the
 * routes that are used in your application. You should only need to edit
 * this file if you wish to add *new* routes.
 *
 * The file configures Angular UI's
 * [`$stateProvider`](https://github.com/angular-ui/ui-router/wiki) to create
 * the routes. Each route is created by a single call to
 * [`$stateProvider.state()`](http://angular-ui.github.io/ui-router/site/#/api/ui.router.state.$stateProvider#methods_state).
 *
 * The following is a snippet of the top several lines of the file. The
 * first six lines can be ignored. The call to `$stateProvider.state()` is
 * the first of many such calls in the file. This call in particular
 * configures the `'home'` state. Based on the information given in this
 * call, the `'home'` state will be accessible by browsing to the root path
 * of the application (`http://<YOURSERVER>:3000/`). The app will use the
 * file at `templateURL` (here, `modules/core/views/home.client.view.html`)
 * to render this state.
 *
 * To add your own state, simply add another call to
 * `$stateProvider.state()`. The name of the state should match the name of
 * the slide in your schema structure document (see the [README](index.html)).
 *
 * @example
 *
 * angular.module('core').config(['$stateProvider', '$urlRouterProvider',
 *     function ($stateProvider, $urlRouterProvider) {
 *
 *         // Redirect to home view when route not found
 *         $urlRouterProvider.otherwise('/');
 *
 *         // Home state routing
 *         $stateProvider
 *             .state('home', {
 *                 url: '/',
 *                 templateUrl: 'modules/core/views/home.client.view.html'
 *             })
 *
 *         ...
 *
 * @class Angular.Routes
 * @memberof Angular
 */

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {

        var $log =  angular.injector(['ng']).get('$log');
        $log.debug('Configuring routes in' +
            ' modules/core/config/core.client.routes.js');

        // Redirect to home view when route not found
        $urlRouterProvider.otherwise('/');

        // Home state routing
        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'modules/core/views/home.client.view.html'
            })
            .state('start', {
                url: '/start',
                templateUrl: 'modules/core/views/start.client.view.html'
            })
            .state('consent-form', {
                url: '/consent-form',
                templateUrl: 'modules/core/views/consent-form.client.view.html'
            })
            .state('sound-test', {
                url: '/sound-test',
                templateUrl: 'modules/core/views/sound-test.client.view.html'
            })
            .state('eda-instructions', {
                url: '/eda-instructions',
                templateUrl: 'modules/core/views/eda-instructions.client.view.html'
            })
            .state('pox-instructions', {
                url: '/pox-instructions',
                templateUrl: 'modules/core/views/pox-instructions.client.view.html'
            })
            .state('signal-test', {
                url: '/signal-test',
                templateUrl: 'modules/core/views/signal-test.client.view.html'
            })
            .state('demographics', {
                url: '/demographics',
                templateUrl: 'modules/core/views/demographics.client.view.html'
            })
            .state('musical-background', {
                url: '/musical-background',
                templateUrl: 'modules/core/views/musical-background.client.view.html'
            })
            .state('media-playback', {
                url: '/media-playback',
                templateUrl: 'modules/core/views/media-playback.client.view.html'
            })
            .state('questionnaire', {
                url: '/media-questionnaire',
                templateUrl: 'modules/core/views/media-questionnaire.client.view.html'
            })
            .state('emotion-index', {
                url: '/emotion-index',
                templateUrl: 'modules/core/views/emotion-index.client.view.html'
            })
            .state('thank-you', {
                url: '/thank-you',
                templateUrl: 'modules/core/views/thank-you.client.view.html'
            });
    }
]);

'use strict';

/**
 * In the demo application, the `DemographicsController` was the primary
 * controller used for the `'demographics'` state. This controller provides
 * functionality for passing responses from the form in the demographics
 * state on to the {@link Angular.TrialData|TrialData} service. Note,
 * however, that in the demo application, the demographics questionnaire is
 * now dynamically generated using a `'questionnaire'` slide in the study
 * specification document (see the [README](index.html)). The
 * `DemographicsController` and
 * view are still here for you to use, however.
 *
 * @class Angular.DemographicsController
 */

angular.module('core').controller('DemographicsController', ['$scope', 'TrialData', '$log',
    function($scope, TrialData, $log) {

        $log.debug('Loading DemographicsController.');

        /**
         * The `DemographicsController`'s `$scope` object. All properties on
         * `$scope` are available to the view.
         *
         * @name $scope
         * @namespace
         * @instance
         * @memberof Angular.DemographicsController
         * @type {{}}
         */

        /**
         * An array of nationalities.
         *
         * Every nationality in this array is
         * also included in the {@link Angular.MissingKeys|missing keys
         * file}. To make additional nationalities available, add them both
         * here and there.
         *
         * @name nationalities
         * @memberof Angular.DemographicsController#$scope
         * @instance
         * @type {string[]}
         */
        $scope.nationalities = ['Afghan', 'Albanian', 'Algerian', 'American',
            'Andorran', 'Angolan', 'Antiguans', 'Argentinean', 'Armenian',
            'Australian', 'Austrian', 'Azerbaijani', 'Bahamian', 'Bahraini',
            'Bangladeshi', 'Barbadian', 'Barbudans', 'Batswana', 'Belarusian',
            'Belgian', 'Belizean', 'Beninese', 'Bhutanese', 'Bolivian',
            'Bosnian', 'Brazilian', 'British', 'Bruneian', 'Bulgarian',
            'Burkinabe', 'Burmese', 'Burundian', 'Cambodian', 'Cameroonian',
            'Canadian', 'Cape Verdean', 'Central African', 'Chadian',
            'Chilean', 'Chinese', 'Colombian', 'Comoran', 'Congolese',
            'Costa Rican', 'Croatian', 'Cuban', 'Cypriot', 'Czech', 'Danish',
            'Djibouti', 'Dominican', 'Dutch', 'East Timorese', 'Ecuadorean',
            'Egyptian', 'Emirian', 'Equatorial Guinean', 'Eritrean',
            'Estonian', 'Ethiopian', 'Fijian', 'Filipino', 'Finnish', 'French',
            'Gabonese', 'Gambian', 'Georgian', 'German', 'Ghanaian', 'Greek',
            'Grenadian', 'Guatemalan', 'Guinea-Bissauan', 'Guinean',
            'Guyanese', 'Haitian', 'Herzegovinian', 'Honduran', 'Hungarian',
            'I-Kiribati', 'Icelander', 'Indian', 'Indonesian', 'Iranian',
            'Iraqi', 'Irish', 'Israeli', 'Italian', 'Ivorian', 'Jamaican',
            'Japanese', 'Jordanian', 'Kazakhstani', 'Kenyan',
            'Kittian and Nevisian', 'Kuwaiti', 'Kyrgyz', 'Laotian', 'Latvian',
            'Lebanese', 'Liberian', 'Libyan', 'Liechtensteiner', 'Lithuanian',
            'Luxembourger', 'Macedonian', 'Malagasy', 'Malawian', 'Malaysian',
            'Maldivan', 'Malian', 'Maltese', 'Marshallese', 'Mauritanian',
            'Mauritian', 'Mexican', 'Micronesian', 'Moldovan', 'Monacan',
            'Mongolian', 'Moroccan', 'Mosotho', 'Motswana', 'Mozambican',
            'Namibian', 'Nauruan', 'Nepalese', 'New Zealander', 'Nicaraguan',
            'Nigerian', 'Nigerien', 'North Korean', 'Northern Irish',
            'Norwegian', 'Omani', 'Pakistani', 'Palauan', 'Panamanian',
            'Papua New Guinean', 'Paraguayan', 'Peruvian', 'Polish',
            'Portuguese', 'Qatari', 'Romanian', 'Russian', 'Rwandan',
            'SaintLucian', 'Salvadoran', 'Samoan', 'San Marinese',
            'Sao Tomean', 'Saudi', 'Scottish', 'Senegalese', 'Serbian',
            'Seychellois', 'Sierra Leonean', 'Singaporean', 'Slovakian',
            'Slovenian', 'Solomon Islander', 'Somali', 'South African',
            'South Korean', 'Spanish', 'Sri Lankan', 'Sudanese', 'Surinamer',
            'Swazi', 'Swedish', 'Swiss', 'Syrian', 'Taiwanese', 'Tajik',
            'Tanzanian', 'Thai', 'Togolese', 'Tongan',
            'Trinidadian or Tobagonian', 'Tunisian', 'Turkish', 'Tuvaluan',
            'Ugandan', 'Ukrainian', 'Uruguayan', 'Uzbekistani', 'Venezuelan',
            'Vietnamese', 'Welsh', 'Yemenite', 'Zambian', 'Zimbabwean'
        ];

        /**
         * An array of years.
         *
         * By default, this is a list of every year from one hundred years
         * before the current year up to and including the current year.
         *
         * @name years
         * @memberof Angular.DemographicsController#$scope
         * @instance
         * @type {number[]}
         */
        $scope.years = [];
        var thisYear = new Date().getFullYear();
        for (var i = thisYear; i >= thisYear - 110; i--) {
            $scope.years.push(i);
        }

        /**
         * Save nationality selection to the {@link
         * Angular.TrialData|TrialData} service.
         *
         * The value of `nationality` is converted to lower case and saved
         * in `TrialData.data.answers.nationality`.
         *
         * @function nationalityChanged
         * @memberof Angular.DemographicsController#$scope
         * @instance
         * @param {string} nationality The new nationality
         * @return {undefined}
         */
        $scope.nationalityChanged = function(nationality) {
            $log.info('Nationality changed to ' + nationality + '.');
            TrialData.data.answers.nationality =
                nationality.toString().toLowerCase();
        };

        /**
         * Save year selection to the {@link Angular.TrialData|TrialData}
         * service.
         *
         * The value of `year` is converted to
         * `TrialData.data.answers.dob`.
         *
         * @function yearChanged
         * @memberof Angular.DemographicsController#$scope
         * @instance
         * @param {string} year The new year
         * @return {undefined}
         */
        $scope.yearChanged = function(year) {
            $log.info('Year changed to ' + year + '.');
            TrialData.data.answers.dob = year;
        };

        /**
         * Save gender selection to the {@link Angular.TrialData|TrialData}
         * service.
         *
         * The value of `gender` is converted to
         * `TrialData.data.answers.sex`.
         *
         * @function genderChanged
         * @memberof Angular.DemographicsController#$scope
         * @instance
         * @param {string} gender The new gender
         * @return {undefined}
         */
        $scope.genderChanged = function(gender) {
            $log.info('Gender changed to ' + gender + '.');
            TrialData.data.answers.sex = gender;
        };
    }
]);

'use strict';

/**
 * In the demo application, the `DemographicsController` is the primary
 * controller used for the `'emotion-index'` state. This controller makes
 * emotion index information available on its `$scope`.
 *
 * @class Angular.EmotionIndexController
 */

angular.module('core').controller('EmotionIndexController', [
    '$scope',
    'TrialData',
    '$log',
    function($scope, TrialData, $log) {

        $log.debug('Loading EmotionIndexController.');

        /**
         * The `EmotionIndexController`'s `$scope` object. All properties on
         * `$scope` are available to the view.
         *
         * @name $scope
         * @namespace
         * @instance
         * @memberof Angular.EmotionIndexController
         * @type {{}}
         */

        /**
         * Available emotion indices.
         *
         * If defined, this array contains the emotion indices for the
         * listenings conducted during this experiment session (retrieved
         * from `TrialData.data.answers.emotion_indices`).
         *
         * @name emotionIndices
         * @memberof Angular.EmotionIndexController#$scope
         * @instance
         * @type {number[]}
         */
        $scope.emotionIndices = TrialData.data.answers.emotion_indices;
    }
]);

'use strict';

/**
 * In the demo application, the `HomeController` is the primary
 * controller used for the `'home'` state. This controller resets the
 * {@link Angular.ExperimentManager|ExperimentManager} service and, when
 * successful, sets the `readyToAdvance` flag on its `$scope` to `true`.
 *
 * @class Angular.HomeController
 */

angular.module('core').controller('HomeController', ['ExperimentManager', '$scope', '$log',
    function(ExperimentManager, $scope, $log) {

        $log.debug('Loading HomeController.');

        // Reset ExperimentManager for new trial
        ExperimentManager.masterReset().then(
            function experimentResetSuccessHandler() {
                $scope.readyToAdvance = true;
            },
            function experimentResetErrorHandler() {
                $scope.addGenericErrorAlert();
                throw new Error('An experiment schema could not be fetched ' +
                    'from the server');
            }
        );

        /**
         * The `HomeController`'s `$scope` object. All properties on `$scope`
         * are available to the view.
         *
         * @name $scope
         * @namespace
         * @instance
         * @memberof Angular.HomeController
         * @type {{}}
         */

        /**
         * Ready to advance flag.
         *
         * On instantiation of the controller, this is set to `false`. Once
         * the {@link Angular.ExperimentManager|ExperimentManager} is reset,
         * this flag is set to `true`.
         *
         * @name readyToAdvance
         * @memberof Angular.HomeController#$scope
         * @instance
         * @type {boolean}
         */

        // Ready to move to next slide?
        $scope.readyToAdvance = false;

    }
]);
'use strict';

/**
 * The `LastScreenController` simply posts the object in `TrialData.data` to
 * the `/api/trials` API endpoint on the server to be written to a file.
 *
 * @class Angular.LastScreenController
 * @see Angular.TrialData
 * @see Node.module:TrialServerRoutes
 * @see Node.module:TrialServerController
 */

angular.module('core').controller(
    'LastScreenController',
    [
        '$scope',
        'TrialData',
        '$http',
        '$log',
        function($scope, TrialData, $http, $log) {

            $log.debug('Loading LastScreenController.');

            // Send TrialData.data to the backend
            $http
                .post('/api/trials', TrialData.data)
                .catch(function(response) {
                    var errorMessage = 'The POST to /api/trials failed.';
                    $log.error(errorMessage, response);
                    throw new Error(errorMessage);
                });
        }
    ]);

'use strict';

/**
 * In the demo application, the `MasterController` is persistent throughout
 * an experiment session and provides a number of 'session-wide' facilities.
 * These include restarting a session, exposing the {@link
 * Angular.TrialData|TrialData} service, changing the language, configuring
 * hotkeys, showing alerts, and blacking out the screen.
 *
 * The hotkeys are configured using the
 * [angular-hotkeys](https://github.com/chieffancypants/angular-hotkeys)
 * module. In particular, pressing `'d'` twice will toggle debugging mode. When
 * in debugging mode, the right arrow key will allow the user to advance to
 * the next slide. Also, in debugging mode, nothing blocks the user from
 * advancing through slides (e.g., the user can advance irrespective of
 * whether or not Max is ready).
 *
 * @class Angular.MasterController
 */

angular.module('core').controller(
    'MasterController',
    [
        '$scope',
        'TrialData',
        'hotkeys',
        'ExperimentManager',
        'gettextCatalog',
        '$state',
        '$timeout',
        '$log',
        '$http',
        function($scope, TrialData, hotkeys, ExperimentManager, gettextCatalog,
                 $state, $timeout, $log, $http) {

            $log.debug('Loading MasterController.');

            /**
             * The `MasterController`'s `$scope` object. All properties on
             * `$scope` are available to the view.
             *
             * @name $scope
             * @namespace
             * @instance
             * @memberof Angular.MasterController
             * @type {{}}
             */
            var thisController = this;

            /**
             * Sets the language to the default language as specified in the
             * {@link Node.module:CustomConfiguration~customConfiguration~defaultLanguage|CustomConfiguration}
             * module.
             *
             * @function setLanguageToDefault
             * @memberof Angular.MasterController
             * @instance
             * @return {undefined}
             */
            this.setLanguageToDefault = function() {
                $http.get('/api/config')
                    .then(function(response) {

                        if (response.data.hasOwnProperty('defaultLanguage')) {
                            $scope.setLanguage(response.data.defaultLanguage);
                        } else {
                            var message = 'A default language was not ' +
                                'provided by the server.';
                            $log.error(message, response);
                            throw new Error(message);
                        }
                    })
                    .catch(function(response) {
                        var message = 'There was a problem retrieving the' +
                            ' configuration from the server.';
                        $log.error(message, response);
                        throw new Error(message);
                    });
            };
            this.setLanguageToDefault();

            /**
             * Expose {@link Angular.TrialData#toJson|TrialData#toJson} on
             * `$scope`. Calling this method returns the result of calling
             * {@link Angular.TrialData#toJson|TrialData#toJson}.
             *
             * @function trialDataJson
             * @memberof Angular.MasterController#$scope
             * @instance
             * @type {{}}
             */
            $scope.trialDataJson = function() {
                return TrialData.toJson();
            };

            /**
             * Set the current language used for displaying content. Ensure
             * that you have translations available and compiled (see the
             * [README](index.html)).
             *
             * @function setLanguage
             * @memberof Angular.MasterController#$scope
             * @instance
             * @param {string} language The language code of the language to use
             * @return {undefined}
             */
            $scope.setLanguage = function(language) {

                $log.debug('MasterController setting language to \'' +
                    language + '\'.');

                gettextCatalog.setCurrentLanguage(language);
                TrialData.language(language);
            };

            /**
             * Return to the `'home'` state.
             *
             * @function startOver
             * @memberof Angular.MasterController#$scope
             * @instance
             * @return {undefined}
             */
            $scope.startOver = function() {

                $log.debug('MasterController starting over.');

                $state.go('home', {}, {reload: true});

                $scope.debugMode = false;

                $scope.alerts = [];

                thisController.setLanguageToDefault();
            };

            /**
             * Resets the inactivity timeout.
             *
             * The demo application ships with an inactivity timeout. If
             * after five minutes no interaction with the experiment has
             * occurred, this timeout fires and calls {@link
             * Angular.MasterController#$scope#startOver|$scope#startOver}
             * method.
             *
             * @function resetInactivityTimeout
             * @memberof Angular.MasterController
             * @instance
             * @return {undefined}
             */
            // Reset inactivity timeout with a new five-minute timer
            this.resetInactivityTimeout = function() {

                $log.debug('MasterController resetting inactivity timeout.');

                $timeout.cancel(thisController.inactivityTimeout);
                thisController.inactivityTimeout = $timeout(
                    thisController.startOver,
                    5 * 60 * 1000
                );
            };
            this.resetInactivityTimeout();

            /**
             * Resets the inactivity timeout and Advances the slide by calling
             * {@link
             * Angular.ExperimentManager#advanceSlide|ExperimentManager#advanceSlide}.
             *
             * @function advanceSlide
             * @memberof Angular.MasterController#$scope
             * @instance
             * @return {undefined}
             */
            $scope.advanceSlide = function() {

                $log.debug('MasterController advancing slide.');

                // Reset the inactivity timeout
                thisController.resetInactivityTimeout();

                // Wrap ExperimentManager's advance slide
                ExperimentManager.advanceSlide();
            };

            /**
             * Indicates whether or not debugging mode is enabled.
             *
             * @name debugMode
             * @memberof Angular.MasterController#$scope
             * @type {boolean}
             */
            $scope.debugMode = false;

            /**
             * Toggles debugging mode. If debugging mode is enabled, an
             * alert is posted to the view.
             *
             * @function toggleDebugMode
             * @instance
             * @memberof Angular.MasterController#$scope
             * @return {undefined}
             */
            $scope.toggleDebugMode = function() {

                $scope.debugMode = !$scope.debugMode;
                var alertMessage = 'Debug mode has been ';
                if ($scope.debugMode) {
                    $log.info('Debug mode enabled.');
                    alertMessage += 'enabled.';
                } else {
                    $log.info('Debug mode disabled.');
                    alertMessage += 'disabled.';
                }

                $scope.addAlert({type: 'info', msg: alertMessage});
            };

            // Setup hotkeys
            $log.debug('Setting up hotkeys.');
            hotkeys.add({
                combo: 'd d',
                description: 'Toggle debug mode',
                callback: $scope.toggleDebugMode
            });

            hotkeys.add({
                combo: 'right',
                description: 'Advance slide',
                callback: $scope.advanceSlide
            });

            /**
             * Array for holding alert messages.
             *
             * @name alerts
             * @type {string[]}
             * @memberof Angular.MasterController#$scope
             * @instance
             */
            $scope.alerts = [];

            /**
             * Adds an alert to {@link
             * Angular.MasterController#$scope#alerts|$scope#alerts}, unless
             * it is already present.
             *
             * @function addAlert
             * @memberof Angular.MasterController#$scope
             * @instance
             * @param {{}} alert This object should have two properties:
             * `msg` and `type`. The value of the `msg` property should be
             * the alert `string`, and the value of the `type` property should
             * be a `string` indicating the alert type. Acceptable values
             * for alerty types are: `'success'`, `'info'`, `'warning'`, and
             * `'danger'`.
             * @return {undefined}
             */
            $scope.addAlert = function(alert) {

                var errorExists = false;
                for (var i = 0; i < $scope.alerts.length; i++) {
                    if ($scope.alerts[i].msg === alert.msg &&
                        $scope.alerts[i].type === alert.type) {

                        $log.debug('Not adding ' + alert.msg + ' to visible' +
                            ' alerts, as it already exists in $scope.alerts.');
                        errorExists = true;
                        break;
                    }
                }

                if (!errorExists) {
                    $log.debug('Adding \'' + alert.msg + '\' to' +
                        ' $scope.alerts.');
                    $scope.alerts.push(alert);
                }
            };

            /**
             * Closes the alert in {@link
             * Angular.MasterController#$scope#alerts|$scope#alerts} at the
             * specified index.
             *
             * @function closeAlert
             * @memberof Angular.MasterController#$scope
             * @instance
             * @param {number} index The index in the {@link
             * Angular.MasterController#$scope#alerts|$scope#alerts} array
             * of the alert to close
             * @return {undefined}
             */
            $scope.closeAlert = function(index) {
                $log.debug('Closing alert at index ' + index + ': \'' +
                    $scope.alerts[index].msg + '\'');
                $scope.alerts.splice(index, 1);
            };

            /**
             * Adds a generic error alert to {@link
             * Angular.MasterController#$scope#alerts|$scope#alerts}. The
             * alert is a `'danger'`-type alert, and in the demo app
             * displays the message `'There seems to be a problem. Please
             * contact a mediator for assistance.'`
             *
             * @function addGenericErrorAlert
             * @memberof Angular.MasterController#$scope
             * @instance
             * @return {undefined}
             */
            $scope.addGenericErrorAlert = function() {
                $log.debug('Adding generic error alert.');
                $scope.addAlert({
                    type: 'danger',
                    msg: 'There seems to be a problem. Please contact a ' +
                        'mediator for assistance.'
                });
            };

            /**
             * A flag indicating whether or not the 'blackout' class should
             * be added to the body of the visible page. When this is
             * `true`, the page is blacked out.
             *
             * @name blackoutClass
             * @memberof Angular.MasterController#$scope
             * @instance
             * @type {boolean}
             */
            $scope.blackoutClass = false;

            /**
             * A convenience method for setting {@link
             * Angular.MasterController#$scope#blackoutClass|$scope#blackoutClass}
             * to `true` (and blacking out the page).
             *
             * @function hideBody
             * @memberof Angular.MasterController#$scope
             * @instance
             * @return {undefined}
             */
            $scope.hideBody = function() {
                $log.debug('Hiding body.');
                $scope.blackoutClass = true;
            };

            /**
             * A convenience method for setting {@link
                * Angular.MasterController#$scope#blackoutClass|$scope#blackoutClass}
             * to `false` (and reversing the blacking out of the page).
             *
             * @function showBody
             * @memberof Angular.MasterController#$scope
             * @instance
             * @return {undefined}
             */
            $scope.showBody = function() {
                $log.debug('Showing body.');
                $scope.blackoutClass = false;
            };

            /**
             * A convenience method for toggling the value of {@link
                * Angular.MasterController#$scope#blackoutClass|$scope#blackoutClass}.
             *
             * @function toggleBodyVisibility
             * @memberof Angular.MasterController#$scope
             * @instance
             * @return {undefined}
             */
            $scope.toggleBodyVisibility = function() {
                $log.debug('Toggling body visibility.');
                $scope.blackoutClass = !$scope.blackoutClass;
            };
        }
    ]);
'use strict';

/**
 * In the demo application, the `MediaPlaybackController` is responsible for
 * initiating the playback of media excerpts.
 *
 * @class Angular.MediaPlaybackController
 */

angular.module('core').controller('MediaPlaybackController', [
    '$scope',
    'TrialData',
    'SocketIOService',
    '$timeout',
    'ExperimentManager',
    '$log',
    function($scope, TrialData, SocketIOService, $timeout,
             ExperimentManager, $log) {

        $log.debug('Loading MediaPlaybackController.');

        var thisController = this;

        /**
         * The `MediaPlaybackController`'s `$scope` object. All properties on
         * `$scope` are available to the view.
         *
         * @name $scope
         * @namespace
         * @instance
         * @memberof Angular.MediaPlaybackController
         * @type {{}}
         */

        /**
         * The initial label for the button in the view.
         *
         * @name currentButtonLabel
         * @memberof Angular.MediaPlaybackController#$scope
         * @instance
         * @type {string}
         */
        $scope.currentButtonLabel = 'Begin Playback';

        /**
         * Indicates whether or not the media excerpt has been played.
         *
         * @name mediaHasPlayed
         * @memberof Angular.MediaPlaybackController#$scope
         * @instance
         * @type {boolean}
         */
        $scope.mediaHasPlayed = false;

        /**
         * Indicates whether or not the 'continue' button is disabled.
         *
         * @name buttonDisabled
         * @memberof Angular.MediaPlaybackController#$scope
         * @instance
         * @type {boolean}
         */
        $scope.buttonDisabled = false;

        // Send media playback message to Max
        /**
         * Sends a message to the Max helper application to initiate media
         * playback. The message includes the current session number and the
         * media label (according to the [study specification
         * document](index.html)), both retrieved from the {@link
         * Angular.TrialData|TrialData} service. This object sent with this
         * message is formatted like the following:
         *
         * ```
         * {
         *     oscType: 'message,
         *     address: '/eim/control/mediaID',
         *     args: [
         *         {
         *             type: 'string',
         *             value: <MEDIALABEL>
         *         },
         *         {
         *             type: 'string',
         *             value: <SESSIONNUMBER>
         *         }
         *     ]
         * }
         * ```
         *
         * When this method is called, {@link
         * Angular.MediaPlaybackController#$scope#buttonAction|$scope#buttonAction}
         * is bound to {@link Angular.ExperimentManager#advanceSlide|ExperimentManager#advanceSlide}.
         *
         * @function startMediaPlayback
         * @memberof Angular.MediaPlaybackController#$scope
         * @instance
         * @return {undefined}
         */
        $scope.startMediaPlayback = function() {

            var mediaIndex = TrialData.data.state.mediaPlayCount;
            var mediaLabel = TrialData.data.media[mediaIndex].label;

            $log.debug('Requesting playback of \'' + mediaLabel + '\'.');

            SocketIOService.emit('sendOSCMessage', {
                oscType: 'message',
                address: '/eim/control/mediaID',
                args: [
                    {
                        type: 'string',
                        value: '' + mediaLabel
                    },
                    {
                        type: 'string',
                        value: '' + TrialData.data.metadata.session_number
                    }
                ]
            });

            $log.debug('Binding $scope.buttonAction in' +
                ' MediaPlaybackController to ExperimentManager.advanceSlide');

            $scope.buttonAction = ExperimentManager.advanceSlide;
        };

        /**
         * The method to which the button in the view is bound. Initially,
         * the button is bound to {@link
         * Angular.MediaPlaybackController#$scope#startMediaPlayback|$scope#startMediaPlayback}.
         *
         * @name buttonAction
         * @memberof Angular.MediaPlaybackController#$scope
         * @instance
         * @type {function}
         */
        $scope.buttonAction = $scope.startMediaPlayback;

        /**
         * Requests the most recently recorded emotion index from the server
         * over OSC. The message used to retrieve this value is like the
         * following:
         *
         * ```
         * {
         *     oscType: 'message',
         *     address: '/eim/control/emotionIndex',
         *     args: [
         *         {
         *             type: 'string',
         *             value: <SESSIONNUMBER>
         *         }
         *     ]
         * }
         * ```
         *
         * @function requestEmotionIndex
         * @memberof Angular.MediaPlaybackController
         * @instance
         * @return {undefined}
         */
        this.requestEmotionIndex = function() {

            $log.debug('Requesting emotion index.');

            SocketIOService.emit('sendOSCMessage', {
                oscType: 'message',
                address: '/eim/control/emotionIndex',
                args: [
                    {
                        type: 'string',
                        value: '' + TrialData.data.metadata.session_number
                    }
                ]
            });
        };

        /**
         * This method is called when the server fires the
         * `oscMessageReceived` event on the socket.io socket to which the
         * client is connected.
         *
         * The message may indicate one of three things:
         *
         * 1. Playback has begun
         *  - In this case, the page is simply blacked out.
         * 2. Playback has ended
         *  - Here, the blackout is removed, the emotion index is requestd,
         *  {@link Angular.MediaPlaybackController#$scope#currentButtonLabel|$scope#currentButtonLabel}
         *  is set to `'Continue'`, {@link Angular.MediaPlaybackController#$scope#mediaHasPlayed|$scope#mediaHasPlayed}
         *  is set to `true`, and {@link Angular.MediaPlaybackController#$scope#buttonDisabled|$scope#buttonDisabled} is set to `true`.
         * 3. The emotion index has been received
         *  - In this last case, {@link Angular.TrialData|TrialData} is
         *  updated with the received emotion index, {@link Angular.MediaPlaybackController#$scope#buttonDisabled|$scope#buttonDisabled}
         *  is set to `false`, and the slide is advanced by calling
         *  {@link Angular.ExperimentManager#advanceSlide|ExperimentManager#advanceSlide}.
         *
         * The receipt of unexpected or malformed messages will result in a
         * warning on the console.
         *
         * @function oscMessageReceivedListener
         * @memberof Angular.MediaPlaybackController
         * @instance
         * @param {{}} data The data sent with the event
         * @return {undefined}
         * @see Node.module:SocketServerController
         */
        this.oscMessageReceivedListener = function(data) {

            $log.debug('OSC message received.');
            $log.debug(data);

            var expectedMessageAddresses = [
                '/eim/status/playback',
                '/eim/status/emotionIndex'
            ];

            // Make sure data is an object with an address property, and that
            // we expect the message
            if (typeof data === 'object' &&
                !Array.isArray(data) &&
                data.hasOwnProperty('address') &&
                expectedMessageAddresses.indexOf(data.address) >= 0) {

                // If it was a media playback message
                if (data.address === '/eim/status/playback') {

                    // Check for start or stop message
                    switch (parseInt(data.args[0].value)) {

                        // If it was a stop message
                        case 0:

                            // Request emotion index from Max
                            thisController.requestEmotionIndex();

                            // Fade in screen
                            $scope.showBody();

                            // Update state
                            $timeout(function() {
                                $scope.$apply(function() {
                                    $scope.currentButtonLabel = 'Continue';
                                    $scope.mediaHasPlayed = true;
                                    $scope.buttonDisabled = true;
                                });
                            });
                            break;

                        // If it was a start message
                        case 1:

                            // Fade out screen
                            $scope.hideBody();
                            break;
                    }
                }

                // If it was an emotion index message
                if (data.address === '/eim/status/emotionIndex') {

                    var emotionIndex = parseInt(data.args[0].value);

                    // Increment media play count
                    TrialData.data.state.mediaPlayCount++;

                    // Set emotion index in TrialData
                    TrialData.setValueForPathForCurrentMedia(
                        'data.answers.emotion_indices',
                        emotionIndex
                    );

                    // Update state
                    $timeout(function() {
                        $scope.$apply(function() {
                            $scope.buttonDisabled = false;
                            ExperimentManager.advanceSlide();
                        });
                    });
                }
            } else {
                $log.warn(
                    'MediaPlaybackController did not handle an OSC message.',
                    data
                );
            }
        };

        // Attach OSC message received listener
        SocketIOService.on(
            'oscMessageReceived',
            this.oscMessageReceivedListener
        );

        // Send a message to stop media playback when this controller is
        // destroyed. Also, remove OSC message event listeners.
        $scope.$on('$destroy', function stopMediaPlayback() {

            $log.debug('MediaPlaybackController scope destroyed. Stopping' +
                ' playback, removing OSC listener, and showing body.');

            SocketIOService.emit('sendOSCMessage', {
                oscType: 'message',
                address: '/eim/control/stopMedia',
                args: {
                    type: 'string',
                    value: '' + TrialData.data.metadata.session_number
                }
            });

            SocketIOService.removeListener(
                'oscMessageReceived',
                thisController.oscMessageReceivedListener
            );

            $scope.showBody();
        });
    }
]);

'use strict';

/**
 * In the demo application, the `QuestionnaireController` is responsible for
 * making questionnaire data (as specified in the [study specification
 * document](index.html) and retrieved through the {@link
 * Angular.TrialData|TrialData} service) available on its `$scope`. All of
 * the 'hard' work of dynamically constructing questionnaires is
 * accomplished through various directives:
 *
 * - {@link Angular.questionnaireDirective|questionnaireDirective}
 * - {@link Angular.checkboxQuestionDirective|checkboxQuestionDirective}
 * - {@link Angular.dropdownQuestionDirective|dropdownQuestionDirective}
 * - {@link Angular.radioQuestionDirective|radioQuestionDirective}
 * - {@link Angular.scaleQuestionDirective|scaleQuestionDirective}
 *
 * @class Angular.QuestionnaireController
 * @see Angular.questionnaireDirective
 * @see Angular.checkboxQuestionDirective
 * @see Angular.dropdownQuestionDirective
 * @see Angular.radioQuestionDirective
 * @see Angular.scaleQuestionDirective
 */

angular.module('core').controller('QuestionnaireController', [
    '$scope',
    'TrialData',
    '$log',
    function($scope, TrialData, $log) {

        $log.info('Loading QuestionnaireController.');

        /**
         * The `QuestionnaireController`'s `$scope` object. All properties on
         * `$scope` are available to the view.
         *
         * @name $scope
         * @namespace
         * @instance
         * @memberof Angular.QuestionnaireController
         * @type {{}}
         */

        /**
         * The questionnaire data retrieved from {@link
         * Angular.TrialData|TrialData}.
         *
         * @name questionnaireData
         * @memberof Angular.QuestionnaireController#$scope
         * @instance
         * @type {{}}
         */
        $scope.questionnaireData =
            TrialData.data.schema[TrialData.data.state.currentSlideIndex].data;
    }
]);

'use strict';

/**
 * The `SignalTestController` coordinates with Max to ensure that the
 * signals being received from connected sensors are of acceptable quality.
 *
 * @class Angular.SignalTestController
 */

angular.module('core').controller('SignalTestController', [
    '$scope',
    'SocketIOService',
    'TrialData',
    '$timeout',
    '$log',
    function($scope, SocketIOService, TrialData, $timeout, $log) {

        $log.debug('Loading SignalTestController.');

        var thisController = this;

        /**
         * The `SignalTestController`'s `$scope` object. All properties on
         * `$scope` are available to the view.
         *
         * @name $scope
         * @namespace
         * @instance
         * @memberof Angular.SignalTestController
         * @type {{}}
         */

        /**
         * Indicator of EDA signal quality.
         *
         * @name edaQuality
         * @memberof Angular.SignalTestController#$scope
         * @instance
         * @type {number}
         */
        $scope.edaQuality = 0;

        /**
         * Indicator of POX signal quality.
         *
         * @name poxQuality
         * @memberof Angular.SignalTestController#$scope
         * @instance
         * @type {number}
         */
        $scope.poxQuality = 0;

        /**
         * Indicates whether or not the test recording has been completed by
         * Max.
         *
         * @name testRecordingComplete
         * @memberof Angular.SignalTestController#$scope
         * @instance
         * @type {boolean}
         */
        $scope.testRecordingComplete = false;

        /**
         * Indicates whether or not the session is ready to advance. If the
         * app is either in debugging mode or {@link
         * Angular.SignalTestController#$scope#allSignalsGood|$scope#allSignalsGood}
         * is `true`, this method returns `true`.
         *
         * @function readyToAdvance
         * @memberof Angular.SignalTestController#$scope
         * @instance
         * @type {boolean}
         */
        $scope.readyToAdvance = function() {
            if ($scope.debugMode) {
                return true;
            } else {
                return $scope.allSignalsGood();
            }
        };

        /**
         * Indicates whether or not the signals are of acceptable quality.
         *
         * @function allSignalsGood
         * @memberof Angular.SignalTestController#$scope
         * @instance
         * @return {boolean} Returns `true` if both {@link
         * Angular.SignalTestController#$scope#edaQuality|$scope#edaQuality}
         * and {@link
         * Angular.SignalTestController#$scope#poxQuality|$scope#poxQuality}
         * are `true`.
         */
        $scope.allSignalsGood = function() {
            return $scope.edaQuality && $scope.poxQuality;
        };

        // Set a timeout to fire after 15 seconds
        $timeout(
            function() {
                thisController.sendStopSignalTestMessage();
                $timeout(
                    function() {
                        $scope.edaQuality = 1;
                        $scope.poxQuality = 1;
                    },
                    2.5 * 1000
                );
            },
            12.5 * 1000
        );

        /**
         * Sends a message to Max to start the signal quality test. This
         * message looks like the following:
         *
         * ```
         * {
         *     oscType: 'message',
         *     address: '/eim/control/signalTest',
         *     args: [
         *         {
         *             type: 'integer',
         *             value: 1
         *         },
         *         {
         *             type: 'string',
         *             value: <SESSIONNUMBER>
         *         }
         *     ]
         * }
         * ```
         *
         * @function sendStartSignalTestMessage
         * @memberof Angular.SignalTestController
         * @instance
         * @return {undefined}
         */
        this.sendStartSignalTestMessage = function() {

            $log.debug('Sending start signal test message to Max.');

            SocketIOService.emit('sendOSCMessage', {
                oscType: 'message',
                address: '/eim/control/signalTest',
                args: [
                    {
                        type: 'integer',
                        value: 1
                    },
                    {
                        type: 'string',
                        value: '' + TrialData.data.metadata.session_number
                    }
                ]
            });
        };

        /**
         * Sends a message to Max to stop the signal quality test. This
         * message looks like the following:
         *
         * ```
         * {
         *     oscType: 'message',
         *     address: '/eim/control/signalTest',
         *     args: [
         *         {
         *             type: 'integer',
         *             value: 0
         *         },
         *         {
         *             type: 'string',
         *             value: <SESSIONNUMBER>
         *         }
         *     ]
         * }
         * ```
         *
         * @function sendStopSignalTestMessage
         * @memberof Angular.SignalTestController
         * @instance
         * @return {undefined}
         */
        this.sendStopSignalTestMessage = function() {

            $log.debug('Sending stop signal test message to Max.');

            SocketIOService.emit('sendOSCMessage', {
                oscType: 'message',
                address: '/eim/control/signalTest',
                args: [
                    {
                        type: 'integer',
                        value: 0
                    },
                    {
                        type: 'string',
                        value: '' + TrialData.data.metadata.session_number
                    }
                ]
            });
        };

        /**
         * This method is called when the server fires the
         * `oscMessageReceived` event on the socket.io socket to which the
         * client is connected.
         *
         * If the message is a signal quality message, {@link
         * Angular.SignalTestController#$scope#edaQuality|$scope#edaQuality} or
         * {@link
         * Angular.SignalTestController#$scope#poxQuality|$scope#poxQuality}
         * is updated accordingly. If the message indicates that the test
         * recording is complete, {@link
         * Angular.SignalTestController#$scope#testRecordingComplete|$scope#testRecordingComplete}
         * is updated accordingly and {@link
         * Angular.SignalTestController#sendStopSignalTestMessage|sendStopSignalTestMessage}
         * is called.
         *
         * The receipt of unexpected or malformed messages will result in a
         * warning on the console.
         *
         * @function oscMessageReceivedListener
         * @memberof Angular.SignalTestController
         * @instance
         * @param {{}} data The data sent with the event
         * @return {undefined}
         * @see Node.module:SocketServerController
         */
        this.oscMessageReceivedListener = function(data) {

            console.info('SignalTesttController received an OSC message.');
            console.info(data);

            var expectedMessageAddresses = [
                '/eim/status/signalQuality/eda',
                '/eim/status/signalQuality/pox',
                '/eim/status/testRecordingComplete'
            ];

            // Make sure data is an object with an address property, and that
            // we expect the message
            if (typeof data === 'object' &&
                !Array.isArray(data) &&
                data.hasOwnProperty('address') &&
                expectedMessageAddresses.indexOf(data.address) >= 0) {

                // If it was an EDA signal quality message
                if (data.address === '/eim/status/signalQuality/eda') {

                    var edaQuality = data.args[0].value;
                    if (edaQuality === 0) {
                        $log.warn(
                            'Bad EDA signal detected on terminal ' +
                            TrialData.data.metadata.terminal +
                            '.'
                        );
                    }

                    // Update EDA signal quality
                    $scope.$apply(function updateEDAQuality() {
                        $scope.edaQuality = edaQuality;
                    });
                }

                // If it was a POX signal quality message
                if (data.address === '/eim/status/signalQuality/pox') {

                    var poxQuality = data.args[0].value;
                    if (poxQuality === 0) {
                        $log.warn(
                            'Bad POX signal detected on terminal ' +
                            TrialData.data.metadata.terminal +
                            '.'
                        );
                    }

                    // Update POX signal quality
                    $scope.$apply(function updatePOXQuality() {
                        $scope.poxQuality = poxQuality;
                    });
                }

                // If the test recording has complete
                if (data.address === '/eim/status/testRecordingComplete') {

                    // Update continue button
                    $scope.$apply(function() {
                        $scope.testRecordingComplete = true;
                    });

                    this.sendStopSignalTestMessage();
                }
            } else {
                $log.warn('SignalTestController did not handle an OSC message.', data);
            }
        };

        // Attach handler for incoming OSC messages
        SocketIOService.on(
            'oscMessageReceived',
            this.oscMessageReceivedListener
        );

        // Destroy handler for incoming OSC messages when $scope is destroyed,
        // and send stop signal test message
        var controller = this;
        $scope.$on('$destroy', function removeOSCMessageReceivedListener() {
            SocketIOService.removeListener(
                'oscMessageReceived',
                controller.oscMessageReceivedListener
            );
            controller.sendStopSignalTestMessage();
        });

        this.sendStartSignalTestMessage();
    }
]);

'use strict';

/**
 * The `SignalTestController` coordinates with Max to run a sound test. The
 * message to start the sound test is sent to Max immediately when the
 * controller is loaded.
 *
 * @class Angular.SoundTestController
 */

angular.module('core').controller('SoundTestController', [
    '$scope',
    'SocketIOService',
    'TrialData',
    'gettextCatalog',
    '$log',
    function($scope, SocketIOService, TrialData, gettextCatalog, $log) {

        $log.debug('Loading SoundTestController.');

        // Get current language
        var currentLanguage = gettextCatalog.currentLanguage;

        // Send a message to Max to start the sound test
        $log.debug('Sending start sound test message to Max.');
        SocketIOService.emit('sendOSCMessage', {
            oscType: 'message',
            address: '/eim/control/soundTest',
            args: [
                {
                    type: 'integer',
                    value: 1
                },
                {
                    type: 'string',
                    value: currentLanguage
                },
                {
                    type: 'string',
                    value: '' + TrialData.data.metadata.session_number
                }
            ]
        });

        /**
         * The `SoundTestController`'s `$scope` object. All properties on
         * `$scope` are available to the view.
         *
         * @name $scope
         * @namespace
         * @instance
         * @memberof Angular.SoundTestController
         * @type {{}}
         */

        /**
         * Sends a message to Max to stop the sound test. This message looks
         * like the following:
         *
         * ```
         * {
         *     oscType: 'message',
         *     address: '/eim/control/soundTest',
         *     args: [
         *         {
         *             type: 'integer',
         *             value: 0
         *         },
         *         {
         *             type: 'string',
         *             value: <SESSIONNUMBER>
         *         }
         *     ]
         * }
         * ```
         *
         * @function stopSoundTest
         * @memberof Angular.SoundTestController#$scope
         * @instance
         * @return {undefined}
         */
        $scope.stopSoundTest = function() {

            $log.debug('Sending stop sound test message to Max.');

            SocketIOService.emit('sendOSCMessage', {
                oscType: 'message',
                address: '/eim/control/soundTest',
                args: [
                    {
                        type: 'integer',
                        value: 0
                    },
                    {
                        type: 'string',
                        value: '' + TrialData.data.metadata.session_number
                    }
                ]
            });
        };

        /**
         * Indicates whether or not {@link
         * Angular.SoundTestController#$scope|$scope} has been destroyed.
         * Initially set to `false`.
         *
         * @name destroyed
         * @memberof Angular.SoundTestController#$scope
         * @instance
         */
        $scope.destroyed = false;

        // Send stop sound test message when controller is destroyed
        $scope.$on('$destroy', function() {

            $log.debug('SoundTestController $scope destroyed.');
            $scope.stopSoundTest();
        });
    }
]);
'use strict';

/**
 * In the demo application, the `StartController` is the primary
 * controller used for the `'start'` state. This controller checks that the
 * Max helper application is responsive, and blocks participants from
 * continuing in the session if Max is not responsive.
 *
 * @class Angular.StartController
 */

angular.module('core').controller('StartController', [
    '$scope',
    '$timeout',
    'TrialData',
    'ExperimentManager',
    'SocketIOService',
    '$log',
    function($scope, $timeout, TrialData, ExperimentManager, SocketIOService,
             $log) {

        $log.info('Loading StartController.');

        /**
         * The `StartController`'s `$scope` object. All properties on `$scope`
         * are available to the view.
         *
         * @name $scope
         * @namespace
         * @instance
         * @memberof Angular.StartController
         * @type {{}}
         */

        /**
         * Ready to advance method. Returns try if the Max helper
         * application is ready or if debugging mode has been enabled.
         *
         * @function readyToAdvance
         * @memberof Angular.StartController#$scope
         * @instance
         * @type {boolean}
         */
        $scope.readyToAdvance = function() {
            return $scope.maxReady || $scope.debugMode;
        };

        // Set the date on the TrialData service to now
        var now = new Date();
        console.info('Setting time on TrialData as ' + now.toISOString());
        TrialData.data.date = now.toISOString();

        /**
         * This method is called when the server fires the
         * `oscMessageReceived` event on the socket.io socket to which the
         * client is connected. The receipt of unexpected or malformed
         * messages will result in a warning on the console.
         *
         * @function oscMessageReceivedListener
         * @memberof Angular.StartController#
         * @param {{}} data The data sent with the event
         * @return {undefined}
         * @see Node.module:SocketServerController
         */
        this.oscMessageReceivedListener = function(data) {

            console.info('StartController received an OSC message.');
            console.info(data);

            /* istanbul ignore else */
            if (typeof data === 'object' &&
                !Array.isArray(data) &&
                data.hasOwnProperty('address') &&
                data.address === '/eim/status/startExperiment') {
                $scope.$apply(function() {
                    $scope.maxReady = true;
                });
            } else {
                $log.warn(
                    'StartController did not handle an OSC message.',
                    data
                );
            }
        };

        // Attach handler for incoming OSC messages
        SocketIOService.on(
            'oscMessageReceived',
            this.oscMessageReceivedListener
        );

        // Destroy handler for incoming OSC messages and remove error
        // timeout when $scope is destroyed
        var thisController = this;
        $scope.$on('$destroy', function removeOSCMessageReceivedListener() {
            SocketIOService.removeListener(
                'oscMessageReceived',
                thisController.oscMessageReceivedListener
            );

            console.debug('Cancelling timeout on StartController.');
            $timeout.cancel(thisController.errorTimeout);
        });

        /**
         * Send a message to the server indicating that the client is ready
         * to start the experiment. This method sets {@link
            * Angular.StartController#$scope.maxReady} to `false` before
         * sending the message.
         *
         * @function sendExperimentStartMessage
         * @memberof Angular.StartController#
         * @return {undefined}
         */
        this.sendExperimentStartMessage = function() {

            console.info('StartController sending experiment start message.');

            /**
             * Flag indicating whether or not the Max application is ready.
             *
             * @name maxReady
             * @memberof Angular.StartController#$scope
             * @instance
             * @type {boolean}
             */
            $scope.maxReady = false;
            SocketIOService.emit('sendOSCMessage', {
                oscType: 'message',
                address: '/eim/control/startExperiment',
                args: {
                    type: 'string',
                    value: '' + TrialData.data.metadata.session_number
                }
            });
        };

        this.sendExperimentStartMessage();

        /**
         * When the controller is instantiated, this timeout is set. The
         * timeout waits ten seconds for Max to respond that it is ready. If
         * Max does not respond within this time, an error is shown to the user.
         *
         * @name errorTimeout
         * @type {$q.Promise}
         * @memberof Angular.StartController#
         */
        this.errorTimeout = $timeout(function() {
        }, 10000);

        this.errorTimeout.then(function() {
            if (!$scope.readyToAdvance()) {
                $scope.addGenericErrorAlert();

                throw new Error('Max did not responded to the ' +
                    'startExperiment message within 10 seconds.');
            }
        });
    }
]);

'use strict';

/**
 * The `checkboxQuestion` directive is used to dynamically create a checkbox
 * question into a view. It is used by the {@link
 * Angular.questionnaireDirective|questionnaire} directive to build whole
 * questionnaires.
 *
 * @class Angular.checkboxQuestionDirective
 * @see Angular.questionnaireDirective
 */

angular.module('core').directive('checkboxQuestion', [
    '$compile',
    'TrialData',
    '$log',
    function($compile, TrialData, $log) {

        $log.debug('Compiling checkboxQuestion directive.');

        /**
         * The data used to build the checkbox question is found in the `scope`
         * argument passed to the directive's `#link` function. When a
         * {@link Angular.questionnaireDirective|questionnaire} directive
         * employs a `checkboxQuestion` directive, it passes
         * the appropriate {@link Angular.questionnaireDirective#data~questionnaireStructureEntry|questionnaireStructureEntry}
         * for this parameter.
         *
         * @name scope
         * @memberof Angular.checkboxQuestionDirective
         * @inner
         * @type {{}}
         * @see Angular.questionnaireDirective
         */

        return {
            restrict: 'E',
            scope: {},

            link: function(scope, element, attrs) {
                scope.someSelected = false;

                scope.sendToTrialData = function(path, value) {

                    //noinspection JSUnresolvedVariable
                    if (!attrs.associatedToMedia) {
                        TrialData.setValueForPath(path, value);
                    } else {
                        TrialData.setValueForPathForCurrentMedia(path, value);
                    }
                };

                scope.updateCheckboxes = function() {
                    var newSomeSelectedValue = false;

                    var checkedOptions = [];
                    var inputs = element.find('input');
                    for (var i = 0; i < inputs.length; i++) {
                        var input = angular.element(inputs[i]);


                        /* istanbul ignore else */
                        if (input.attr('name') === attrs.questionId +
                            'Checkbox') {

                            if (input.prop('checked') === true) {
                                newSomeSelectedValue = true;
                                checkedOptions
                                    .push(input.attr('value').toLowerCase());
                            }
                        }
                    }

                    scope.someSelected = newSomeSelectedValue;

                    checkedOptions.sort();

                    //noinspection JSUnresolvedVariable
                    scope.sendToTrialData(
                        attrs.controllerDataPath,
                        checkedOptions
                    );
                };

                var questionText =
                    '<div class="row well">' +
                    '<div class="col-md-12">' +
                    '<label for="' + attrs.questionId + 'Checkbox" translate>' +
                    attrs.questionLabel +
                    '</label>' +
                    '<div>';

                var innerQuestionText = '';

                if (element.data('questionOptions')) {

                    // Iterate over checkbox options
                    for (var i = 0;
                         i < element.data('questionOptions').choices.length;
                         i++) {

                        var thisOption = element.data('questionOptions').choices[i];

                        innerQuestionText += '<label class="checkbox-inline">';

                        innerQuestionText +=
                            '<input type="checkbox" name="' + attrs.questionId +
                            'Checkbox" id="' + attrs.questionId +
                            'Checkbox' + thisOption.value +
                            '" value="' + thisOption.value +
                            '" ng-model="' + attrs.questionId +
                            'Checkbox' + thisOption.value +
                            '" ng-change="updateCheckboxes()"';

                        if (element.data('questionRequired') !== false) {
                            innerQuestionText += 'ng-required="!someSelected"';
                        }

                        innerQuestionText += '>{{\'' + thisOption.label +
                            '\' | translate}}</input>';

                        innerQuestionText += '</label>';
                    }
                }

                questionText += innerQuestionText + '</div></div></div>';

                var questionElement = angular.element(questionText);

                element.append(questionElement);
                $compile(element.contents())(scope);
            }
        };
    }
]);

'use strict';

/**
 * The `displayTrialData` directive is simply a convenient way to display
 * the current {@link Angular.TrialData#data|TrialData#data} anywhere in the
 * view.
 *
 * @example <display-trial-data></display-trial-data>
 *
 * @class Angular.displayTrialDataDirective
 */

angular.module('core').directive('displayTrialData', [
    '$log',
    function($log) {

        $log.debug('Rendering displayTrialData directive.');

        return {
            restrict: 'AE',
            template: '<div class="row trial-data-row">' +
            '<div class="col-md-12">' +
            '<h3>Trial Data</h3>' +
            '<pre>{{trialDataJson()}}</pre>' +
            '</div>' +
            '</div>'
        };
    }]);
'use strict';

/**
 * The `dropdownQuestion` directive is used to dynamically create a dropdown
 * question into a view. It is used by the {@link
 * Angular.questionnaireDirective|questionnaire} directive to build whole
 * questionnaires.
 *
 * @class Angular.dropdownQuestionDirective
 * @see Angular.questionnaireDirective
 */

angular.module('core').directive('dropdownQuestion', [
    '$compile',
    'TrialData',
    '$log',
    function($compile, TrialData, $log) {

        $log.debug('Compiling dropdownQuestion directive.');

        /**
         * The data used to build the dropdown question is found in the `scope`
         * argument passed to the directive's `#link` function. When a
         * {@link Angular.questionnaireDirective|questionnaire} directive
         * employs a `dropdownQuestion` directive, it passes
         * the appropriate {@link Angular.questionnaireDirective#data~questionnaireStructureEntry|questionnaireStructureEntry}
         * for this parameter.
         *
         * @name scope
         * @memberof Angular.dropdownQuestionDirective
         * @inner
         * @type {{}}
         * @see Angular.questionnaireDirective
         */

        return {
            restrict: 'E',
            scope: {},

            link: function(scope, element, attrs) {

                scope.sendToTrialData = function(path, value) {
                    if (!attrs.associatedToMedia) {
                        TrialData.setValueForPath(path, value);
                    } else {
                        TrialData.setValueForPathForCurrentMedia(path, value);
                    }
                };

                scope[attrs.questionId + 'Select'] = null;

                scope.$watch(attrs.questionId + 'Select', function(newValue) {
                    scope.sendToTrialData(attrs.controllerDataPath, newValue);
                });

                var rowDiv = angular.element('<div class="row well"></div>');

                var formDiv = angular.element(
                    '<div class="col-md-12 form-group"></div>'
                );

                rowDiv.append(formDiv);

                var label = angular.element(
                    '<label class="control-label" translate>' +
                    attrs.questionLabel +
                    '</label>'
                );
                label.prop('for', attrs.questionId);

                formDiv.append(label);

                // Create select element
                var select = angular.element(
                    '<select class="form-control" required></select>'
                );

                // Remove 'required' attribute if this was specified in data
                if (element.data('questionRequired') === false) {
                    select.removeAttr('required');
                }

                select.attr('id', attrs.questionId);
                select.attr('name', attrs.questionId);
                select.attr('ng-model', attrs.questionId + 'Select');

                if (element.data('questionOptions')) {

                    scope.dropdownOptions = element.data('questionOptions').choices;

                    for (var i in scope.dropdownOptions) {
                        var optionText = scope.dropdownOptions[i];
                        var option = angular.element(
                            '<option>{{ "' + optionText.label + '" |' +
                            ' translate }}' +
                            '</option>'
                        );
                        option.attr('value', optionText.value);
                        select.append(option);
                    }
                }

                formDiv.append(select);

                element.append(rowDiv);
                $compile(element.contents())(scope);
            }
        };
    }]);

'use strict';

/**
 * The `questionnaire` directive is used to dynamically inject a
 * questionnaire into a view. It leverages several other directives to do
 * this work:
 *
 * - {@link Angular.checkboxQuestionDirective|checkboxQuestionDirective}
 * - {@link Angular.dropdownQuestionDirective|dropdownQuestionDirective}
 * - {@link Angular.radioQuestionDirective|radioQuestionDirective}
 * - {@link Angular.scaleQuestionDirective|scaleQuestionDirective}
 *
 * @class Angular.questionnaireDirective
 * @see Angular.checkboxQuestionDirective
 * @see Angular.dropdownQuestionDirective
 * @see Angular.radioQuestionDirective
 * @see Angular.scaleQuestionDirective
 */

angular.module('core').directive('questionnaire', [
    '$compile',
    '$log',
    function($compile, $log) {

        $log.debug('Compiling questionnaire directive.');

        function buildScaleQuestion(item) {
            var questionElement = angular.element(
                '<scale-question></scale-question>'
            );

            if (item.questionLabelType) {
                questionElement.attr('label-type', item.questionLabelType);
            }

            if (item.questionLikertMinimumDescription) {
                questionElement.attr(
                    'minimum-description',
                    item.questionLikertMinimumDescription
                );
            }

            if (item.questionLikertMaximumDescription) {
                questionElement.attr(
                    'maximum-description',
                    item.questionLikertMaximumDescription
                );
            }

            if (item.questionLikertSingleImageSrc) {
                questionElement.attr(
                    'single-img-src',
                    item.questionLikertSingleImageSrc
                );
            }

            if (item.questionLikertLeftImageSrc) {
                questionElement.attr(
                    'left-img-src',
                    item.questionLikertLeftImageSrc
                );
            }

            if (item.questionLikertRightImageSrc) {
                questionElement.attr(
                    'right-img-src',
                    item.questionLikertRightImageSrc
                );
            }

            return questionElement;
        }

        function buildRadioQuestion() {
            return angular.element(
                '<radio-question></radio-question>'
            );
        }

        function buildDropdownQuestion() {
            return angular.element(
                '<dropdown-question></dropdown-question>'
            );
        }

        function buildCheckboxQuestion() {
            return angular.element(
                '<checkbox-question></checkbox-question>'
            );
        }

        return {
            restrict: 'E',
            scope: {
                questionnaireData: '=',
                questionnaireForm: '='
            },

            link: function(scope, element) {

                /**
                 * Represents an individual question in a questionnaire.
                 *
                 * @typedef {{}} questionnaireStructureEntry
                 * @memberof Angular.questionnaireDirective#data
                 * @inner
                 *
                 * @property {string} questionType The question type. Supported
                 * `questionType`s include `'likert'`, `'radio'`, `'dropdown'`,
                 * and `'checkbox'`. (required)
                 *
                 * @property {string} questionId All question types support this
                 * property. It should be a single-word string that uniquely
                 * identifies this question within this questionnaire.
                 * (required)
                 *
                 * @property {string} questionLabel All question types
                 * support this property. It should be a string that
                 * contains the text of the question itself (e.g., 'How old
                 * are you?') (optional)
                 *
                 * @property {string} questionStoragePath All question types
                 * support this property. It should be a 'keypath' into the
                 * TrialData.data object at which the response to this question
                 * should be stored. See {@link
                 * Angular.TrialData#setValueForPath|TrialData#setValueForPath}
                 * for more information on these keypaths. (required)
                 *
                 * @property {boolean} questionIsAssociatedToMedia All question
                 * types support this property. The value of this property
                 * specifies that a question corresponds to a particular media
                 * excerpt by taking a Boolean true or false as its value. When
                 * this value is set to true, multiple responses for
                 * questions with the same questionStoragePath property are
                 * stored in an ordered array that is used as the value for
                 * the `questionStoragePath` property in {@link
                 * Angular.TrialData#data|TrialData#data}. (optional)
                 *
                 * For example, in the demonstration study provided with the
                 * framework, two media excerpts are played. We present the same
                 * questionnaire to the participant following each media
                 * excerpt. In order to specify that responses on the
                 * questionnaire following the first excerpt are associated
                 * with the first excerpt (and the same for the second
                 * questionnaire and excerpt), the values for
                 * `questionIsAssociatedToMedia` for all questions in these
                 * questionnaires are all set to `true`. So, for those
                 * questons with their `questionStoragePath` property set to
                 * `"data.answers.positivity"`, the corresponding section of a
                 * participant's {@link Angular.TrialData#data|TrialData#data}
                 * might look something like this:
                 *
                 * ```
                 * {
                 *     data: {
                 *         answers: {
                 *             positivity: [2, 5]
                 *         }
                 *     }
                 * }
                 * ```
                 *
                 * Here, the participant chose a value of `2` when responding to
                 * the positivity question following the first excerpt.
                 * Likewise, they chose a value of `5` when responding to
                 * the positivity question following the second excerpt.
                 *
                 * @property {boolean} questionRequired All question types
                 * support this property. If its value is
                 * `false`, the user will not be required to answer the
                 * question. If its value is *anything* other than false
                 * (`true`, `undefined`, 49, etc.), the user will be
                 * required to answer the question. (optional)
                 *
                 * @property {string} questionLabelType This property is used
                 * by the `'likert'` question type. Providing a value of
                 * `'labelLeft'` for this property will produce the
                 * `questionLabel` as a left-justified label in the standard
                 * font size. Otherwise, the label will be printed in a larger
                 * font and centered over the scale. (optional)
                 *
                 * @property {string} questionLikertMinimumDescription This
                 * property is used by the `'likert'` question type. The minimum
                 * description is displayed below the left end of the scale.
                 * If this property is specified, then
                 * `questionLikertMaximumDescription` must also be specified.
                 * (optional)
                 *
                 * @property {string} questionLikertMaximumDescription This
                 * property is used by the `'likert'` question type. The minimum
                 * description is displayed below the right end of the scale.
                 * If this property is specified, then
                 * `questionLikertMinimumDescription` must also be specified.
                 * (optional)
                 *
                 * @property {string} questionLikertSingleImageSrc This
                 * property is used by the `'likert'` question type. The value
                 * should be a path to an image to be displayed above and
                 * centered over the scale. (optional)
                 *
                 * @property {string} questionLikertLeftImageSrc This
                 * property is used by the `'likert'` question type. The value
                 * should be a path to an image to be displayed above and
                 * above the left end of the scale. If this property
                 * is specified, then `questionLikertRightImageSrc
                 * must also be specified. (optional)
                 *
                 * @property {string} questionLikertRightImageSrc This
                 * property is used by the `'likert'` question type. The value
                 * should be a path to an image to be displayed above and
                 * above the right end of the scale. If this property
                 * is specified, then `questionLikertLeftImageSrc must also
                 * be specified. (optional)
                 *
                 * @property {{}} questionOptions This property is used and
                 * required by all question types. In general, each question
                 * type requires that this be an object that has a `choices`
                 * property, the value of which is an array. Each entry in
                 * the choices array should be an object that represents a
                 * single question choice. Each of these objects should
                 * have both a `label` and a `value` property. The value of
                 * the `label` property should be a string that is used for
                 * the display of this question type. The value of the
                 * `value` property should be the value that should be
                 * stored when this choice is selected by the user for their
                 * answer.
                 *
                 * ```
                 * // questionOptions example:
                 * {
                 *     choices: [
                 *         {
                 *             label: 'Strongly disagree',
                 *             value: 1
                 *         },
                 *         {
                 *             label: 'Somewhat disagree',
                 *             value: 2
                 *         },
                 *         {
                 *             label: 'Neither agree nor disagree',
                 *             value: 3
                 *         },
                 *         {
                 *             label: 'Somewhat agree',
                 *             value: 4
                 *         },
                 *         {
                 *             label: 'Strongly agree',
                 *             value: 5
                 *         }
                 *     ]
                 * }
                 * ```
                 */

                /**
                 * The data used to build the questionnaire. `data` is bound to
                 * `$scope.questionnaireData` on the enclosing scope.
                 *
                 * @name data
                 * @namespace
                 * @memberof Angular.questionnaireDirective
                 * @instance
                 * @type {{}}
                 * @property {string} title The title of the questionnaire
                 * (optional)
                 * @property {string} introductoryText A block of introductory
                 * text for the questionnaire (optional)
                 * @property {questionnaireStructureEntry[]} structure An array
                 * of questions for the questionnaire (see {@link
                 * Angular.questionnaireDirective#data~questionnaireStructureEntry|questionnaireStructureEntry})
                 * (optional)
                 */
                var data = scope.questionnaireData;

                var div = angular.element('<div></div>');

                // Create an element for the title
                if (data.hasOwnProperty('title')) {
                    if (typeof data.title === 'string') {

                        var title = angular.element('<h1></h1>');
                        title.attr('translate', '');
                        title.html(data.title);
                        element.append(title);
                    } else {
                        $log.error('Questionnaire title must be a string.');
                    }
                }

                // Create an element for the introductory text
                if (data.hasOwnProperty('introductoryText')) {
                    if (typeof data.introductoryText === 'string') {

                        var row = div.clone();
                        row.addClass('row');

                        var columns = div.clone();
                        columns.addClass('col-md-12 introductory-text');

                        var heading = angular.element('<h2></h2>');
                        heading.attr('translate', '');
                        heading.html(data.introductoryText);

                        element.append(row);
                        row.append(columns);
                        columns.append(heading);
                    } else {
                        $log.error('Questionnaire introductory text must be a' +
                            ' string.');
                    }
                }

                var formElement = angular.element('<form></form>');
                formElement.addClass('form');
                formElement.attr('name', 'questionnaireForm');
                formElement.attr('novalidate', '');

                // Iterate over structure
                if (data.structure.length === 0) {
                    $log.warn('No questions found for questionnaire.');
                }

                for (var i = 0; i < data.structure.length; i++) {

                    // Create an element for each structure entry
                    var questionElement;
                    var item = data.structure[i];

                    if (!item.hasOwnProperty('questionType') ||
                        typeof item.questionType !== 'string') {
                        $log.error('questionType must be provided.');
                        $log.error(item);
                    }

                    switch (item.questionType) {
                        case 'likert':
                            questionElement = buildScaleQuestion(item);
                            break;
                        case 'radio':
                            questionElement = buildRadioQuestion(item);
                            break;
                        case 'dropdown':
                            questionElement = buildDropdownQuestion(item);
                            break;
                        case 'checkbox':
                            questionElement = buildCheckboxQuestion(item);
                            break;
                        default:
                            $log.error('Unrecognized questionType: ' +
                                item.questionType);
                            break;
                    }

                    if (item.hasOwnProperty('questionOptions')) {
                        questionElement.data(
                            'questionOptions',
                            item.questionOptions
                        );

                    // There were no questionOptions and this isn't a likert
                    // question
                    } else if (item.questionType !== 'likert') {
                        $log.error('questionOptions must be provided for' +
                            ' questionTypes other than \'likert\'.');
                        console.log('item:');
                        console.log(item);
                    }

                    if (item.hasOwnProperty('questionRequired')) {
                        questionElement.data(
                            'questionRequired',
                            item.questionRequired
                        );
                    } else {
                        questionElement.data(
                            'questionRequired',
                            true
                        );
                    }

                    if (item.hasOwnProperty('questionStoragePath')) {
                        if (typeof item.questionStoragePath === 'string') {
                            questionElement.attr(
                                'controller-data-path',
                                item.questionStoragePath
                            );

                        // questionStoragePath wasn't a string
                        } else {
                            $log.error('questionStoragePath must be a string.');
                        }

                    // questionStoragePath wasn't present
                    } else {
                        $log.error('questionStoragePath must be provided.');
                    }

                    if (item.hasOwnProperty('questionIsAssociatedToMedia')) {
                        questionElement.attr(
                            'associated-to-media',
                            item.questionIsAssociatedToMedia
                        );
                    }

                    if (item.hasOwnProperty('questionId')) {
                        if (typeof item.questionId === 'string') {
                            questionElement.attr(
                                'question-id',
                                item.questionId
                            );

                        // questionId wasn't a string
                        } else {
                            $log.error('questionId must be a string.');
                        }

                    // questionId wasn't present
                    } else {
                        $log.error('questionId must be provided.');
                    }

                    if (item.hasOwnProperty('questionLabel')) {
                        questionElement.attr(
                            'question-label',
                            item.questionLabel
                        );
                    }

                    // Build a spacer row
                    var spacerRow = div.clone();
                    spacerRow.addClass('row');

                    var spacerColumns = div.clone();
                    spacerColumns.addClass('col-md-12 question-spacer');
                    spacerRow.append(spacerColumns);

                    // Add question and spacer to form
                    formElement.append(questionElement);
                    formElement.append(spacerRow);
                }

                // Add form to main element
                element.append(formElement);

                $compile(element.contents())(scope);
            }
        };
    }]);

'use strict';

/**
 * The `radioQuestion` directive is used to dynamically create a radio button
 * question into a view. It is used by the {@link
    * Angular.questionnaireDirective|questionnaire} directive to build whole
 * questionnaires.
 *
 * @class Angular.radioQuestionDirective
 * @see Angular.questionnaireDirective
 */

angular.module('core').directive('radioQuestion', [
    '$compile',
    'TrialData',
    '$log',
    function($compile, TrialData, $log) {

        $log.debug('Compiling radioQuestion directive.');

        /**
         * The data used to build the radio question is found in the `scope`
         * argument passed to the directive's `#link` function. When a
         * {@link Angular.questionnaireDirective|questionnaire} directive
         * employs a `radioQuestion` directive, it passes
         * the appropriate {@link Angular.questionnaireDirective#data~questionnaireStructureEntry|questionnaireStructureEntry}
         * for this parameter.
         *
         * @name scope
         * @memberof Angular.radioQuestionDirective
         * @inner
         * @type {{}}
         * @see Angular.questionnaireDirective
         */

        return {
            restrict: 'E',
            scope: {},

            link: function(scope, element, attrs) {

                scope.sendToTrialData = function(path, value) {
                    if (!attrs.associatedToMedia) {
                        TrialData.setValueForPath(path, value);
                    } else {
                        TrialData.setValueForPathForCurrentMedia(path, value);
                    }
                };

                scope[attrs.questionId + 'RadioGroup'] = null;

                scope.$watch(
                    attrs.questionId + 'RadioGroup',
                    function(newValue) {

                        // Convert 'true' to true literals and similar for
                        // 'false'
                        if (newValue === 'true') {
                            newValue = true;
                        } else if (newValue === 'false') {
                            newValue = false;
                        }

                        scope.sendToTrialData(
                            attrs.controllerDataPath,
                            newValue
                        );
                    });

                var questionText =
                    '<div class="row">' +
                    '<div class="col-md-12">' +
                    '<label for="' + attrs.questionId + 'Radio" ' +
                    'translate>' +
                    attrs.questionLabel +
                    '</label>' +
                    '<div>';

                var innerQuestionText = '';

                // Don't require question if explicitly told not to do so in
                // data
                var requiredText = '';
                if (element.data('questionRequired') !== false) {
                    requiredText = ' required="required" ';
                }

                if (element.data('questionOptions')) {

                    // Iterate over radio options
                    for (var i = 0;
                         i < element.data('questionOptions').choices.length;
                         i++) {

                        var thisOption = element.data('questionOptions').choices[i];

                        innerQuestionText +=
                            '<label class="radio-inline">' +
                            '<input type="radio" name="' +
                            attrs.questionId + 'RadioGroup" ' +
                            'id="' + attrs.questionId +
                            'Radio' + thisOption.label + '" ' +
                            'value="' + thisOption.value + '" ' +
                            'ng-model="' + attrs.questionId + 'RadioGroup" ' +
                            requiredText +
                            '>' +
                            '{{\'' + thisOption.label + '\' | translate}}' +
                            '</input>' +
                            '</label>';

                    }
                }

                questionText += innerQuestionText + '</div></div></div>';

                var questionElement = angular.element(questionText);

                // Add well class
                questionElement.addClass('well');

                element.append(questionElement);
                $compile(element.contents())(scope);
            }
        };
    }]);

'use strict';

/**
 * The `scaleQuestion` directive is used to dynamically create a Likert-type
 * scale question into a view. It is used by the {@link
    * Angular.questionnaireDirective|questionnaire} directive to build whole
 * questionnaires.
 *
 * @class Angular.scaleQuestionDirective
 * @see Angular.questionnaireDirective
 */

angular.module('core').directive('scaleQuestion', [
    '$compile',
    'TrialData',
    '$log',
    function($compile, TrialData, $log) {

        $log.debug('Compiling scaleQuestion directive.');

        /**
         * The data used to build the scale question is found in the `scope`
         * argument passed to the directive's `#link` function. When a
         * {@link Angular.questionnaireDirective|questionnaire} directive
         * employs a `scaleQuestion` directive, it passes
         * the appropriate {@link Angular.questionnaireDirective#data~questionnaireStructureEntry|questionnaireStructureEntry}
         * for this parameter.
         *
         * @name scope
         * @memberof Angular.scaleQuestionDirective
         * @inner
         * @type {{}}
         * @see Angular.questionnaireDirective
         */

        // Build a header (main question text) row
        function buildHeaderRow(labelType, labelHTML) {

            var row;
            row = angular.element('<div></div>');
            row.addClass('row');

            var columns = angular.element('<div></div>');
            columns.addClass('col-md-12');

            var label;

            if (labelType === 'labelLeft') {
                label = angular.element('<label></label>');
            } else {
                label = angular.element('<h3></h3>');
            }

            label.attr('translate', '');
            label.html(labelHTML);

            row.append(columns);
            columns.append(label);

            return row;
        }

        // Build a row to hold the images
        function buildImageRow(singleImgSrc, leftImgSrc, rightImgSrc) {

            var row;

            // If there is either a single image source or there are both
            // left and right image sources
            if (typeof singleImgSrc === 'string' ||
                (typeof leftImgSrc === 'string' &&
                 typeof rightImgSrc === 'string')) {

                // Main row
                row = angular.element('<div></div>');
                row.addClass('row likert-image-row');

                var twoColumns = angular.element('<div></div>');
                twoColumns.addClass('col-md-2');

                // If there is only one image
                if (singleImgSrc) {

                    var image = angular.element('<img>');
                    image.attr('src', singleImgSrc);

                    var eightColumns = angular.element('<div></div>');
                    eightColumns.addClass('col-md-8');
                    eightColumns.addClass('text-center');

                    eightColumns.append(image);

                    row.append(
                        twoColumns.clone(),
                        eightColumns,
                        twoColumns.clone()
                    );

                // If we have two side images
                } else if (leftImgSrc && rightImgSrc) {

                    var leftImage = angular.element('<img>');
                    leftImage.attr('src', leftImgSrc);

                    var leftImageColumns = twoColumns.clone();
                    leftImageColumns.append(leftImage);

                    var rightImage = angular.element('<img>');
                    rightImage.attr('src', rightImgSrc);

                    var rightImageColumns = twoColumns.clone();
                    rightImageColumns.append(rightImage);

                    var fourColumns = angular.element('<div></div>');
                    fourColumns.addClass('col-md-4');

                    row.append(
                        twoColumns.clone(),
                        leftImageColumns,
                        fourColumns.clone(),
                        rightImageColumns,
                        twoColumns.clone()
                    );
                }
            }

            return row;
        }

        // Build a row that holds descriptions under each radio button
        function buildDescriptionsRow(minimumDesc, maximumDesc) {

            var descriptions;
            if (minimumDesc && maximumDesc) {

                // Main row div
                descriptions = angular.element('<div></div>');
                descriptions.addClass('row');
                descriptions.addClass('row-likert-descriptions');

                // Side and center spacers
                var sideSpacer = angular.element('<div></div>');
                sideSpacer.addClass('col-md-2');

                var centerSpacer = angular.element('<div></div>');
                centerSpacer.addClass('col-md-4');

                var descriptionsInnerRow = angular.element('<div></div>');
                descriptionsInnerRow.addClass('col-md-8');
                descriptionsInnerRow.addClass('likert-descriptions-container');

                var fifthsColumnSpacer = angular.element('<div></div>');
                fifthsColumnSpacer.addClass('col-md-5ths');

                // Left and right text blocks
                var leftTextBlock = angular.element('<div translate></div>');
                leftTextBlock.addClass('col-md-5ths');
                leftTextBlock.addClass('small');
                leftTextBlock.addClass('text-center');
                leftTextBlock.addClass('likert-minimum-description');
                leftTextBlock.html(minimumDesc);

                var rightTextBlock = leftTextBlock.clone();
                rightTextBlock.removeClass('likert-minimum-description');
                rightTextBlock.addClass('likert-maximum-description');
                rightTextBlock.html(maximumDesc);

                // Append text blocks and spacers to inner row
                descriptionsInnerRow.append(leftTextBlock);
                descriptionsInnerRow.append(
                    fifthsColumnSpacer.clone(),
                    fifthsColumnSpacer.clone(),
                    fifthsColumnSpacer.clone()
                );
                descriptionsInnerRow.append(rightTextBlock);

                // Append children to main row
                descriptions.append(
                    sideSpacer.clone(),
                    descriptionsInnerRow,
                    sideSpacer.clone()
                );
            }

            return descriptions;
        }

        function questionIsValid(questionOptions,
                                         singleImgSrc,
                                         leftImgSrc,
                                         rightImgSrc,
                                         minimumDescription,
                                         maximumDescription) {

            // questionOptions must be present...
            if (questionOptions !== undefined) {

                // ...must be an object...
                if (typeof questionOptions !== 'object' ||
                    Array.isArray(questionOptions)) {
                    $log.error('questionOptions was not an object.');
                    return false;
                }

                // ...and must have a choices property...
                if (!questionOptions.hasOwnProperty('choices')) {
                    $log.error(
                        'questionOptions did not have a choice property.'
                    );
                    return false;
                }

                // questionOptions.choices must be an array...
                if (!Array.isArray(questionOptions.choices)) {
                    $log.error('questionOptions.choices was not an array.');
                    return false;
                }

                // ...must have five entries...
                if (questionOptions.choices.length !== 5) {
                    $log.error('questionOptions.choices did not have five' +
                        ' choices.');
                    return false;
                }

                for (var i in questionOptions.choices) {
                    var choice = questionOptions.choices[i];

                    // ...that are objects...
                    if (typeof choice !== 'object' || Array.isArray(choice)) {
                        $log.error('questionOptions.choices[' + i + '] was ' +
                            'not an object.');
                        return false;
                    }

                    // ...that each have a label property...
                    if (!choice.hasOwnProperty('label')) {
                        $log.error('questionOptions.choices[' + i + '] did ' +
                            'not have a label property.');
                        return false;
                    }

                    // ...that are each strings
                    if (typeof choice.label !== 'string') {
                        $log.error('questionOptions.choices[' + i + '].label ' +
                            'was not a string.');
                        return false;
                    }
                }
            }

            // If one image source was provided, it must be a string
            if (singleImgSrc !== undefined &&
                typeof singleImgSrc !== 'string') {
                $log.error('single-img-src was not a string.');
                return false;
            }

            // If one of the two image sources was provided, we must have the
            // other
            if ((leftImgSrc !== undefined && rightImgSrc === undefined) ||
                (rightImgSrc !== undefined && leftImgSrc === undefined)) {

                $log.error('Either left-img-src or right-img-src was given,' +
                    ' but the other was not.');
                return false;
            }

            // If two image sources were provided, both must be strings
            if (leftImgSrc !== undefined && rightImgSrc !== undefined) {
                if (typeof leftImgSrc !== 'string' ||
                    typeof rightImgSrc !== 'string') {

                    $log.error('Either left-img-src or right-img-src was' +
                        ' not a string');
                    return false;
                }
            }

            // If one of the two descriptions was provided, we must have the
            // other
            if ((minimumDescription !== undefined &&
                maximumDescription === undefined) ||
                (maximumDescription !== undefined &&
                minimumDescription === undefined)) {

                $log.error('Either minimum-description or maximum-description' +
                    ' was given, but the other was not.');
                return false;
            }

            // If two descriptions were provided, both must be strings
            if (minimumDescription !== undefined &&
                maximumDescription !== undefined) {

                if (typeof minimumDescription !== 'string' ||
                    typeof maximumDescription !== 'string') {

                    $log.error('Either minimum-description or' +
                        ' maximum-description was not a string.');
                    return false;
                }
            }

            return true;
        }

        function buildOptionLabelsRow(questionOptions) {

            var optionLabelsRow;

            if (questionOptions !== undefined &&
                questionOptions.hasOwnProperty('choices')) {

                var choices = questionOptions.choices;

                var div = angular.element('<div></div>');

                optionLabelsRow = div.clone();
                optionLabelsRow.addClass('row row-likert-option-label');

                var spacer = div.clone();
                spacer.addClass('col-md-2 option-label-spacer');

                optionLabelsRow.append(spacer.clone());

                var choiceContainer = div.clone();
                choiceContainer.addClass(
                    'col-md-8 likert-option-label-container text-center'
                );

                var choice = div.clone();
                choice.addClass('col-md-5ths likert-option-label text-center');
                choice.attr('translate', '');

                for (var i in choices) {
                    var thisChoice = choice.clone();
                    thisChoice.html(
                        '{{ \'' + choices[i].label + '\' }}'
                    );
                    choiceContainer.append(thisChoice);
                }

                optionLabelsRow.append(choiceContainer);

                optionLabelsRow.append(spacer.clone());
            }

            return optionLabelsRow;
        }

        function buildRadiosRow(questionId, questionRequired) {

            // Don't require question if explicitly told not to do so in
            // data
            var responseRequired = false;
            if (questionRequired !== false) {
                responseRequired = true;
            }

            var div = angular.element('<div></div>');

            var radioDiv = div.clone();
            radioDiv.addClass('col-md-5ths text-center');

            var centerContainer = div.clone();
            centerContainer.addClass('col-md-8 text-center');

            var radioInput = angular.element('<input>');
            radioInput.attr('type', 'radio');
            radioInput.attr('name', questionId + 'RadioGroup');
            radioInput.attr('ng-model', questionId + 'RadioGroup');

            if (responseRequired) {
                radioInput.attr('required', '');
            }

            for (var i = 1; i <= 5; i++) {
                var thisRadioDiv = radioDiv.clone();

                var thisRadio = radioInput.clone();
                thisRadio.attr('id', questionId + 'RadioGroup' + i);
                thisRadio.attr('value', i);

                thisRadioDiv.append(thisRadio);
                centerContainer.append(thisRadioDiv);
            }

            var radiosRow = div.clone();
            radiosRow.addClass('row');

            var spacer = div.clone();
            spacer.addClass('col-md-2');

            radiosRow.append(
                spacer.clone(),
                centerContainer,
                spacer.clone()
            );

            return radiosRow;
        }

        return {
            restrict: 'E',
            scope: {},
            controller: function scaleQuestionController() {
                this.questionOptionsAreValid = questionIsValid;
            },

            link: function(scope, element, attrs, ctrl) {

                // Validate the questionOptions
                if (!questionIsValid(
                        element.data('questionOptions'),
                        attrs.singleImgSrc,
                        attrs.leftImgSrc,
                        attrs.rightImgSrc,
                        attrs.minimumDescription,
                        attrs.maximumDescription)
                    ) {
                    return;
                }

                // Bind input to TrialData
                scope.sendToTrialData = function(path, value) {
                    if (!attrs.associatedToMedia) {
                        TrialData.setValueForPath(path, value);
                    } else {
                        TrialData.setValueForPathForCurrentMedia(path, value);
                    }
                };

                // Initialize a dynamically-named variable to keep track of
                // changing responses to null
                scope[attrs.questionId + 'RadioGroup'] = null;

                // Watch that dynamically named variable and update
                // TrialData when it changes
                scope.$watch(
                    attrs.questionId + 'RadioGroup',
                    function(newValue) {
                        scope.sendToTrialData(
                            attrs.controllerDataPath,
                            parseInt(newValue)
                        );
                    });

                var headerRow = buildHeaderRow(
                    attrs.labelType,
                    attrs.questionLabel
                );

                var imageRow = buildImageRow(
                    attrs.singleImgSrc,
                    attrs.leftImgSrc,
                    attrs.rightImgSrc
                );

                var radiosRow = buildRadiosRow(
                    attrs.questionId,
                    element.data('questionRequired')
                );

                var optionLabelsRow = buildOptionLabelsRow(
                    element.data('questionOptions')
                );

                var descriptionsRow = buildDescriptionsRow(
                    attrs.minimumDescription,
                    attrs.maximumDescription
                );

                // Wrap everything in a div with well and row classes
                var wellRow = angular.element('<div></div>');
                wellRow.addClass('row well');

                // Append everything we built
                wellRow.append(
                    headerRow,
                    imageRow,
                    optionLabelsRow,
                    radiosRow,
                    descriptionsRow
                );

                // Add well div to element and compile the element
                element.append(wellRow);
                $compile(element.contents())(scope);
            }
        };
    }]);

//'use strict';
//
//angular.module('core').directive('sliderScale', ['$compile', 'TrialData', function($compile, TrialData) {
//  return {
//    replace: false,
//    restrict: 'E',
//    scope: {},
//
//    link: function(scope, element, attrs) {
//
//      //noinspection RedundantIfStatementJS
//      if (attrs.associatedToMedia && attrs.associatedToMedia.toLowerCase() === 'true') {
//        scope.associated = true;
//      } else {
//        scope.associated = false;
//      }
//
//      scope.sendToTrialData = function(path, value) {
//        if (scope.associated) {
//          TrialData.setValueForPathForCurrentMedia(path, value);
//        } else {
//          TrialData.setValueForPath(path, value);
//        }
//      };
//
//      var sliderElement;
//      switch (attrs.imageType) {
//        case 'extremes':
//          sliderElement = angular.element('<div class="row"><div class="col-md-2 text-center slider-image"></div><div class="col-md-2 slider-image text-center"><img src="' + attrs.leftImageSrc + '" /></div><!----><div class="col-md-4 slider-image"></div><!----><div class="col-md-2 slider-image text-center"><img src="' + attrs.rightImageSrc + '" /></div><!----><div class="col-md-2 text-center slider-image"></div><div class="clearBoth"></div><div class="col-md-2 text-center slider-image"></div><!----><div class="col-md-8 slider-image"><slider ng-change="sendToTrialData(\'' + attrs.controllerDataPath + '\', sliderModel)" ng-model="sliderModel" floor="' + attrs.sliderFloor + '" ceiling="' + attrs.sliderCeiling + '" step="' + attrs.sliderStep + '" stretch="' + attrs.sliderStretch + '" ng-init="sliderModel=' + attrs.sliderInitialValue + '"></slider></div><!----><div class="col-md-2 text-center slider-image"></div></div>');
//          break;
//        case 'single':
//          sliderElement = angular.element('<div class="row"><div class="col-md-12 slider-image text-center"><img src="' + attrs.singleImageSrc + '" /></div><div class="col-md-2 text-center slider-image"></div><!----><div class="col-md-8 slider-image"><slider ng-change="sendToTrialData(\'' + attrs.controllerDataPath + '\', sliderModel)" ng-model="sliderModel" floor="' + attrs.sliderFloor + '" ceiling="' + attrs.sliderCeiling + '" step="' + attrs.sliderStep + '" stretch="' + attrs.sliderStretch + '" ng-init="sliderModel=' + attrs.sliderInitialValue + '"></slider></div><!----><div class="col-md-2 text-center slider-image"></div></div>');
//          break;
//        default:
//          sliderElement = angular.element('<div class="row"><div class="col-md-2 text-center slider-image"></div><!----><div class="col-md-8 slider-image"><slider ng-change="sendToTrialData(\'' + attrs.controllerDataPath + '\', sliderModel)" ng-model="sliderModel" floor="' + attrs.sliderFloor + '" ceiling="' + attrs.sliderCeiling + '" step="' + attrs.sliderStep + '" stretch="' + attrs.sliderStretch + '" ng-init="sliderModel=' + attrs.sliderInitialValue + '"></slider></div><!----><div class="col-md-2 text-center slider-image"></div></div>');
//          break;
//      }
//
//      $compile(sliderElement)(scope);
//      element.after(sliderElement);
//
//      // Send initial values to TrialData
//      scope.sendToTrialData(attrs.controllerDataPath, attrs.sliderInitialValue);
//    }
//  };
//}]);
'use strict';

/**
 * The `ExperimentManager` service has two main responsibilities: managing
 * the state (the 'slide' that is presented to the user) and the
 * {@link Angular.TrialData|TrialData} service.
 *
 * @class Angular.ExperimentManager
 * @memberof Angular
 */

angular.module('core').factory('ExperimentManager', [
    'TrialData',
    '$q',
    '$http',
    '$state',
    '$log',
    'rfc4122',
    '$rootScope',
    function(TrialData, $q, $http, $state, $log, rfc4122, $rootScope) {

        $log.debug('Instantiating ExperimentManager service.');

        // Attach an event listener for $rootScope's $stateChangeStart
        // events and set stateChanging to true when these events are emitted
        function stateChangeStartListener() {
            returnObject.stateChanging = true;
        }
        $rootScope.$on('$stateChangeStart', stateChangeStartListener);

        // Attach an event listener for $rootScope's $stateChangeSuccess
        // events and set stateChanging to false when these events are emitted
        function stateChangeSuccessListener() {
            returnObject.stateChanging = false;
        }
        $rootScope.$on('$stateChangeSuccess', stateChangeSuccessListener);

        var returnObject = {

            /**
             * Advances the state to the next state as defined in the study
             * specification document (see the [README](index.html)).
             *
             * @function advanceSlide
             * @instance
             * @memberof Angular.ExperimentManager
             * @return {undefined}
             */
            advanceSlide: function() {

                if (!this.stateChanging) {

                    TrialData.data.state.currentSlideIndex++;

                    var currentSlideIndex =
                        TrialData.data.state.currentSlideIndex;

                    if (currentSlideIndex === TrialData.data.schema.length) {
                        $state.go('home', {}, {reload: true});
                    } else {
                        $state.go(
                            TrialData.data.schema[currentSlideIndex].name,
                            {},
                            {reload: true}
                        );
                    }
                }
            },

            /**
             * Resets the experiment session.
             *
             * In resetting the session, after resetting the {@link
             * Angular.TrialData|TrialData} service, `masterReset()` does
             * the following:
             *
             *  - Generates a new UUID for the session number
             *  - Fetches a random experiment schema from the backend
             *  - Gets the terminal number (as specified in
             *  `config/custom.js` for this specific machine
             *
             *  The {@link Angular.TrialData|TrialData} service is then updated
             *  with these new data.
             *
             * @function masterReset
             * @memberof Angular.ExperimentManager
             * @instance
             * @return {$q.promise} This promise is resolved when the reset
             * is complete and rejected if the reset fails.
             */
            masterReset: function() {

                var deferred = $q.defer();

                // Reset TrialData
                TrialData.reset();

                // Generate new session identifier and store it in TrialData
                TrialData.data.metadata.session_number = rfc4122.v4();

                // Get a new experiment setup from the backend
                $http.get('/api/experiment-schemas/random')
                    .success(function(data) {

                        // Assign the media property from the ExperimentSchema
                        // we received as the media property on the TrialData
                        TrialData.data.media = data.media;
                        TrialData.data.schema = data.structure;

                        // Get custom configuration information from the backend
                        $http.get('/api/config')
                            .success(function(data) {

                                // Specify this terminal from custom config
                                TrialData.data.metadata.terminal =
                                    data.metadata.terminal;
                                deferred.resolve();
                            })
                            .error(function() {
                                deferred.reject('The configuration could not' +
                                    'be fetched from the server.');
                            });
                    })
                    .error(function() {
                        deferred.reject('An experiment schema could not be ' +
                            'fetched from the server');
                    });

                return deferred.promise;
            },

            /**
             * Reflects the current state as reported by Angular's
             * `$stateProvider`. When the state is changing (a new 'slide'
             * is being presented--typically after a call to {@link
             * Angular.ExperimentManager#advanceSlide advanceSlide}, this
             * will be set to `true`. When the change completes, this will
             * be set to `true`.
             *
             * @var stateChanging
             * @memberof Angular.ExperimentManager
             * @instance
             * @type {boolean}
             */
            stateChanging: false,

            stateChangeStartListener: stateChangeStartListener,
            stateChangeSuccessListener: stateChangeSuccessListener
        };

        return returnObject;
    }
]);

'use strict';

// Service to wrap Socket.IO
angular.module('core').factory('SocketIOService', ['socketFactory',
    function(socketFactory) {
        return socketFactory();
    }
]);

'use strict';

/**
 * The `TrialData` service is responsible for collecting the responses
 * provided by the user over the course of an experiment session.
 *
 * @class Angular.TrialData
 * @memberof Angular
 */

angular.module('core').factory('TrialData', ['$log',
    function($log) {

        $log.info('Instantiating TrialData service.');

        /**
         * This function returns the object that will be populated with data
         * as responses are provided by the user. You are free to manipulate
         * this object to suit your needs, but take note of the properties
         * that are configured with the demo app that are described here. In
         * particular, take care when modifying the metadata and state
         * properties.
         *
         * @function BlankDataObject
         * @inner
         * @property {{}} answers This object is where the actual
         * responses from users are stored. For example, when you create a
         * question in your study specification document (see the
         * [README](index.html)) with its `questionStoragePath` property set
         * to `data.answers.foo`, it will appear in this object under
         * `answers.foo`.
         * @property {Date} date The date and time that this session commenced
         * @property {Object[]} media The media that were played during this
         * session
         * @property {*} timestamps Timestamps for different points during
         * the session
         * @property {{}} metadata Various important metadata (location,
         * language, terminal number, session number, etc.)
         * @property {{}} state Important data for maintaining the state of
         * the session
         * @memberof Angular.TrialData~
         * @returns {{}}
         */
        function BlankDataObject() {

            $log.debug('Creating new BlankDataObject.');

            return {
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
                    language: 'en',
                    session_number: null,
                    location: 'taipei_city',
                    terminal: null
                },
                state: {
                    currentSlideIndex: -1,
                    mediaPlayCount: 0
                }
            };
        }

        var trialData = {

            /**
             * The data object for this session. Originally set to a new
             * instance of a {@link
             * Angular.TrialData~BlankDataObject|BlankDataObject}.
             *
             * @name data
             * @memberof Angular.TrialData#
             */
            data: null,

            /**
             * Converts the object in {@link Angular.TrialData#data|data}
             * to JSON and returns it.
             *
             * @function toJson
             * @memberof Angular.TrialData#
             * @returns {string}
             */
            toJson: function() {
                $log.debug('TrialData service returning data as JSON.');
                return angular.toJson(this.data, true);
            },

            /**
             * Sets {@link Angular.TrialData#data|data} to a new
             * instance of a {@link
             * Angular.TrialData~BlankDataObject|BlankDataObject}.
             *
             * @function reset
             * @memberof Angular.TrialData#
             * @return {undefined}
             */
            reset: function() {
                $log.info('Resetting TrialData service.');
                this.data = new BlankDataObject();
            },

            /**
             * Sets the value for a 'keypath' in {@link
             * Angular.TrialData#data|data}. Keypaths are dot-delimited
             * 'addresses' into the {@link Angular.TrialData#data|data}
             * object. For instance, the string `'foo.bar.baz'` interpreted
             * as a keypath points to the `baz` property of an object, which
             * is the value of the `bar` property on the `foo` object:
             *
             * ```
             * data = {
             *     foo: {
             *         bar: {
             *             baz: 13 // foo.bar.baz points to this value
             *         }
             *     }
             * }
             * ```
             *
             * @function setValueForPath
             * @memberof Angular.TrialData#
             * @param {string} path The keypath (address) into {@link
             * Angular.TrialData#data|data}
             * @param {*} value The value that this keypath should hold
             * @param {*} options Currently only one option is supported:
             * `array_index`. If you pass `{array_index: 2}` with a keypath
             * of `foo`, this method will expect to find an *`Array`* at the
             * keypath `foo`, and will set the value at index 2 of this
             * array to `value`.
             * @return {undefined}
             */
            setValueForPath: function(path, value, options) {

                $log.debug('Setting ' + path + ' in TrialData to: ' +
                    value, options);

                if (value === 'true') {
                    value = true;
                } else if (value === 'false') {
                    value = false;
                }

                var numericRegex = /\d+\.?\d?/;
                if (typeof value === 'string' && value.match(numericRegex)) {
                    value = parseFloat(value);
                }

                // Downcase simple strings
                if (typeof value === 'string') {
                    value = value.toLowerCase();
                }

                if (path && value !== undefined) {
                    // A moving reference to internal objects within this
                    // (this TrialData)
                    var schema = this;
                    var pList = path.split('.');
                    var len = pList.length;
                    for (var i = 0; i < len - 1; i++) {
                        var elem = pList[i];
                        if (!schema[elem]) schema[elem] = {};
                        schema = schema[elem];
                    }

                    if (options && options.hasOwnProperty('array_index') &&
                        typeof options.array_index === 'number') {

                        if (schema[pList[len - 1]] === undefined) {
                            schema[pList[len - 1]] = [];
                        }

                        // Iterate over array up to one less than
                        // options.array_index. If each index isn't set up to
                        // this point, set it to null.
                        for (var j = 0; j < options.array_index; j++) {
                            if (schema[pList[len - 1]][j] === undefined) {
                                schema[pList[len - 1]][j] = null;
                            }
                        }

                        schema[pList[len - 1]][options.array_index] = value;
                    } else {
                        schema[pList[len - 1]] = value;
                    }
                }
            },

            /**
             * Sets the value for a 'keypath' in {@link
             * Angular.TrialData#data|data}. (See {@link
             * Angular.TrialData~setValueForPath|setValueForPath} for more
             * infomation on 'paths'.)
             *
             * When this method is used, the current media in the experiment
             * session is observed. `value` is expected to be placed into an
             * `Array` that is stored at the keypath, and the number of the
             * current media is used to decide the index of this array at
             * which `value` should be stored. For instance, if the second
             * media excerpt was just played and this method was called with
             * `'data.answers.foo'` for `path` and `14` for `'value'`, `14`
             * would be stored in the second index of the array at
             * `'data.answers.foo'`.
             *
             * @function setValueForPathForCurrentmedia
             * @memberof Angular.TrialData#
             * @param {string} path The keypath (address) into {@link
                * Angular.TrialData#data|data}
             * @param {*} value The value that this keypath should hold
             * @return {undefined}
             */
            setValueForPathForCurrentMedia: function(path, value) {

                $log.debug('Setting ' + path + ' in TrialData for current' +
                    ' media to: ' + value + '.');

                var index;

                // If no media have played (we're likely debugging)
                if (this.data.state.mediaPlayCount <= 0) {
                    index = 0;
                } else {
                    index = this.data.state.mediaPlayCount - 1;
                }

                this.setValueForPath(path, value, {array_index: index});
            },

            /**
             * Updates the language stored at the `metadata.language`
             * property of {@link Angular.TrialData#data|data}
             *
             * @function language
             * @memberof Angular.TrialData#
             * @param {string} newLanguage The language
             * @returns {string} The language to which the
             * `metadata.language` property of {@link
             * Angular.TrialData#data|data} is set after the call to this
             * method.
             */
            language: function(newLanguage) {

                if (typeof newLanguage === 'string') {

                    $log.info('Setting language in TrialData to ' +
                        newLanguage);

                    this.data.metadata.language = newLanguage;
                } else {
                    $log.error('Not updating language in TrialData. A string' +
                        ' was not received.');
                }

                return this.data.metadata.language;
            }
        };

        trialData.data = new BlankDataObject();

        return trialData;
    }
]);
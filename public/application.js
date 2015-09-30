'use strict';

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

        // Set nggettext to use English by default
        gettextCatalog.setCurrentLanguage('en');
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

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

// Configure nggettext
angular.module(ApplicationConfiguration.applicationModuleName).run(['gettextCatalog',
	function(gettextCatalog) {

		// Set nggettext to use Taiwanese by default
		gettextCatalog.setCurrentLanguage('zh_TW');
		gettextCatalog.debug = true;
	}
]);

// Configure scroll-in of slides as participant advances
angular.module(ApplicationConfiguration.applicationModuleName).run(['$rootScope',
	function($rootScope) {
		$rootScope.$on('$stateChangeSuccess',function(){
			$("html, body").animate({ scrollTop: 0 }, 200);
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

'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.hashPrefix('!');
	}
]);

// Configure gettext
angular.module(ApplicationConfiguration.applicationModuleName).run(['gettextCatalog',
	function(gettextCatalog) {
		gettextCatalog.setCurrentLanguage('zh_TW');
		gettextCatalog.debug = true;
	}
]);

angular.module(ApplicationConfiguration.applicationModuleName).run(['$rootScope',
	function($rootScope) {
		$rootScope.$on('$stateChangeSuccess',function(){
			$("html, body").animate({ scrollTop: 0 }, 200);
		});
	}
]);

//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
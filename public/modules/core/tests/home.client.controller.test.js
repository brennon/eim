'use strict';

(function() {
	describe('HomeController', function() {
		//Initialize global variables
		var scope,
			HomeController;

		// Load the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		beforeEach(inject(function($controller, $rootScope) {
			scope = $rootScope.$new();

			HomeController = $controller('HomeController', {
				$scope: scope
			});
		}));

//    it('should augment the scope with an experimentSchema property', function() {
//      httpBackend.when('GET', '/api/experiment-schemas/random').respond({one:1});
//      httpBackend.flush();
//      expect(scope.experimentSchema).toBeTruthy();
//    });
	});
})();
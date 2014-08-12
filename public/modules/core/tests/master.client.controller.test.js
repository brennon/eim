'use strict';

(function() {
  describe('MasterController', function() {
    //Initialize global variables
    var scope,
      MasterController,
      httpBackend;

    // Load the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    beforeEach(inject(function($controller, $rootScope, _$httpBackend_) {
      scope = $rootScope.$new();

      httpBackend = _$httpBackend_;

      MasterController = $controller('MasterController', {
        $scope: scope
      });
    }));

    it('should augment the scope with an experimentSchema property', function() {
      httpBackend.when('GET', '/api/experiment-schemas/random').respond({one:1});
      httpBackend.flush();
      expect(scope.experimentSchema).toBeTruthy();
    });
  });
})();
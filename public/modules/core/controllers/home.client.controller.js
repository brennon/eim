'use strict';

angular.module('core').controller('HomeController', ['$scope', '$http', 'Authentication',
	function($scope, $http, Authentication) {

		// This provides Authentication context.
		$scope.authentication = Authentication;
	}
]);
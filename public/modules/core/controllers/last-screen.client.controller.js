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
                .post('/api/trials', TrialData.toCompact())
                .catch(function(response) {
                    var errorMessage = 'The POST to /api/trials failed.';
                    $log.error(errorMessage, response);
                    throw new Error(errorMessage);
                });
        }
    ]);

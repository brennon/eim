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
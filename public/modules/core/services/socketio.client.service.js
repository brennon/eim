'use strict';

// Service to wrap Socket.IO
angular.module('core').factory('SocketIOService', ['socketFactory',
    function(socketFactory) {
        return socketFactory();
    }
]);

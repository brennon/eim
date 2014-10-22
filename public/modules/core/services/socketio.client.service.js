'use strict';

// Service to wrap Socket.IO
angular.module('core').factory('SocketIOService', ['$rootScope',
    function($rootScope) {

        var socket = io();

        return {

            emit: function(eventName, data, callback) {
                socket.emit(eventName, data, function() {
                    var args = arguments;
                    $rootScope.$apply(function() {
                        if (callback) {
                            callback.apply(socket, args);
                        }
                    });
                })
            },

            on: function(eventName, callback) {
                var args = arguments;
                socket.on(eventName, function() {
                    $rootScope.$apply(function() {
                        callback.apply(socket, args);
                    });
                });
            },

            removeListener: function(eventName, callback) {
                socket.removeListener(eventName, callback);
            }
        };
    }
]);

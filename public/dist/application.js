'use strict';
// Init the application configuration module for AngularJS application
var ApplicationConfiguration = function () {
    // Init module configuration options
    var applicationModuleName = 'emotion-in-motion';
    var applicationModuleVendorDependencies = [
        'ngResource',
        'ngCookies',
        'ngAnimate',
        'ngTouch',
        'ngSanitize',
        'ui.router',
        'ui.bootstrap',
        'ui.utils',
        'vr.directives.slider',
        'cfp.hotkeys'
      ];
    // Add a new vertical module
    var registerModule = function (moduleName) {
      // Create angular module
      angular.module(moduleName, []);
      // Add the module to the AngularJS configuration file
      angular.module(applicationModuleName).requires.push(moduleName);
    };
    return {
      applicationModuleName: applicationModuleName,
      applicationModuleVendorDependencies: applicationModuleVendorDependencies,
      registerModule: registerModule
    };
  }();'use strict';
//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);
// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config([
  '$locationProvider',
  function ($locationProvider) {
    $locationProvider.hashPrefix('!');
  }
]);
//Then define the init function for starting up the application
angular.element(document).ready(function () {
  //Fixing facebook bug with redirect
  if (window.location.hash === '#_=_')
    window.location.hash = '#!';
  //Then init the app
  angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});'use strict';
// Use Application configuration module to register a new module
ApplicationConfiguration.registerModule('angular-hotkeys');'use strict';
// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');/* jshint ignore:start */
/*!
 * angular-hotkeys v1.4.3
 * https://chieffancypants.github.io/angular-hotkeys
 * Copyright (c) 2014 Wes Cruver
 * License: MIT
 */
/*
 * angular-hotkeys
 *
 * Automatic keyboard shortcuts for your angular apps
 *
 * (c) 2014 Wes Cruver
 * License: MIT
 */
(function () {
  'use strict';
  angular.module('cfp.hotkeys', []).provider('hotkeys', function () {
    /**
     * Configurable setting to disable the cheatsheet entirely
     * @type {Boolean}
     */
    this.includeCheatSheet = true;
    /**
     * Configurable setting for the cheat sheet title
     * @type {String}
     */
    this.templateTitle = 'Keyboard Shortcuts:';
    /**
     * Cheat sheet template in the event you want to totally customize it.
     * @type {String}
     */
    this.template = '<div class="cfp-hotkeys-container fade" ng-class="{in: helpVisible}" style="display: none;"><div class="cfp-hotkeys">' + '<h4 class="cfp-hotkeys-title">{{ title }}</h4>' + '<table><tbody>' + '<tr ng-repeat="hotkey in hotkeys | filter:{ description: \'!$$undefined$$\' }">' + '<td class="cfp-hotkeys-keys">' + '<span ng-repeat="key in hotkey.format() track by $index" class="cfp-hotkeys-key">{{ key }}</span>' + '</td>' + '<td class="cfp-hotkeys-text">{{ hotkey.description }}</td>' + '</tr>' + '</tbody></table>' + '<div class="cfp-hotkeys-close" ng-click="toggleCheatSheet()">\xd7</div>' + '</div></div>';
    /**
     * Configurable setting for the cheat sheet hotkey
     * @type {String}
     */
    this.cheatSheetHotkey = '?';
    /**
     * Configurable setting for the cheat sheet description
     * @type {String}
     */
    this.cheatSheetDescription = 'Show / hide this help menu';
    this.$get = [
      '$rootElement',
      '$rootScope',
      '$compile',
      '$window',
      '$document',
      function ($rootElement, $rootScope, $compile, $window, $document) {
        // monkeypatch Mousetrap's stopCallback() function
        // this version doesn't return true when the element is an INPUT, SELECT, or TEXTAREA
        // (instead we will perform this check per-key in the _add() method)
        Mousetrap.stopCallback = function (event, element) {
          // if the element has the class "mousetrap" then no need to stop
          if ((' ' + element.className + ' ').indexOf(' mousetrap ') > -1) {
            return false;
          }
          return element.contentEditable && element.contentEditable == 'true';
        };
        /**
       * Convert strings like cmd into symbols like ⌘
       * @param  {String} combo Key combination, e.g. 'mod+f'
       * @return {String}       The key combination with symbols
       */
        function symbolize(combo) {
          var map = {
              command: '\u2318',
              shift: '\u21e7',
              left: '\u2190',
              right: '\u2192',
              up: '\u2191',
              down: '\u2193',
              'return': '\u21a9',
              backspace: '\u232b'
            };
          combo = combo.split('+');
          for (var i = 0; i < combo.length; i++) {
            // try to resolve command / ctrl based on OS:
            if (combo[i] === 'mod') {
              if ($window.navigator && $window.navigator.platform.indexOf('Mac') >= 0) {
                combo[i] = 'command';
              } else {
                combo[i] = 'ctrl';
              }
            }
            combo[i] = map[combo[i]] || combo[i];
          }
          return combo.join(' + ');
        }
        /**
       * Hotkey object used internally for consistency
       *
       * @param {array}    combo       The keycombo. it's an array to support multiple combos
       * @param {String}   description Description for the keycombo
       * @param {Function} callback    function to execute when keycombo pressed
       * @param {string}   action      the type of event to listen for (for mousetrap)
       * @param {array}    allowIn     an array of tag names to allow this combo in ('INPUT', 'SELECT', and/or 'TEXTAREA')
       * @param {Boolean}  persistent  Whether the hotkey persists navigation events
       */
        function Hotkey(combo, description, callback, action, allowIn, persistent) {
          // TODO: Check that the values are sane because we could
          // be trying to instantiate a new Hotkey with outside dev's
          // supplied values
          this.combo = combo instanceof Array ? combo : [combo];
          this.description = description;
          this.callback = callback;
          this.action = action;
          this.allowIn = allowIn;
          this.persistent = persistent;
        }
        /**
       * Helper method to format (symbolize) the key combo for display
       *
       * @return {[Array]} An array of the key combination sequence
       *   for example: "command+g c i" becomes ["⌘ + g", "c", "i"]
       *
       * TODO: this gets called a lot.  We should cache the result
       */
        Hotkey.prototype.format = function () {
          // Don't show all the possible key combos, just the first one.  Not sure
          // of usecase here, so open a ticket if my assumptions are wrong
          var combo = this.combo[0];
          var sequence = combo.split(/[\s]/);
          for (var i = 0; i < sequence.length; i++) {
            sequence[i] = symbolize(sequence[i]);
          }
          return sequence;
        };
        /**
       * A new scope used internally for the cheatsheet
       * @type {$rootScope.Scope}
       */
        var scope = $rootScope.$new();
        /**
       * Holds an array of Hotkey objects currently bound
       * @type {Array}
       */
        scope.hotkeys = [];
        /**
       * Contains the state of the help's visibility
       * @type {Boolean}
       */
        scope.helpVisible = false;
        /**
       * Holds the title string for the help menu
       * @type {String}
       */
        scope.title = this.templateTitle;
        /**
       * Expose toggleCheatSheet to hotkeys scope so we can call it using
       * ng-click from the template
       * @type {function}
       */
        scope.toggleCheatSheet = toggleCheatSheet;
        /**
       * Holds references to the different scopes that have bound hotkeys
       * attached.  This is useful to catch when the scopes are `$destroy`d and
       * then automatically unbind the hotkey.
       *
       * @type {Array}
       */
        var boundScopes = [];
        $rootScope.$on('$routeChangeSuccess', function (event, route) {
          purgeHotkeys();
          if (route && route.hotkeys) {
            angular.forEach(route.hotkeys, function (hotkey) {
              // a string was given, which implies this is a function that is to be
              // $eval()'d within that controller's scope
              // TODO: hotkey here is super confusing.  sometimes a function (that gets turned into an array), sometimes a string
              var callback = hotkey[2];
              if (typeof callback === 'string' || callback instanceof String) {
                hotkey[2] = [
                  callback,
                  route
                ];
              }
              // todo: perform check to make sure not already defined:
              // this came from a route, so it's likely not meant to be persistent
              hotkey[5] = false;
              _add.apply(this, hotkey);
            });
          }
        });
        // Auto-create a help menu:
        if (this.includeCheatSheet) {
          var document = $document[0];
          var element = $rootElement[0];
          var helpMenu = angular.element(this.template);
          _add(this.cheatSheetHotkey, this.cheatSheetDescription, toggleCheatSheet);
          // If $rootElement is document or documentElement, then body must be used
          if (element === document || element === document.documentElement) {
            element = document.body;
          }
          angular.element(element).append($compile(helpMenu)(scope));
        }
        /**
       * Purges all non-persistent hotkeys (such as those defined in routes)
       *
       * Without this, the same hotkey would get recreated everytime
       * the route is accessed.
       */
        function purgeHotkeys() {
          var i = scope.hotkeys.length;
          while (i--) {
            var hotkey = scope.hotkeys[i];
            if (hotkey && !hotkey.persistent) {
              _del(hotkey);
            }
          }
        }
        /**
       * Toggles the help menu element's visiblity
       */
        var previousEsc = false;
        function toggleCheatSheet() {
          scope.helpVisible = !scope.helpVisible;
          // Bind to esc to remove the cheat sheet.  Ideally, this would be done
          // as a directive in the template, but that would create a nasty
          // circular dependency issue that I don't feel like sorting out.
          if (scope.helpVisible) {
            previousEsc = _get('esc');
            _del('esc');
            // Here's an odd way to do this: we're going to use the original
            // description of the hotkey on the cheat sheet so that it shows up.
            // without it, no entry for esc will ever show up (#22)
            _add('esc', previousEsc.description, toggleCheatSheet);
          } else {
            _del('esc');
            // restore the previously bound ESC key
            if (previousEsc !== false) {
              _add(previousEsc);
            }
          }
        }
        /**
       * Creates a new Hotkey and creates the Mousetrap binding
       *
       * @param {string}   combo       mousetrap key binding
       * @param {string}   description description for the help menu
       * @param {Function} callback    method to call when key is pressed
       * @param {string}   action      the type of event to listen for (for mousetrap)
       * @param {array}    allowIn     an array of tag names to allow this combo in ('INPUT', 'SELECT', and/or 'TEXTAREA')
       * @param {boolean}  persistent  if true, the binding is preserved upon route changes
       */
        function _add(combo, description, callback, action, allowIn, persistent) {
          // used to save original callback for "allowIn" wrapping:
          var _callback;
          // these elements are prevented by the default Mousetrap.stopCallback():
          var preventIn = [
              'INPUT',
              'SELECT',
              'TEXTAREA'
            ];
          // Determine if object format was given:
          var objType = Object.prototype.toString.call(combo);
          if (objType === '[object Object]') {
            description = combo.description;
            callback = combo.callback;
            action = combo.action;
            persistent = combo.persistent;
            allowIn = combo.allowIn;
            combo = combo.combo;
          }
          // description is optional:
          if (description instanceof Function) {
            action = callback;
            callback = description;
            description = '$$undefined$$';
          } else if (angular.isUndefined(description)) {
            description = '$$undefined$$';
          }
          // any items added through the public API are for controllers
          // that persist through navigation, and thus undefined should mean
          // true in this case.
          if (persistent === undefined) {
            persistent = true;
          }
          // if callback is defined, then wrap it in a function
          // that checks if the event originated from a form element.
          // the function blocks the callback from executing unless the element is specified
          // in allowIn (emulates Mousetrap.stopCallback() on a per-key level)
          if (typeof callback === 'function') {
            // save the original callback
            _callback = callback;
            // make sure allowIn is an array
            if (!(allowIn instanceof Array)) {
              allowIn = [];
            }
            // remove anything from preventIn that's present in allowIn
            var index;
            for (var i = 0; i < allowIn.length; i++) {
              allowIn[i] = allowIn[i].toUpperCase();
              index = preventIn.indexOf(allowIn[i]);
              if (index !== -1) {
                preventIn.splice(index, 1);
              }
            }
            // create the new wrapper callback
            callback = function (event) {
              var shouldExecute = true;
              var target = event.target || event.srcElement;
              // srcElement is IE only
              var nodeName = target.nodeName.toUpperCase();
              // check if the input has a mousetrap class, and skip checking preventIn if so
              if ((' ' + target.className + ' ').indexOf(' mousetrap ') > -1) {
                shouldExecute = true;
              } else {
                // don't execute callback if the event was fired from inside an element listed in preventIn
                for (var i = 0; i < preventIn.length; i++) {
                  if (preventIn[i] === nodeName) {
                    shouldExecute = false;
                    break;
                  }
                }
              }
              if (shouldExecute) {
                wrapApply(_callback.apply(this, arguments));
              }
            };
          }
          if (typeof action === 'string') {
            Mousetrap.bind(combo, wrapApply(callback), action);
          } else {
            Mousetrap.bind(combo, wrapApply(callback));
          }
          var hotkey = new Hotkey(combo, description, callback, action, allowIn, persistent);
          scope.hotkeys.push(hotkey);
          return hotkey;
        }
        /**
       * delete and unbind a Hotkey
       *
       * @param  {mixed} hotkey   Either the bound key or an instance of Hotkey
       * @return {boolean}        true if successful
       */
        function _del(hotkey) {
          var combo = hotkey instanceof Hotkey ? hotkey.combo : hotkey;
          Mousetrap.unbind(combo);
          if (combo instanceof Array) {
            var retStatus = true;
            for (var i = 0; i < combo.length; i++) {
              retStatus = _del(combo[i]) && retStatus;
            }
            return retStatus;
          } else {
            var index = scope.hotkeys.indexOf(_get(combo));
            if (index > -1) {
              // if the combo has other combos bound, don't unbind the whole thing, just the one combo:
              if (scope.hotkeys[index].combo.length > 1) {
                scope.hotkeys[index].combo.splice(scope.hotkeys[index].combo.indexOf(combo), 1);
              } else {
                scope.hotkeys.splice(index, 1);
              }
              return true;
            }
          }
          return false;
        }
        /**
       * Get a Hotkey object by key binding
       *
       * @param  {[string]} combo  the key the Hotkey is bound to
       * @return {Hotkey}          The Hotkey object
       */
        function _get(combo) {
          var hotkey;
          for (var i = 0; i < scope.hotkeys.length; i++) {
            hotkey = scope.hotkeys[i];
            if (hotkey.combo.indexOf(combo) > -1) {
              return hotkey;
            }
          }
          return false;
        }
        /**
       * Binds the hotkey to a particular scope.  Useful if the scope is
       * destroyed, we can automatically destroy the hotkey binding.
       *
       * @param  {Object} scope The scope to bind to
       */
        function bindTo(scope) {
          // Add the scope to the list of bound scopes
          boundScopes[scope.$id] = [];
          scope.$on('$destroy', function () {
            var i = boundScopes[scope.$id].length;
            while (i--) {
              _del(boundScopes[scope.$id][i]);
              delete boundScopes[scope.$id][i];
            }
          });
          // return an object with an add function so we can keep track of the
          // hotkeys and their scope that we added via this chaining method
          return {
            add: function (args) {
              var hotkey;
              if (arguments.length > 1) {
                hotkey = _add.apply(this, arguments);
              } else {
                hotkey = _add(args);
              }
              boundScopes[scope.$id].push(hotkey);
              return this;
            }
          };
        }
        /**
       * All callbacks sent to Mousetrap are wrapped using this function
       * so that we can force a $scope.$apply()
       *
       * @param  {Function} callback [description]
       * @return {[type]}            [description]
       */
        function wrapApply(callback) {
          // return mousetrap a function to call
          return function (event, combo) {
            // if this is an array, it means we provided a route object
            // because the scope wasn't available yet, so rewrap the callback
            // now that the scope is available:
            if (callback instanceof Array) {
              var funcString = callback[0];
              var route = callback[1];
              callback = function (event) {
                route.scope.$eval(funcString);
              };
            }
            // this takes place outside angular, so we'll have to call
            // $apply() to make sure angular's digest happens
            $rootScope.$apply(function () {
              // call the original hotkey callback with the keyboard event
              callback(event, _get(combo));
            });
          };
        }
        var publicApi = {
            add: _add,
            del: _del,
            get: _get,
            bindTo: bindTo,
            template: this.template,
            toggleCheatSheet: toggleCheatSheet,
            includeCheatSheet: this.includeCheatSheet,
            cheatSheetHotkey: this.cheatSheetHotkey,
            cheatSheetDescription: this.cheatSheetDescription,
            purgeHotkeys: purgeHotkeys,
            templateTitle: this.templateTitle
          };
        return publicApi;
      }
    ];
  }).directive('hotkey', [
    'hotkeys',
    function (hotkeys) {
      return {
        restrict: 'A',
        link: function (scope, el, attrs) {
          var key, allowIn;
          angular.forEach(scope.$eval(attrs.hotkey), function (func, hotkey) {
            // split and trim the hotkeys string into array
            allowIn = typeof attrs.hotkeyAllowIn === 'string' ? attrs.hotkeyAllowIn.split(/[\s,]+/) : [];
            key = hotkey;
            hotkeys.add({
              combo: hotkey,
              description: attrs.hotkeyDescription,
              callback: func,
              action: attrs.hotkeyAction,
              allowIn: allowIn
            });
          });
          // remove the hotkey if the directive is destroyed:
          el.bind('$destroy', function () {
            hotkeys.del(key);
          });
        }
      };
    }
  ]).run([
    'hotkeys',
    function (hotkeys) {
    }
  ]);
}());
/*global define:false */
/**
 * Copyright 2013 Craig Campbell
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Mousetrap is a simple keyboard shortcut library for Javascript with
 * no external dependencies
 *
 * @version 1.4.6
 * @url craig.is/killing/mice
 */
(function (window, document, undefined) {
  /**
     * mapping of special keycodes to their corresponding keys
     *
     * everything in this dictionary cannot use keypress events
     * so it has to be here to map to the correct keycodes for
     * keyup/keydown events
     *
     * @type {Object}
     */
  var _MAP = {
      8: 'backspace',
      9: 'tab',
      13: 'enter',
      16: 'shift',
      17: 'ctrl',
      18: 'alt',
      20: 'capslock',
      27: 'esc',
      32: 'space',
      33: 'pageup',
      34: 'pagedown',
      35: 'end',
      36: 'home',
      37: 'left',
      38: 'up',
      39: 'right',
      40: 'down',
      45: 'ins',
      46: 'del',
      91: 'meta',
      93: 'meta',
      224: 'meta'
    },
    /**
         * mapping for special characters so they can support
         *
         * this dictionary is only used incase you want to bind a
         * keyup or keydown event to one of these keys
         *
         * @type {Object}
         */
    _KEYCODE_MAP = {
      106: '*',
      107: '+',
      109: '-',
      110: '.',
      111: '/',
      186: ';',
      187: '=',
      188: ',',
      189: '-',
      190: '.',
      191: '/',
      192: '`',
      219: '[',
      220: '\\',
      221: ']',
      222: '\''
    },
    /**
         * this is a mapping of keys that require shift on a US keypad
         * back to the non shift equivelents
         *
         * this is so you can use keyup events with these keys
         *
         * note that this will only work reliably on US keyboards
         *
         * @type {Object}
         */
    _SHIFT_MAP = {
      '~': '`',
      '!': '1',
      '@': '2',
      '#': '3',
      '$': '4',
      '%': '5',
      '^': '6',
      '&': '7',
      '*': '8',
      '(': '9',
      ')': '0',
      '_': '-',
      '+': '=',
      ':': ';',
      '"': '\'',
      '<': ',',
      '>': '.',
      '?': '/',
      '|': '\\'
    },
    /**
         * this is a list of special strings you can use to map
         * to modifier keys when you specify your keyboard shortcuts
         *
         * @type {Object}
         */
    _SPECIAL_ALIASES = {
      'option': 'alt',
      'command': 'meta',
      'return': 'enter',
      'escape': 'esc',
      'mod': /Mac|iPod|iPhone|iPad/.test(navigator.platform) ? 'meta' : 'ctrl'
    },
    /**
         * variable to store the flipped version of _MAP from above
         * needed to check if we should use keypress or not when no action
         * is specified
         *
         * @type {Object|undefined}
         */
    _REVERSE_MAP,
    /**
         * a list of all the callbacks setup via Mousetrap.bind()
         *
         * @type {Object}
         */
    _callbacks = {},
    /**
         * direct map of string combinations to callbacks used for trigger()
         *
         * @type {Object}
         */
    _directMap = {},
    /**
         * keeps track of what level each sequence is at since multiple
         * sequences can start out with the same sequence
         *
         * @type {Object}
         */
    _sequenceLevels = {},
    /**
         * variable to store the setTimeout call
         *
         * @type {null|number}
         */
    _resetTimer,
    /**
         * temporary state where we will ignore the next keyup
         *
         * @type {boolean|string}
         */
    _ignoreNextKeyup = false,
    /**
         * temporary state where we will ignore the next keypress
         *
         * @type {boolean}
         */
    _ignoreNextKeypress = false,
    /**
         * are we currently inside of a sequence?
         * type of action ("keyup" or "keydown" or "keypress") or false
         *
         * @type {boolean|string}
         */
    _nextExpectedAction = false;
  /**
     * loop through the f keys, f1 to f19 and add them to the map
     * programatically
     */
  for (var i = 1; i < 20; ++i) {
    _MAP[111 + i] = 'f' + i;
  }
  /**
     * loop through to map numbers on the numeric keypad
     */
  for (i = 0; i <= 9; ++i) {
    _MAP[i + 96] = i;
  }
  /**
     * cross browser add event method
     *
     * @param {Element|HTMLDocument} object
     * @param {string} type
     * @param {Function} callback
     * @returns void
     */
  function _addEvent(object, type, callback) {
    if (object.addEventListener) {
      object.addEventListener(type, callback, false);
      return;
    }
    object.attachEvent('on' + type, callback);
  }
  /**
     * takes the event and returns the key character
     *
     * @param {Event} e
     * @return {string}
     */
  function _characterFromEvent(e) {
    // for keypress events we should return the character as is
    if (e.type == 'keypress') {
      var character = String.fromCharCode(e.which);
      // if the shift key is not pressed then it is safe to assume
      // that we want the character to be lowercase.  this means if
      // you accidentally have caps lock on then your key bindings
      // will continue to work
      //
      // the only side effect that might not be desired is if you
      // bind something like 'A' cause you want to trigger an
      // event when capital A is pressed caps lock will no longer
      // trigger the event.  shift+a will though.
      if (!e.shiftKey) {
        character = character.toLowerCase();
      }
      return character;
    }
    // for non keypress events the special maps are needed
    if (_MAP[e.which]) {
      return _MAP[e.which];
    }
    if (_KEYCODE_MAP[e.which]) {
      return _KEYCODE_MAP[e.which];
    }
    // if it is not in the special map
    // with keydown and keyup events the character seems to always
    // come in as an uppercase character whether you are pressing shift
    // or not.  we should make sure it is always lowercase for comparisons
    return String.fromCharCode(e.which).toLowerCase();
  }
  /**
     * checks if two arrays are equal
     *
     * @param {Array} modifiers1
     * @param {Array} modifiers2
     * @returns {boolean}
     */
  function _modifiersMatch(modifiers1, modifiers2) {
    return modifiers1.sort().join(',') === modifiers2.sort().join(',');
  }
  /**
     * resets all sequence counters except for the ones passed in
     *
     * @param {Object} doNotReset
     * @returns void
     */
  function _resetSequences(doNotReset) {
    doNotReset = doNotReset || {};
    var activeSequences = false, key;
    for (key in _sequenceLevels) {
      if (doNotReset[key]) {
        activeSequences = true;
        continue;
      }
      _sequenceLevels[key] = 0;
    }
    if (!activeSequences) {
      _nextExpectedAction = false;
    }
  }
  /**
     * finds all callbacks that match based on the keycode, modifiers,
     * and action
     *
     * @param {string} character
     * @param {Array} modifiers
     * @param {Event|Object} e
     * @param {string=} sequenceName - name of the sequence we are looking for
     * @param {string=} combination
     * @param {number=} level
     * @returns {Array}
     */
  function _getMatches(character, modifiers, e, sequenceName, combination, level) {
    var i, callback, matches = [], action = e.type;
    // if there are no events related to this keycode
    if (!_callbacks[character]) {
      return [];
    }
    // if a modifier key is coming up on its own we should allow it
    if (action == 'keyup' && _isModifier(character)) {
      modifiers = [character];
    }
    // loop through all callbacks for the key that was pressed
    // and see if any of them match
    for (i = 0; i < _callbacks[character].length; ++i) {
      callback = _callbacks[character][i];
      // if a sequence name is not specified, but this is a sequence at
      // the wrong level then move onto the next match
      if (!sequenceName && callback.seq && _sequenceLevels[callback.seq] != callback.level) {
        continue;
      }
      // if the action we are looking for doesn't match the action we got
      // then we should keep going
      if (action != callback.action) {
        continue;
      }
      // if this is a keypress event and the meta key and control key
      // are not pressed that means that we need to only look at the
      // character, otherwise check the modifiers as well
      //
      // chrome will not fire a keypress if meta or control is down
      // safari will fire a keypress if meta or meta+shift is down
      // firefox will fire a keypress if meta or control is down
      if (action == 'keypress' && !e.metaKey && !e.ctrlKey || _modifiersMatch(modifiers, callback.modifiers)) {
        // when you bind a combination or sequence a second time it
        // should overwrite the first one.  if a sequenceName or
        // combination is specified in this call it does just that
        //
        // @todo make deleting its own method?
        var deleteCombo = !sequenceName && callback.combo == combination;
        var deleteSequence = sequenceName && callback.seq == sequenceName && callback.level == level;
        if (deleteCombo || deleteSequence) {
          _callbacks[character].splice(i, 1);
        }
        matches.push(callback);
      }
    }
    return matches;
  }
  /**
     * takes a key event and figures out what the modifiers are
     *
     * @param {Event} e
     * @returns {Array}
     */
  function _eventModifiers(e) {
    var modifiers = [];
    if (e.shiftKey) {
      modifiers.push('shift');
    }
    if (e.altKey) {
      modifiers.push('alt');
    }
    if (e.ctrlKey) {
      modifiers.push('ctrl');
    }
    if (e.metaKey) {
      modifiers.push('meta');
    }
    return modifiers;
  }
  /**
     * prevents default for this event
     *
     * @param {Event} e
     * @returns void
     */
  function _preventDefault(e) {
    if (e.preventDefault) {
      e.preventDefault();
      return;
    }
    e.returnValue = false;
  }
  /**
     * stops propogation for this event
     *
     * @param {Event} e
     * @returns void
     */
  function _stopPropagation(e) {
    if (e.stopPropagation) {
      e.stopPropagation();
      return;
    }
    e.cancelBubble = true;
  }
  /**
     * actually calls the callback function
     *
     * if your callback function returns false this will use the jquery
     * convention - prevent default and stop propogation on the event
     *
     * @param {Function} callback
     * @param {Event} e
     * @returns void
     */
  function _fireCallback(callback, e, combo, sequence) {
    // if this event should not happen stop here
    if (Mousetrap.stopCallback(e, e.target || e.srcElement, combo, sequence)) {
      return;
    }
    if (callback(e, combo) === false) {
      _preventDefault(e);
      _stopPropagation(e);
    }
  }
  /**
     * handles a character key event
     *
     * @param {string} character
     * @param {Array} modifiers
     * @param {Event} e
     * @returns void
     */
  function _handleKey(character, modifiers, e) {
    var callbacks = _getMatches(character, modifiers, e), i, doNotReset = {}, maxLevel = 0, processedSequenceCallback = false;
    // Calculate the maxLevel for sequences so we can only execute the longest callback sequence
    for (i = 0; i < callbacks.length; ++i) {
      if (callbacks[i].seq) {
        maxLevel = Math.max(maxLevel, callbacks[i].level);
      }
    }
    // loop through matching callbacks for this key event
    for (i = 0; i < callbacks.length; ++i) {
      // fire for all sequence callbacks
      // this is because if for example you have multiple sequences
      // bound such as "g i" and "g t" they both need to fire the
      // callback for matching g cause otherwise you can only ever
      // match the first one
      if (callbacks[i].seq) {
        // only fire callbacks for the maxLevel to prevent
        // subsequences from also firing
        //
        // for example 'a option b' should not cause 'option b' to fire
        // even though 'option b' is part of the other sequence
        //
        // any sequences that do not match here will be discarded
        // below by the _resetSequences call
        if (callbacks[i].level != maxLevel) {
          continue;
        }
        processedSequenceCallback = true;
        // keep a list of which sequences were matches for later
        doNotReset[callbacks[i].seq] = 1;
        _fireCallback(callbacks[i].callback, e, callbacks[i].combo, callbacks[i].seq);
        continue;
      }
      // if there were no sequence matches but we are still here
      // that means this is a regular match so we should fire that
      if (!processedSequenceCallback) {
        _fireCallback(callbacks[i].callback, e, callbacks[i].combo);
      }
    }
    // if the key you pressed matches the type of sequence without
    // being a modifier (ie "keyup" or "keypress") then we should
    // reset all sequences that were not matched by this event
    //
    // this is so, for example, if you have the sequence "h a t" and you
    // type "h e a r t" it does not match.  in this case the "e" will
    // cause the sequence to reset
    //
    // modifier keys are ignored because you can have a sequence
    // that contains modifiers such as "enter ctrl+space" and in most
    // cases the modifier key will be pressed before the next key
    //
    // also if you have a sequence such as "ctrl+b a" then pressing the
    // "b" key will trigger a "keypress" and a "keydown"
    //
    // the "keydown" is expected when there is a modifier, but the
    // "keypress" ends up matching the _nextExpectedAction since it occurs
    // after and that causes the sequence to reset
    //
    // we ignore keypresses in a sequence that directly follow a keydown
    // for the same character
    var ignoreThisKeypress = e.type == 'keypress' && _ignoreNextKeypress;
    if (e.type == _nextExpectedAction && !_isModifier(character) && !ignoreThisKeypress) {
      _resetSequences(doNotReset);
    }
    _ignoreNextKeypress = processedSequenceCallback && e.type == 'keydown';
  }
  /**
     * handles a keydown event
     *
     * @param {Event} e
     * @returns void
     */
  function _handleKeyEvent(e) {
    // normalize e.which for key events
    // @see http://stackoverflow.com/questions/4285627/javascript-keycode-vs-charcode-utter-confusion
    if (typeof e.which !== 'number') {
      e.which = e.keyCode;
    }
    var character = _characterFromEvent(e);
    // no character found then stop
    if (!character) {
      return;
    }
    // need to use === for the character check because the character can be 0
    if (e.type == 'keyup' && _ignoreNextKeyup === character) {
      _ignoreNextKeyup = false;
      return;
    }
    Mousetrap.handleKey(character, _eventModifiers(e), e);
  }
  /**
     * determines if the keycode specified is a modifier key or not
     *
     * @param {string} key
     * @returns {boolean}
     */
  function _isModifier(key) {
    return key == 'shift' || key == 'ctrl' || key == 'alt' || key == 'meta';
  }
  /**
     * called to set a 1 second timeout on the specified sequence
     *
     * this is so after each key press in the sequence you have 1 second
     * to press the next key before you have to start over
     *
     * @returns void
     */
  function _resetSequenceTimer() {
    clearTimeout(_resetTimer);
    _resetTimer = setTimeout(_resetSequences, 1000);
  }
  /**
     * reverses the map lookup so that we can look for specific keys
     * to see what can and can't use keypress
     *
     * @return {Object}
     */
  function _getReverseMap() {
    if (!_REVERSE_MAP) {
      _REVERSE_MAP = {};
      for (var key in _MAP) {
        // pull out the numeric keypad from here cause keypress should
        // be able to detect the keys from the character
        if (key > 95 && key < 112) {
          continue;
        }
        if (_MAP.hasOwnProperty(key)) {
          _REVERSE_MAP[_MAP[key]] = key;
        }
      }
    }
    return _REVERSE_MAP;
  }
  /**
     * picks the best action based on the key combination
     *
     * @param {string} key - character for key
     * @param {Array} modifiers
     * @param {string=} action passed in
     */
  function _pickBestAction(key, modifiers, action) {
    // if no action was picked in we should try to pick the one
    // that we think would work best for this key
    if (!action) {
      action = _getReverseMap()[key] ? 'keydown' : 'keypress';
    }
    // modifier keys don't work as expected with keypress,
    // switch to keydown
    if (action == 'keypress' && modifiers.length) {
      action = 'keydown';
    }
    return action;
  }
  /**
     * binds a key sequence to an event
     *
     * @param {string} combo - combo specified in bind call
     * @param {Array} keys
     * @param {Function} callback
     * @param {string=} action
     * @returns void
     */
  function _bindSequence(combo, keys, callback, action) {
    // start off by adding a sequence level record for this combination
    // and setting the level to 0
    _sequenceLevels[combo] = 0;
    /**
         * callback to increase the sequence level for this sequence and reset
         * all other sequences that were active
         *
         * @param {string} nextAction
         * @returns {Function}
         */
    function _increaseSequence(nextAction) {
      return function () {
        _nextExpectedAction = nextAction;
        ++_sequenceLevels[combo];
        _resetSequenceTimer();
      };
    }
    /**
         * wraps the specified callback inside of another function in order
         * to reset all sequence counters as soon as this sequence is done
         *
         * @param {Event} e
         * @returns void
         */
    function _callbackAndReset(e) {
      _fireCallback(callback, e, combo);
      // we should ignore the next key up if the action is key down
      // or keypress.  this is so if you finish a sequence and
      // release the key the final key will not trigger a keyup
      if (action !== 'keyup') {
        _ignoreNextKeyup = _characterFromEvent(e);
      }
      // weird race condition if a sequence ends with the key
      // another sequence begins with
      setTimeout(_resetSequences, 10);
    }
    // loop through keys one at a time and bind the appropriate callback
    // function.  for any key leading up to the final one it should
    // increase the sequence. after the final, it should reset all sequences
    //
    // if an action is specified in the original bind call then that will
    // be used throughout.  otherwise we will pass the action that the
    // next key in the sequence should match.  this allows a sequence
    // to mix and match keypress and keydown events depending on which
    // ones are better suited to the key provided
    for (var i = 0; i < keys.length; ++i) {
      var isFinal = i + 1 === keys.length;
      var wrappedCallback = isFinal ? _callbackAndReset : _increaseSequence(action || _getKeyInfo(keys[i + 1]).action);
      _bindSingle(keys[i], wrappedCallback, action, combo, i);
    }
  }
  /**
     * Converts from a string key combination to an array
     *
     * @param  {string} combination like "command+shift+l"
     * @return {Array}
     */
  function _keysFromString(combination) {
    if (combination === '+') {
      return ['+'];
    }
    return combination.split('+');
  }
  /**
     * Gets info for a specific key combination
     *
     * @param  {string} combination key combination ("command+s" or "a" or "*")
     * @param  {string=} action
     * @returns {Object}
     */
  function _getKeyInfo(combination, action) {
    var keys, key, i, modifiers = [];
    // take the keys from this pattern and figure out what the actual
    // pattern is all about
    keys = _keysFromString(combination);
    for (i = 0; i < keys.length; ++i) {
      key = keys[i];
      // normalize key names
      if (_SPECIAL_ALIASES[key]) {
        key = _SPECIAL_ALIASES[key];
      }
      // if this is not a keypress event then we should
      // be smart about using shift keys
      // this will only work for US keyboards however
      if (action && action != 'keypress' && _SHIFT_MAP[key]) {
        key = _SHIFT_MAP[key];
        modifiers.push('shift');
      }
      // if this key is a modifier then add it to the list of modifiers
      if (_isModifier(key)) {
        modifiers.push(key);
      }
    }
    // depending on what the key combination is
    // we will try to pick the best event for it
    action = _pickBestAction(key, modifiers, action);
    return {
      key: key,
      modifiers: modifiers,
      action: action
    };
  }
  /**
     * binds a single keyboard combination
     *
     * @param {string} combination
     * @param {Function} callback
     * @param {string=} action
     * @param {string=} sequenceName - name of sequence if part of sequence
     * @param {number=} level - what part of the sequence the command is
     * @returns void
     */
  function _bindSingle(combination, callback, action, sequenceName, level) {
    // store a direct mapped reference for use with Mousetrap.trigger
    _directMap[combination + ':' + action] = callback;
    // make sure multiple spaces in a row become a single space
    combination = combination.replace(/\s+/g, ' ');
    var sequence = combination.split(' '), info;
    // if this pattern is a sequence of keys then run through this method
    // to reprocess each pattern one key at a time
    if (sequence.length > 1) {
      _bindSequence(combination, sequence, callback, action);
      return;
    }
    info = _getKeyInfo(combination, action);
    // make sure to initialize array if this is the first time
    // a callback is added for this key
    _callbacks[info.key] = _callbacks[info.key] || [];
    // remove an existing match if there is one
    _getMatches(info.key, info.modifiers, { type: info.action }, sequenceName, combination, level);
    // add this call back to the array
    // if it is a sequence put it at the beginning
    // if not put it at the end
    //
    // this is important because the way these are processed expects
    // the sequence ones to come first
    _callbacks[info.key][sequenceName ? 'unshift' : 'push']({
      callback: callback,
      modifiers: info.modifiers,
      action: info.action,
      seq: sequenceName,
      level: level,
      combo: combination
    });
  }
  /**
     * binds multiple combinations to the same callback
     *
     * @param {Array} combinations
     * @param {Function} callback
     * @param {string|undefined} action
     * @returns void
     */
  function _bindMultiple(combinations, callback, action) {
    for (var i = 0; i < combinations.length; ++i) {
      _bindSingle(combinations[i], callback, action);
    }
  }
  // start!
  _addEvent(document, 'keypress', _handleKeyEvent);
  _addEvent(document, 'keydown', _handleKeyEvent);
  _addEvent(document, 'keyup', _handleKeyEvent);
  var Mousetrap = {
      bind: function (keys, callback, action) {
        keys = keys instanceof Array ? keys : [keys];
        _bindMultiple(keys, callback, action);
        return this;
      },
      unbind: function (keys, action) {
        return Mousetrap.bind(keys, function () {
        }, action);
      },
      trigger: function (keys, action) {
        if (_directMap[keys + ':' + action]) {
          _directMap[keys + ':' + action]({}, keys);
        }
        return this;
      },
      reset: function () {
        _callbacks = {};
        _directMap = {};
        return this;
      },
      stopCallback: function (e, element) {
        // if the element has the class "mousetrap" then no need to stop
        if ((' ' + element.className + ' ').indexOf(' mousetrap ') > -1) {
          return false;
        }
        // stop for input, select, and textarea
        return element.tagName == 'INPUT' || element.tagName == 'SELECT' || element.tagName == 'TEXTAREA' || element.isContentEditable;
      },
      handleKey: _handleKey
    };
  // expose mousetrap to the global object
  window.Mousetrap = Mousetrap;
  // expose mousetrap as an AMD module
  if (typeof define === 'function' && define.amd) {
    define(Mousetrap);
  }
}(window, document));  /* jshint ignore:end */'use strict';
// Setting up route
angular.module('core').config([
  '$stateProvider',
  '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {
    // Redirect to home view when route not found
    $urlRouterProvider.otherwise('/');
    // Home state routing
    $stateProvider.state('home', {
      url: '/',
      templateUrl: 'modules/core/views/home.client.view.html'
    }).state('start', {
      url: '/start',
      templateUrl: 'modules/core/views/start.client.view.html'
    }).state('sound-test', {
      url: '/sound-test',
      templateUrl: 'modules/core/views/sound-test.client.view.html'
    }).state('eda-instructions', {
      url: '/eda-instructions',
      templateUrl: 'modules/core/views/eda-instructions.client.view.html'
    }).state('pox-instructions', {
      url: '/pox-instructions',
      templateUrl: 'modules/core/views/pox-instructions.client.view.html'
    }).state('signal-test', {
      url: '/signal-test',
      templateUrl: 'modules/core/views/signal-test.client.view.html'
    }).state('demographics', {
      url: '/demographics',
      templateUrl: 'modules/core/views/demographics.client.view.html'
    }).state('musical-background', {
      url: '/musical-background',
      templateUrl: 'modules/core/views/musical-background.client.view.html'
    });
  }
]);'use strict';
angular.module('core').controller('DemographicsController', [
  '$scope',
  'TrialData',
  function ($scope, TrialData) {
    // Expose TrialData on scope
    $scope.trialData = TrialData;
    // Value lists for form
    $scope.nationalities = [
      'Afghan',
      'Albanian',
      'Algerian',
      'American',
      'Andorran',
      'Angolan',
      'Antiguans',
      'Argentinean',
      'Armenian',
      'Australian',
      'Austrian',
      'Azerbaijani',
      'Bahamian',
      'Bahraini',
      'Bangladeshi',
      'Barbadian',
      'Barbudans',
      'Batswana',
      'Belarusian',
      'Belgian',
      'Belizean',
      'Beninese',
      'Bhutanese',
      'Bolivian',
      'Bosnian',
      'Brazilian',
      'British',
      'Bruneian',
      'Bulgarian',
      'Burkinabe',
      'Burmese',
      'Burundian',
      'Cambodian',
      'Cameroonian',
      'Canadian',
      'Cape Verdean',
      'Central African',
      'Chadian',
      'Chilean',
      'Chinese',
      'Colombian',
      'Comoran',
      'Congolese',
      'Costa Rican',
      'Croatian',
      'Cuban',
      'Cypriot',
      'Czech',
      'Danish',
      'Djibouti',
      'Dominican',
      'Dutch',
      'East Timorese',
      'Ecuadorean',
      'Egyptian',
      'Emirian',
      'Equatorial Guinean',
      'Eritrean',
      'Estonian',
      'Ethiopian',
      'Fijian',
      'Filipino',
      'Finnish',
      'French',
      'Gabonese',
      'Gambian',
      'Georgian',
      'German',
      'Ghanaian',
      'Greek',
      'Grenadian',
      'Guatemalan',
      'Guinea-Bissauan',
      'Guinean',
      'Guyanese',
      'Haitian',
      'Herzegovinian',
      'Honduran',
      'Hungarian',
      'I-Kiribati',
      'Icelander',
      'Indian',
      'Indonesian',
      'Iranian',
      'Iraqi',
      'Irish',
      'Israeli',
      'Italian',
      'Ivorian',
      'Jamaican',
      'Japanese',
      'Jordanian',
      'Kazakhstani',
      'Kenyan',
      'Kittian and Nevisian',
      'Kuwaiti',
      'Kyrgyz',
      'Laotian',
      'Latvian',
      'Lebanese',
      'Liberian',
      'Libyan',
      'Liechtensteiner',
      'Lithuanian',
      'Luxembourger',
      'Macedonian',
      'Malagasy',
      'Malawian',
      'Malaysian',
      'Maldivan',
      'Malian',
      'Maltese',
      'Marshallese',
      'Mauritanian',
      'Mauritian',
      'Mexican',
      'Micronesian',
      'Moldovan',
      'Monacan',
      'Mongolian',
      'Moroccan',
      'Mosotho',
      'Motswana',
      'Mozambican',
      'Namibian',
      'Nauruan',
      'Nepalese',
      'New Zealander',
      'Nicaraguan',
      'Nigerian',
      'Nigerien',
      'North Korean',
      'Northern Irish',
      'Norwegian',
      'Omani',
      'Pakistani',
      'Palauan',
      'Panamanian',
      'Papua New Guinean',
      'Paraguayan',
      'Peruvian',
      'Polish',
      'Portuguese',
      'Qatari',
      'Romanian',
      'Russian',
      'Rwandan',
      'SaintLucian',
      'Salvadoran',
      'Samoan',
      'San Marinese',
      'Sao Tomean',
      'Saudi',
      'Scottish',
      'Senegalese',
      'Serbian',
      'Seychellois',
      'Sierra Leonean',
      'Singaporean',
      'Slovakian',
      'Slovenian',
      'Solomon Islander',
      'Somali',
      'South African',
      'South Korean',
      'Spanish',
      'Sri Lankan',
      'Sudanese',
      'Surinamer',
      'Swazi',
      'Swedish',
      'Swiss',
      'Syrian',
      'Taiwanese',
      'Tajik',
      'Tanzanian',
      'Thai',
      'Togolese',
      'Tongan',
      'Trinidadian or Tobagonian',
      'Tunisian',
      'Turkish',
      'Tuvaluan',
      'Ugandan',
      'Ukrainian',
      'Uruguayan',
      'Uzbekistani',
      'Venezuelan',
      'Vietnamese',
      'Welsh',
      'Yemenite',
      'Zambian',
      'Zimbabwean'
    ];
    $scope.years = [];
    var thisYear = new Date().getFullYear();
    for (var i = thisYear - 110; i <= thisYear; i++) {
      $scope.years.push(i);
    }
    // Save data to Trial Data
    // Downcase nationality for persisting
    $scope.nationalityChanged = function (nationality) {
      TrialData.data.answers.nationality = nationality.toLowerCase();
    };
    $scope.yearChanged = function (year) {
      TrialData.data.answers.birthyear = year;
    };
    $scope.genderChanged = function (gender) {
      TrialData.data.answers.gender = gender;
    };
    $scope.trialDataJson = function () {
      return TrialData.toJson();
    };
  }
]);'use strict';
angular.module('core').controller('HeaderController', [
  '$scope',
  function ($scope) {
  }
]);'use strict';
angular.module('core').controller('HomeController', [
  '$scope',
  '$http',
  function ($scope, $http) {
  }
]);'use strict';
angular.module('core').controller('MasterController', [
  '$scope',
  'TrialData',
  'hotkeys',
  function ($scope, TrialData, hotkeys) {
    $scope.trialDataJson = function () {
      return TrialData.toJson();
    };
    // Global debug mode flag
    $scope.debugMode = false;
    // Setup hotkeys
    hotkeys.add({
      combo: 'd d',
      description: 'Toggle debug mode',
      callback: function () {
        $scope.debugMode = !$scope.debugMode;
        var alertMessage = 'Debug mode has been ';
        if ($scope.debugMode) {
          alertMessage += 'enabled.';
        } else {
          alertMessage += 'disabled.';
        }
        $scope.addAlert({
          type: 'info',
          msg: alertMessage
        });
      }
    });
    // Store/show alerts
    $scope.alerts = [];
    $scope.addAlert = function (alert) {
      var errorExists = false;
      for (var i = 0; i < $scope.alerts.length; i++) {
        if ($scope.alerts[i].msg === alert.msg && $scope.alerts[i].type === alert.type) {
          errorExists = true;
          break;
        }
      }
      if (!errorExists) {
        $scope.alerts.push(alert);
      }
    };
    $scope.closeAlert = function (index) {
      $scope.alerts.splice(index, 1);
    };
    $scope.addGenericErrorAlert = function () {
      $scope.addAlert({
        type: 'danger',
        msg: 'There seems to be a problem. Please contact a mediator for assistance.'
      });
    };
  }
]);'use strict';
angular.module('core').controller('DemographicsController', [
  '$scope',
  'TrialData',
  function ($scope, TrialData) {
    // Expose TrialData on scope
    $scope.trialData = TrialData;
    // Value lists for form
    $scope.nationalities = [
      'Afghan',
      'Albanian',
      'Algerian',
      'American',
      'Andorran',
      'Angolan',
      'Antiguans',
      'Argentinean',
      'Armenian',
      'Australian',
      'Austrian',
      'Azerbaijani',
      'Bahamian',
      'Bahraini',
      'Bangladeshi',
      'Barbadian',
      'Barbudans',
      'Batswana',
      'Belarusian',
      'Belgian',
      'Belizean',
      'Beninese',
      'Bhutanese',
      'Bolivian',
      'Bosnian',
      'Brazilian',
      'British',
      'Bruneian',
      'Bulgarian',
      'Burkinabe',
      'Burmese',
      'Burundian',
      'Cambodian',
      'Cameroonian',
      'Canadian',
      'Cape Verdean',
      'Central African',
      'Chadian',
      'Chilean',
      'Chinese',
      'Colombian',
      'Comoran',
      'Congolese',
      'Costa Rican',
      'Croatian',
      'Cuban',
      'Cypriot',
      'Czech',
      'Danish',
      'Djibouti',
      'Dominican',
      'Dutch',
      'East Timorese',
      'Ecuadorean',
      'Egyptian',
      'Emirian',
      'Equatorial Guinean',
      'Eritrean',
      'Estonian',
      'Ethiopian',
      'Fijian',
      'Filipino',
      'Finnish',
      'French',
      'Gabonese',
      'Gambian',
      'Georgian',
      'German',
      'Ghanaian',
      'Greek',
      'Grenadian',
      'Guatemalan',
      'Guinea-Bissauan',
      'Guinean',
      'Guyanese',
      'Haitian',
      'Herzegovinian',
      'Honduran',
      'Hungarian',
      'I-Kiribati',
      'Icelander',
      'Indian',
      'Indonesian',
      'Iranian',
      'Iraqi',
      'Irish',
      'Israeli',
      'Italian',
      'Ivorian',
      'Jamaican',
      'Japanese',
      'Jordanian',
      'Kazakhstani',
      'Kenyan',
      'Kittian and Nevisian',
      'Kuwaiti',
      'Kyrgyz',
      'Laotian',
      'Latvian',
      'Lebanese',
      'Liberian',
      'Libyan',
      'Liechtensteiner',
      'Lithuanian',
      'Luxembourger',
      'Macedonian',
      'Malagasy',
      'Malawian',
      'Malaysian',
      'Maldivan',
      'Malian',
      'Maltese',
      'Marshallese',
      'Mauritanian',
      'Mauritian',
      'Mexican',
      'Micronesian',
      'Moldovan',
      'Monacan',
      'Mongolian',
      'Moroccan',
      'Mosotho',
      'Motswana',
      'Mozambican',
      'Namibian',
      'Nauruan',
      'Nepalese',
      'New Zealander',
      'Nicaraguan',
      'Nigerian',
      'Nigerien',
      'North Korean',
      'Northern Irish',
      'Norwegian',
      'Omani',
      'Pakistani',
      'Palauan',
      'Panamanian',
      'Papua New Guinean',
      'Paraguayan',
      'Peruvian',
      'Polish',
      'Portuguese',
      'Qatari',
      'Romanian',
      'Russian',
      'Rwandan',
      'SaintLucian',
      'Salvadoran',
      'Samoan',
      'San Marinese',
      'Sao Tomean',
      'Saudi',
      'Scottish',
      'Senegalese',
      'Serbian',
      'Seychellois',
      'Sierra Leonean',
      'Singaporean',
      'Slovakian',
      'Slovenian',
      'Solomon Islander',
      'Somali',
      'South African',
      'South Korean',
      'Spanish',
      'Sri Lankan',
      'Sudanese',
      'Surinamer',
      'Swazi',
      'Swedish',
      'Swiss',
      'Syrian',
      'Taiwanese',
      'Tajik',
      'Tanzanian',
      'Thai',
      'Togolese',
      'Tongan',
      'Trinidadian or Tobagonian',
      'Tunisian',
      'Turkish',
      'Tuvaluan',
      'Ugandan',
      'Ukrainian',
      'Uruguayan',
      'Uzbekistani',
      'Venezuelan',
      'Vietnamese',
      'Welsh',
      'Yemenite',
      'Zambian',
      'Zimbabwean'
    ];
    $scope.years = [];
    var thisYear = new Date().getFullYear();
    for (var i = thisYear - 110; i <= thisYear; i++) {
      $scope.years.push(i);
    }
    // Save data to Trial Data
    // Downcase nationality for persisting
    $scope.nationalityChanged = function (nationality) {
      TrialData.data.answers.nationality = nationality.toLowerCase();
    };
    $scope.yearChanged = function (year) {
      TrialData.data.answers.birthyear = year;
    };
    $scope.genderChanged = function (gender) {
      TrialData.data.answers.gender = gender;
    };
    $scope.trialDataJson = function () {
      return TrialData.toJson();
    };
  }
]);'use strict';
angular.module('core').controller('SignalTestController', [
  '$scope',
  'TrialData',
  function ($scope, TrialData) {
    // Signal quality indicators
    $scope.edaQuality = 0;
    $scope.poxQuality = 0;
    // Setup socket
    /* global io */
    var socket = io();
    // Log incoming OSC messages
    socket.on('oscMessageSent', function (data) {
      console.log('socket "oscMessageSent" event received with data: ' + data);
    });
    // Function to send start signal test message
    var sendStartSignalTestMessage = function () {
      socket.emit('sendOSCMessage', {
        oscType: 'message',
        address: '/eim/control/startSignalTest',
        args: {
          type: 'string',
          value: '' + TrialData.data.metadata.session_number
        }
      });
    };
    // Function to send stop signal test message
    var sendStopSignalTestMessage = function () {
      socket.emit('sendOSCMessage', {
        oscType: 'message',
        address: '/eim/control/stopSignalTest',
        args: {
          type: 'string',
          value: '' + TrialData.data.metadata.session_number
        }
      });
    };
    // Setup listener for incoming OSC messages
    socket.on('oscMessageReceived', function (data) {
      console.log('got OSC message');
      // If it was an EDA signal quality message
      if (data.address === '/eim/status/signalQuality/eda') {
        // Update EDA signal quality
        $scope.$apply(function updateEDAQuality() {
          $scope.edaQuality = data.args[0].value;
        });  // If it was a POX signal quality message
      } else if (data.address === '/eim/status/signalQuality/pox') {
        // Update POX signal quality
        $scope.$apply(function updatePOXQuality() {
          $scope.poxQuality = data.args[0].value;
        });
      }
    });
    sendStartSignalTestMessage();
  }
]);'use strict';
angular.module('core').controller('SoundTestController', [
  '$scope',
  'TrialData',
  function ($scope, TrialData) {
    /* global io */
    var socket = io();
    socket.on('oscMessageSent', function (data) {
      console.log('socket "oscMessageSent" event received with data: ' + data);
    });
    socket.emit('sendOSCMessage', {
      oscType: 'message',
      address: '/eim/control/startSoundTest',
      args: {
        type: 'string',
        value: TrialData.data.metadata.session_number
      }
    });
    $scope.stopSoundTest = function () {
      socket.emit('sendOSCMessage', {
        oscType: 'message',
        address: '/eim/control/stopSoundTest',
        args: {
          type: 'string',
          value: TrialData.data.metadata.session_number
        }
      });
    };
    $scope.trialDataJson = function () {
      return TrialData.toJson();
    };
  }
]);'use strict';
angular.module('core').controller('StartController', [
  '$scope',
  '$http',
  '$timeout',
  'TrialData',
  function ($scope, $http, $timeout, TrialData) {
    /**
     * Controller sequence of events:
     *
     * 1. Reset TrialData
     * 2. Send message to reset experiment: /eim/control/reset
     * 2. Wait for message: /eim/status/resetComplete
     * 3. Generate a new session ID
     * 4. Store session ID in TrialData
     * 5. Request experiment setup from backend
     * 6. Wait for message: /eim/status/experimentReady
     * 7.
     */
    // Are all pieces of experiment ready to begin?
    $scope.maxReady = false;
    $scope.backendReady = false;
    $scope.experimentReady = function () {
      if ($scope.debugMode) {
        return true;
      } else {
        return $scope.maxReady && $scope.backendReady;
      }
    };
    // Reset TrialData
    TrialData.reset();
    // Setup socket
    /* global io */
    var socket = io();
    // Generate new session identifier
    /* global UUID */
    var sessionID = UUID.generate();
    TrialData.data.metadata.session_number = sessionID;
    // Setup OSC 'message sent' logger
    socket.on('oscMessageSent', function (data) {
      console.log('socket "oscMessageSent" event received with data: ' + data);
    });
    // Configure handlers for incoming OSC messages
    socket.on('oscMessageReceived', function (data) {
      // If we received the resetComplete message
      if (data.address === '/eim/status/resetComplete') {
        // Send experiment start message
        socket.emit('sendOSCMessage', {
          oscType: 'message',
          address: '/eim/control/startExperiment',
          args: {
            type: 'string',
            value: TrialData.data.metadata.session_number
          }
        });
      } else if (data.address === '/eim/status/experimentReady') {
        $scope.$apply(function () {
          $scope.maxReady = true;
        });
      }
    });
    // Get a new experiment setup from the backend
    $http.get('/api/experiment-schemas/random').success(function (data) {
      for (var i in data.media) {
        TrialData.data.media.push(data.media[i].label);
      }
      // Only proceed if we've got some media!
      if (data.media.length > 0) {
        $scope.backendReady = true;
      } else {
        $scope.addGenericErrorAlert();
        throw new Error('No media was found in the fetched experiment schema');
      }
    }).error(function (data) {
      $scope.addGenericErrorAlert();
      throw new Error('An experiment schema could not be fetched from the server');
    });
    // If we aren't ready to go after 10 seconds, throw an error
    $timeout(function () {
      if (!$scope.experimentReady()) {
        $scope.addGenericErrorAlert();
        throw new Error('The experiment was not setup after 10 seconds');
      }
    }, 10000);
  }
]);'use strict';
// Display Trial Data for debugging
angular.module('core').directive('displayTrialData', function () {
  return {
    restrict: 'AE',
    template: '<div><h3>Trial Data</h3><pre>{{trialDataJson()}}</pre></div>'
  };
});'use strict';
// Display Trial Data for debugging
angular.module('core').directive('sliderScale', function () {
  return {
    restrict: 'E',
    template: function (element, attrs) {
      var htmlString = '';
      switch (attrs.imageType) {
      case 'single':
        htmlString = '<div class="row"><div class="col-md-12 slider-image text-center"><img src="' + attrs.singleImageSrc + '" /></div><div class="col-md-2 text-center slider-image"></div><!----><div class="col-md-8 slider-image"><slider ng-model="' + attrs.sliderNgModel + '" floor="' + attrs.sliderFloor + '" ceiling="' + attrs.sliderCeiling + '" step="' + attrs.sliderStep + '" stretch="' + attrs.sliderStretch + '" ng-init="' + attrs.sliderNgModel + '=' + attrs.sliderInitialValue + '"></slider></div><!----><div class="col-md-2 text-center slider-image"></div></div>';
        return htmlString;
      case 'extremes':
        htmlString = '<div class="row"><div class="col-md-2 text-center slider-image"></div><div class="col-md-2 slider-image text-center"><img src="' + attrs.leftImageSrc + '" /></div><!----><div class="col-md-4 slider-image"></div><!----><div class="col-md-2 slider-image text-center"><img src="' + attrs.rightImageSrc + '" /></div><!----><div class="col-md-2 text-center slider-image"></div><div class="col-md-2 text-center slider-image"></div><!----><div class="col-md-8 slider-image"><slider ng-model="' + attrs.sliderNgModel + '" floor="' + attrs.sliderFloor + '" ceiling="' + attrs.sliderCeiling + '" step="' + attrs.sliderStep + '" stretch="' + attrs.sliderStretch + '" ng-init="' + attrs.sliderNgModel + '=' + attrs.sliderInitialValue + '"></slider></div><!----><div class="col-md-2 text-center slider-image"></div></div>';
        return htmlString;
      default:
        htmlString = '<div class="row"><div class="col-md-2 text-center slider-image"></div><!----><div class="col-md-8 slider-image"><slider ng-model="' + attrs.sliderNgModel + '" floor="' + attrs.sliderFloor + '" ceiling="' + attrs.sliderCeiling + '" step="' + attrs.sliderStep + '" stretch="' + attrs.sliderStretch + '" ng-init="' + attrs.sliderNgModel + '=' + attrs.sliderInitialValue + '"></slider></div><!----><div class="col-md-2 text-center slider-image"></div></div>';
        return htmlString;
      }
    }
  };
});'use strict';
//Menu service used for managing  menus
angular.module('core').service('Menus', [function () {
    // Define a set of default roles
    this.defaultRoles = ['user'];
    // Define the menus object
    this.menus = {};
    // A private function for rendering decision 
    var shouldRender = function (user) {
      if (user) {
        for (var userRoleIndex in user.roles) {
          for (var roleIndex in this.roles) {
            if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
              return true;
            }
          }
        }
      } else {
        return this.isPublic;
      }
      return false;
    };
    // Validate menu existance
    this.validateMenuExistance = function (menuId) {
      if (menuId && menuId.length) {
        if (this.menus[menuId]) {
          return true;
        } else {
          throw new Error('Menu does not exists');
        }
      } else {
        throw new Error('MenuId was not provided');
      }
      return false;
    };
    // Get the menu object by menu id
    this.getMenu = function (menuId) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Return the menu object
      return this.menus[menuId];
    };
    // Add new menu object by menu id
    this.addMenu = function (menuId, isPublic, roles) {
      // Create the new menu
      this.menus[menuId] = {
        isPublic: isPublic || false,
        roles: roles || this.defaultRoles,
        items: [],
        shouldRender: shouldRender
      };
      // Return the menu object
      return this.menus[menuId];
    };
    // Remove existing menu object by menu id
    this.removeMenu = function (menuId) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Return the menu object
      delete this.menus[menuId];
    };
    // Add menu item object
    this.addMenuItem = function (menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Push new menu item
      this.menus[menuId].items.push({
        title: menuItemTitle,
        link: menuItemURL,
        menuItemType: menuItemType || 'item',
        menuItemClass: menuItemType,
        uiRoute: menuItemUIRoute || '/' + menuItemURL,
        isPublic: isPublic || this.menus[menuId].isPublic,
        roles: roles || this.defaultRoles,
        items: [],
        shouldRender: shouldRender
      });
      // Return the menu object
      return this.menus[menuId];
    };
    // Add submenu item object
    this.addSubMenuItem = function (menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Search for menu item
      for (var itemIndex in this.menus[menuId].items) {
        if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
          // Push new submenu item
          this.menus[menuId].items[itemIndex].items.push({
            title: menuItemTitle,
            link: menuItemURL,
            uiRoute: menuItemUIRoute || '/' + menuItemURL,
            isPublic: isPublic || this.menus[menuId].isPublic,
            roles: roles || this.defaultRoles,
            shouldRender: shouldRender
          });
        }
      }
      // Return the menu object
      return this.menus[menuId];
    };
    // Remove existing menu object by menu id
    this.removeMenuItem = function (menuId, menuItemURL) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Search for menu item to remove
      for (var itemIndex in this.menus[menuId].items) {
        if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
          this.menus[menuId].items.splice(itemIndex, 1);
        }
      }
      // Return the menu object
      return this.menus[menuId];
    };
    // Remove existing menu object by menu id
    this.removeSubMenuItem = function (menuId, submenuItemURL) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Search for menu item to remove
      for (var itemIndex in this.menus[menuId].items) {
        for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
          if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
            this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
          }
        }
      }
      // Return the menu object
      return this.menus[menuId];
    };
    //Adding the topbar menu
    this.addMenu('topbar');
  }]);'use strict';
// Trial Data service used to persist data for individual trials
angular.module('core').factory('TrialData', [function () {
    function blankDataObject() {
      return {
        answers: {
          musical_expertise: null,
          musical_background: null,
          most_engaged: null,
          hearing_impairements: null,
          visual_impairements: null,
          nationality: null,
          dob: null,
          sex: null,
          music_styles: [],
          most_enjoyed: null,
          emotion_indices: [],
          ratings: {
            positivity: [],
            like_dislike: [],
            familiarity: [],
            engagement: [],
            activity: [],
            chills: [],
            power: []
          }
        },
        date: null,
        media: [],
        timestamps: {
          start: null,
          test: null,
          media: [],
          end: null
        },
        metadata: {
          session_number: null,
          location: 'taipei_city',
          terminal: null
        }
      };
    }
    var trialData = {
        data: {
          answers: {
            musical_expertise: null,
            musical_background: null,
            most_engaged: null,
            hearing_impairements: null,
            visual_impairements: null,
            nationality: null,
            dob: null,
            sex: null,
            music_styles: [],
            most_enjoyed: null,
            emotion_indices: [],
            ratings: {
              positivity: [],
              like_dislike: [],
              familiarity: [],
              engagement: [],
              activity: [],
              chills: [],
              power: []
            }
          },
          date: null,
          media: [],
          timestamps: {
            start: null,
            test: null,
            media: [],
            end: null
          },
          metadata: {
            session_number: null,
            location: 'taipei_city',
            terminal: null
          }
        },
        toJson: function () {
          return angular.toJson(this.data, true);
        },
        reset: function () {
          this.data = blankDataObject();
        }
      };
    return trialData;
  }]);
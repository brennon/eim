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
        'cfp.hotkeys',
        'btford.socket-io',
        'gettext'
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
// Configure gettext
angular.module(ApplicationConfiguration.applicationModuleName).run([
  'gettextCatalog',
  function (gettextCatalog) {
    gettextCatalog.setCurrentLanguage('en');
    gettextCatalog.debug = true;
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
angular.module('core').controller([
  'gettext',
  function (gettext) {
    var missingKeys = [
        gettext('No Signal'),
        gettext('Signal OK'),
        gettext('Personal Details'),
        gettext('Gender'),
        gettext('Male'),
        gettext('Female'),
        gettext('Nationality'),
        gettext('Afghan'),
        gettext('Albanian'),
        gettext('Algerian'),
        gettext('American'),
        gettext('Andorran'),
        gettext('Angolan'),
        gettext('Antiguans'),
        gettext('Argentinean'),
        gettext('Armenian'),
        gettext('Australian'),
        gettext('Austrian'),
        gettext('Azerbaijani'),
        gettext('Bahamian'),
        gettext('Bahraini'),
        gettext('Bangladeshi'),
        gettext('Barbadian'),
        gettext('Barbudans'),
        gettext('Batswana'),
        gettext('Belarusian'),
        gettext('Belgian'),
        gettext('Belizean'),
        gettext('Beninese'),
        gettext('Bhutanese'),
        gettext('Bolivian'),
        gettext('Bosnian'),
        gettext('Brazilian'),
        gettext('British'),
        gettext('Bruneian'),
        gettext('Bulgarian'),
        gettext('Burkinabe'),
        gettext('Burmese'),
        gettext('Burundian'),
        gettext('Cambodian'),
        gettext('Cameroonian'),
        gettext('Canadian'),
        gettext('Cape Verdean'),
        gettext('Central African'),
        gettext('Chadian'),
        gettext('Chilean'),
        gettext('Chinese'),
        gettext('Colombian'),
        gettext('Comoran'),
        gettext('Congolese'),
        gettext('Costa Rican'),
        gettext('Croatian'),
        gettext('Cuban'),
        gettext('Cypriot'),
        gettext('Czech'),
        gettext('Danish'),
        gettext('Djibouti'),
        gettext('Dominican'),
        gettext('Dutch'),
        gettext('East Timorese'),
        gettext('Ecuadorean'),
        gettext('Egyptian'),
        gettext('Emirian'),
        gettext('Equatorial Guinean'),
        gettext('Eritrean'),
        gettext('Estonian'),
        gettext('Ethiopian'),
        gettext('Fijian'),
        gettext('Filipino'),
        gettext('Finnish'),
        gettext('French'),
        gettext('Gabonese'),
        gettext('Gambian'),
        gettext('Georgian'),
        gettext('German'),
        gettext('Ghanaian'),
        gettext('Greek'),
        gettext('Grenadian'),
        gettext('Guatemalan'),
        gettext('Guinea-Bissauan'),
        gettext('Guinean'),
        gettext('Guyanese'),
        gettext('Haitian'),
        gettext('Herzegovinian'),
        gettext('Honduran'),
        gettext('Hungarian'),
        gettext('I-Kiribati'),
        gettext('Icelander'),
        gettext('Indian'),
        gettext('Indonesian'),
        gettext('Iranian'),
        gettext('Iraqi'),
        gettext('Irish'),
        gettext('Israeli'),
        gettext('Italian'),
        gettext('Ivorian'),
        gettext('Jamaican'),
        gettext('Japanese'),
        gettext('Jordanian'),
        gettext('Kazakhstani'),
        gettext('Kenyan'),
        gettext('Kittian and Nevisian'),
        gettext('Kuwaiti'),
        gettext('Kyrgyz'),
        gettext('Laotian'),
        gettext('Latvian'),
        gettext('Lebanese'),
        gettext('Liberian'),
        gettext('Libyan'),
        gettext('Liechtensteiner'),
        gettext('Lithuanian'),
        gettext('Luxembourger'),
        gettext('Macedonian'),
        gettext('Malagasy'),
        gettext('Malawian'),
        gettext('Malaysian'),
        gettext('Maldivan'),
        gettext('Malian'),
        gettext('Maltese'),
        gettext('Marshallese'),
        gettext('Mauritanian'),
        gettext('Mauritian'),
        gettext('Mexican'),
        gettext('Micronesian'),
        gettext('Moldovan'),
        gettext('Monacan'),
        gettext('Mongolian'),
        gettext('Moroccan'),
        gettext('Mosotho'),
        gettext('Motswana'),
        gettext('Mozambican'),
        gettext('Namibian'),
        gettext('Nauruan'),
        gettext('Nepalese'),
        gettext('New Zealander'),
        gettext('Nicaraguan'),
        gettext('Nigerian'),
        gettext('Nigerien'),
        gettext('North Korean'),
        gettext('Northern Irish'),
        gettext('Norwegian'),
        gettext('Omani'),
        gettext('Pakistani'),
        gettext('Palauan'),
        gettext('Panamanian'),
        gettext('Papua New Guinean'),
        gettext('Paraguayan'),
        gettext('Peruvian'),
        gettext('Polish'),
        gettext('Portuguese'),
        gettext('Qatari'),
        gettext('Romanian'),
        gettext('Russian'),
        gettext('Rwandan'),
        gettext('Saint Lucian'),
        gettext('Salvadoran'),
        gettext('Samoan'),
        gettext('San Marinese'),
        gettext('Sao Tomean'),
        gettext('Saudi'),
        gettext('Scottish'),
        gettext('Senegalese'),
        gettext('Serbian'),
        gettext('Seychellois'),
        gettext('Sierra Leonean'),
        gettext('Singaporean'),
        gettext('Slovakian'),
        gettext('Slovenian'),
        gettext('Solomon Islander'),
        gettext('Somali'),
        gettext('South African'),
        gettext('South Korean'),
        gettext('Spanish'),
        gettext('Sri Lankan'),
        gettext('Sudanese'),
        gettext('Surinamer'),
        gettext('Swazi'),
        gettext('Swedish'),
        gettext('Swiss'),
        gettext('Syrian'),
        gettext('Taiwanese'),
        gettext('Tajik'),
        gettext('Tanzanian'),
        gettext('Thai'),
        gettext('Togolese'),
        gettext('Tongan'),
        gettext('Trinidadian or Tobagonian'),
        gettext('Tunisian'),
        gettext('Turkish'),
        gettext('Tuvaluan'),
        gettext('Ugandan'),
        gettext('Ukrainian'),
        gettext('Uruguayan'),
        gettext('Uzbekistani'),
        gettext('Venezuelan'),
        gettext('Vietnamese'),
        gettext('Welsh'),
        gettext('Yemenite'),
        gettext('Zambian'),
        gettext('Zimbabwean'),
        gettext('Birth Year'),
        gettext('2015'),
        gettext('2014'),
        gettext('2013'),
        gettext('2012'),
        gettext('2011'),
        gettext('2010'),
        gettext('2009'),
        gettext('2008'),
        gettext('2007'),
        gettext('2006'),
        gettext('2005'),
        gettext('2004'),
        gettext('2003'),
        gettext('2002'),
        gettext('2001'),
        gettext('2000'),
        gettext('1999'),
        gettext('1998'),
        gettext('1997'),
        gettext('1996'),
        gettext('1995'),
        gettext('1994'),
        gettext('1993'),
        gettext('1992'),
        gettext('1991'),
        gettext('1990'),
        gettext('1989'),
        gettext('1988'),
        gettext('1987'),
        gettext('1986'),
        gettext('1985'),
        gettext('1984'),
        gettext('1983'),
        gettext('1982'),
        gettext('1981'),
        gettext('1980'),
        gettext('1979'),
        gettext('1978'),
        gettext('1977'),
        gettext('1976'),
        gettext('1975'),
        gettext('1974'),
        gettext('1973'),
        gettext('1972'),
        gettext('1971'),
        gettext('1970'),
        gettext('1969'),
        gettext('1968'),
        gettext('1967'),
        gettext('1966'),
        gettext('1965'),
        gettext('1964'),
        gettext('1963'),
        gettext('1962'),
        gettext('1961'),
        gettext('1960'),
        gettext('1959'),
        gettext('1958'),
        gettext('1957'),
        gettext('1956'),
        gettext('1955'),
        gettext('1954'),
        gettext('1953'),
        gettext('1952'),
        gettext('1951'),
        gettext('1950'),
        gettext('1949'),
        gettext('1948'),
        gettext('1947'),
        gettext('1946'),
        gettext('1945'),
        gettext('1944'),
        gettext('1943'),
        gettext('1942'),
        gettext('1941'),
        gettext('1940'),
        gettext('1939'),
        gettext('1938'),
        gettext('1937'),
        gettext('1936'),
        gettext('1935'),
        gettext('1934'),
        gettext('1933'),
        gettext('1932'),
        gettext('1931'),
        gettext('1930'),
        gettext('1929'),
        gettext('1928'),
        gettext('1927'),
        gettext('1926'),
        gettext('1925'),
        gettext('1924'),
        gettext('1923'),
        gettext('1922'),
        gettext('1921'),
        gettext('1920'),
        gettext('1919'),
        gettext('1918'),
        gettext('1917'),
        gettext('1916'),
        gettext('1915'),
        gettext('1914'),
        gettext('1913'),
        gettext('1912'),
        gettext('1911'),
        gettext('1910'),
        gettext('1909'),
        gettext('1908'),
        gettext('1907'),
        gettext('1906'),
        gettext('1905'),
        gettext('Musical Background'),
        gettext('Do you consider yourself a musician or to have specialist musical knowledge?'),
        gettext('Yes'),
        gettext('No'),
        gettext('On a scale of 1 to 5, how would you rate your musical expertise, with 1 being no expertise whatsoever and 5 being an expert?'),
        gettext('No expertise whatsoever'),
        gettext('An expert'),
        gettext('Do you have any hearing impairments? (If so, you may still participate in the experiment!)'),
        gettext('Yes'),
        gettext('No'),
        gettext('Do you have any visual impairments? (If so, you may still participate in the experiment!)'),
        gettext('Yes'),
        gettext('No'),
        gettext('Select all of the following styles to which you regularly listen:'),
        gettext('Rock'),
        gettext('Pop'),
        gettext('Classical'),
        gettext('Jazz'),
        gettext('Dance'),
        gettext('HipHop'),
        gettext('Folk'),
        gettext('World'),
        gettext('None'),
        gettext('Media Questions'),
        gettext('Have you ever heard this song before?'),
        gettext('Not at all engaged, my mind was elsewhere'),
        gettext('I was engaged with the music and responding to it emotionally'),
        gettext('How positive or negative did the music make you feel?'),
        gettext('Very negative'),
        gettext('Very positive'),
        gettext('How involved and engaged were you with the music you have just heard?'),
        gettext('Very drowsy'),
        gettext('Very lively'),
        gettext('How active or passive did the music make you feel?'),
        gettext('Weak<br />(without control, submissive)'),
        gettext('Empowered<br />(in control of everything, dominant)'),
        gettext('How in control did you feel?'),
        gettext('Not at all'),
        gettext('How strongly did you experience any of these physical reactions while you were listening: chills, shivers, thrills, or goosebumps?'),
        gettext('I hated it'),
        gettext('I loved it'),
        gettext('How much did you like/dislike the song?'),
        gettext('I had never heard it before'),
        gettext('I listen to it regularly'),
        gettext('How familiar are you with this music?')
      ];
  }
]);'use strict';
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
    }).state('media-playback', {
      url: '/media-playback',
      templateUrl: 'modules/core/views/media-playback.client.view.html'
    }).state('questionnaire', {
      url: '/media-questionnaire',
      templateUrl: 'modules/core/views/media-questionnaire.client.view.html'
    }).state('thank-you', {
      url: '/thank-you',
      templateUrl: 'modules/core/views/thank-you.client.view.html'
    });
  }
]);'use strict';
angular.module('core').controller('DemographicsController', [
  '$scope',
  'TrialData',
  function ($scope, TrialData) {
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
    for (var i = thisYear; i >= thisYear - 110; i--) {
      $scope.years.push(i);
    }
    // Save data to Trial Data
    // Downcase nationality for persisting
    $scope.nationalityChanged = function (nationality) {
      TrialData.data.answers.nationality = nationality.toLowerCase();
    };
    $scope.yearChanged = function (year) {
      TrialData.data.answers.dob = year;
    };
    $scope.genderChanged = function (gender) {
      TrialData.data.answers.sex = gender;
    };
  }
]);'use strict';
angular.module('core').controller('HomeController', [
  'ExperimentManager',
  '$scope',
  function (ExperimentManager, $scope) {
    // Reset ExperimentManager for new trial
    ExperimentManager.masterReset().then(function experimentResetSuccessHandler() {
      $scope.readyToAdvance = true;
    }, function experimentResetErrorHandler() {
      $scope.addGenericErrorAlert();
      throw new Error('An experiment schema could not be fetched from the server');
    });
    // Ready to move to next slide?
    $scope.readyToAdvance = false;
  }
]);'use strict';
angular.module('core').controller('MasterController', [
  '$scope',
  'TrialData',
  'hotkeys',
  'ExperimentManager',
  'gettextCatalog',
  function ($scope, TrialData, hotkeys, ExperimentManager, gettextCatalog) {
    /*
         * Augmenting $scope
         */
    // TrialData JSON output
    $scope.trialDataJson = function () {
      return TrialData.toJson();
    };
    $scope.setLanguage = function (language) {
      gettextCatalog.setCurrentLanguage(language);
    };
    // Bind 'global' advanceSlide to ExperimentManager#advanceSlide
    $scope.advanceSlide = ExperimentManager.advanceSlide;
    // Global debug mode flag
    $scope.debugMode = false;
    $scope.toggleDebugMode = function () {
      console.log('toggling debug mode');
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
    };
    // Setup hotkeys
    hotkeys.add({
      combo: 'd d',
      description: 'Toggle debug mode',
      callback: $scope.toggleDebugMode
    });
    hotkeys.add({
      combo: 'right',
      description: 'Advance slide',
      callback: $scope.advanceSlide
    });
    /*
         * Alerts
         */
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
    $scope.blackoutClass = false;
    $scope.hideBody = function () {
      $scope.blackoutClass = true;
    };
    $scope.showBody = function () {
      $scope.blackoutClass = false;
    };
    $scope.toggleBodyVisibility = function () {
      $scope.blackoutClass = !$scope.blackoutClass;
    };
  }
]);'use strict';
// FIXME: Address OSC error when message sent without session ID
// TODO: Use different button colors for Playback and Continue
// TODO: Request and save emotion indices
angular.module('core').controller('MediaPlaybackController', [
  '$scope',
  'TrialData',
  'SocketIOService',
  '$timeout',
  'ExperimentManager',
  function ($scope, TrialData, SocketIOService, $timeout, ExperimentManager) {
    var thisController = this;
    // State to control button behavior
    $scope.currentButtonLabel = 'Begin Playback';
    $scope.mediaHasPlayed = false;
    $scope.buttonDisabled = false;
    // Send media playback message to Max
    $scope.startMediaPlayback = function () {
      var mediaIndex = TrialData.data.state.mediaPlayCount;
      var mediaLabel = TrialData.data.media[mediaIndex].label;
      SocketIOService.emit('sendOSCMessage', {
        oscType: 'message',
        address: '/eim/control/mediaID',
        args: [
          {
            type: 'string',
            value: '' + mediaLabel
          },
          {
            type: 'string',
            value: '' + TrialData.data.metadata.session_number
          }
        ]
      });
      $scope.buttonAction = ExperimentManager.advanceSlide;
    };
    // Initially set button action to #startMediaPlayback
    $scope.buttonAction = $scope.startMediaPlayback;
    // Request emotion indices from server
    this.requestEmotionIndex = function () {
      SocketIOService.emit('sendOSCMessage', {
        oscType: 'message',
        address: '/eim/control/emotionIndex',
        args: [{
            type: 'string',
            value: '' + TrialData.data.metadata.session_number
          }]
      });
    };
    // Setup listener for incoming OSC messages
    this.oscMessageReceivedListener = function (data) {
      // If it was a media playback message
      if (data.address === '/eim/status/playback') {
        // If it was a start message
        if (parseInt(data.args[0].value) === 1) {
          // Fade out screen
          $scope.hideBody();  // Otherwise, if it was a stop message
        } else if (parseInt(data.args[0].value) === 0) {
          // Request emotion index from Max
          thisController.requestEmotionIndex();
          // Fade in screen
          $scope.showBody();
          // Update state
          $timeout(function () {
            $scope.$apply(function () {
              $scope.currentButtonLabel = 'Continue';
              $scope.mediaHasPlayed = true;
              $scope.buttonDisabled = true;
            });
          });
        }
      } else if (data.address === '/eim/status/emotionIndex') {
        var emotionIndex = parseInt(data.args[0].value);
        TrialData.data.answers.emotion_indices[TrialData.data.state.mediaPlayCount] = emotionIndex;
        // Increment media play count
        TrialData.data.state.mediaPlayCount++;
        // Update state
        $timeout(function () {
          $scope.$apply(function () {
            $scope.buttonDisabled = false;
          });
        });
      }
    };
    // Attach OSC message received listener
    SocketIOService.on('oscMessageReceived', this.oscMessageReceivedListener);
    // Send a message to stop media playback when this controller is destroyed
    // Also, remove OSC message event listeners
    $scope.$on('$destroy', function stopMediaPlayback() {
      SocketIOService.emit('sendOSCMessage', {
        oscType: 'message',
        address: '/eim/control/stopMedia',
        args: {
          type: 'string',
          value: '' + TrialData.data.metadata.session_number
        }
      });
      SocketIOService.removeListener('oscMessageReceived', thisController.oscMessageReceivedListener);
      $scope.showBody();
    });
  }
]);'use strict';
angular.module('core').controller('MusicalBackgroundController', [
  '$scope',
  'TrialData',
  'ExperimentManager',
  function ($scope, TrialData, ExperimentManager) {
    // Bind $scope.advanceSlide to ExperimentManager functionality
    $scope.advanceSlide = ExperimentManager.advanceSlide;
    // Expose TrialData on scope
    $scope.trialData = TrialData;
    // Save data to Trial Data
    $scope.musicianChanged = function (isMusician) {
      TrialData.data.answers.musical_background = isMusician.toLowerCase() === 'true' ? true : false;
    };
    $scope.hearingImpairmentsChanged = function (hasHearingImpairments) {
      TrialData.data.answers.hearing_impairments = hasHearingImpairments.toLowerCase() === 'true' ? true : false;
    };
    $scope.visualImpairmentsChanged = function (hasVisualImpairments) {
      TrialData.data.answers.visual_impairments = hasVisualImpairments.toLowerCase() === 'true' ? true : false;
    };
    $scope.$watch('musicalExpertise', function musicalExpertiseChanged(musicalExpertise) {
      TrialData.data.answers.musical_expertise = musicalExpertise;
    });
    $scope.stylesChanged = function () {
      var newStyles = [];
      for (var prop in $scope.subject.styles) {
        var style = prop.toString();
        if ($scope.subject.styles[style]) {
          newStyles.push(style);
        }
      }
      TrialData.data.answers.music_styles = newStyles.sort();
    };
    $scope.trialDataJson = function () {
      return TrialData.toJson();
    };
  }
]);'use strict';
angular.module('core').controller('QuestionnaireController', [
  '$scope',
  'TrialData',
  function ($scope, TrialData) {
    $scope.questionnaireData = TrialData.data.schema[TrialData.data.state.currentSlideIndex].data;
  }
]);'use strict';
// TODO: Watch for and log sensor issues
// TODO: In the event of sensor issues, still allow user to advance after delay
angular.module('core').controller('SignalTestController', [
  '$scope',
  'SocketIOService',
  'TrialData',
  function ($scope, SocketIOService, TrialData) {
    // Signal quality indicators
    $scope.edaQuality = 0;
    $scope.poxQuality = 0;
    $scope.testRecordingComplete = false;
    $scope.readyToAdvance = function () {
      if ($scope.debugMode) {
        return true;
      } else {
        return $scope.allSignalsGood();
      }
    };
    // Has test recording been completed?
    $scope.allSignalsGood = function () {
      return $scope.edaQuality && $scope.poxQuality;
    };
    // Function to send start signal test message
    this.sendStartSignalTestMessage = function () {
      SocketIOService.emit('sendOSCMessage', {
        oscType: 'message',
        address: '/eim/control/signalTest',
        args: [
          {
            type: 'integer',
            value: 1
          },
          {
            type: 'string',
            value: '' + TrialData.data.metadata.session_number
          }
        ]
      });
    };
    // Function to send stop signal test message
    this.sendStopSignalTestMessage = function () {
      SocketIOService.emit('sendOSCMessage', {
        oscType: 'message',
        address: '/eim/control/signalTest',
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
    // Configure handler for incoming OSC messages
    this.oscMessageReceivedListener = function (data) {
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
        });  // If the test recording has complete
      } else if (data.address === '/eim/status/testRecordingComplete') {
        // Update continue button
        $scope.$apply(function () {
          $scope.testRecordingComplete = true;
        });
        this.sendStopSignalTestMessage();
      }
    };
    // Attach handler for incoming OSC messages
    SocketIOService.on('oscMessageReceived', this.oscMessageReceivedListener);
    // Destroy handler for incoming OSC messages when $scope is destroyed,
    // and send stop signal test message
    var controller = this;
    $scope.$on('$destroy', function removeOSCMessageReceivedListener() {
      SocketIOService.removeListener('oscMessageReceived', controller.oscMessageReceivedListener);
      controller.sendStopSignalTestMessage();
    });
    this.sendStartSignalTestMessage();
  }
]);'use strict';
angular.module('core').controller('SoundTestController', [
  '$scope',
  'SocketIOService',
  'TrialData',
  function ($scope, SocketIOService, TrialData) {
    // Send a message to Max to start the sound test
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
          value: '' + TrialData.data.metadata.session_number
        }
      ]
    });
    // Function to send a message to Max to stop the sound test
    $scope.stopSoundTest = function () {
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
    $scope.destroyed = false;
    // Send stop sound test message when controller is destroyed
    $scope.$on('$destroy', function () {
      $scope.stopSoundTest();
    });
  }
]);'use strict';
angular.module('core').controller('StartController', [
  '$scope',
  '$timeout',
  'TrialData',
  'ExperimentManager',
  'SocketIOService',
  function ($scope, $timeout, TrialData, ExperimentManager, SocketIOService) {
    // Ready to advance?
    $scope.readyToAdvance = function () {
      return $scope.maxReady || $scope.debugMode;
    };
    // Configure handler for incoming OSC messages
    this.oscMessageReceivedListener = function (data) {
      if (data.address === '/eim/status/startExperiment') {
        $scope.$apply(function () {
          $scope.maxReady = true;
        });
      }
    };
    // Attach handler for incoming OSC messages
    SocketIOService.on('oscMessageReceived', this.oscMessageReceivedListener);
    // Destroy handler for incoming OSC messages when $scope is destroyed
    // Also, remove error timeout
    var thisController = this;
    $scope.$on('$destroy', function removeOSCMessageReceivedListener() {
      SocketIOService.removeListener('oscMessageReceived', thisController.oscMessageReceivedListener);
      $timeout.cancel(thisController.errorTimeout);
    });
    this.sendExperimentStartMessage = function () {
      $scope.maxReady = false;
      SocketIOService.emit('sendOSCMessage', {
        oscType: 'message',
        address: '/eim/control/startExperiment',
        args: {
          type: 'string',
          value: '' + TrialData.data.metadata.session_number
        }
      });
    };
    this.sendExperimentStartMessage();
    this.errorTimeout = $timeout(function () {
    }, 10000);
    this.errorTimeout.then(function () {
      if (!$scope.readyToAdvance) {
        $scope.addGenericErrorAlert();
        throw new Error('Max had not responded to startExperiment message after 10 seconds');
      }
    });
  }
]);'use strict';
angular.module('core').directive('checkboxQuestion', [
  '$compile',
  'TrialData',
  function ($compile, TrialData) {
    return {
      restrict: 'E',
      scope: {},
      link: function (scope, element, attrs) {
        scope.someSelected = false;
        scope.sendToTrialData = function (path, value) {
          if (!attrs.associatedToMedia) {
            TrialData.setValueForPath(path, value);
          } else {
            TrialData.setValueForPathForCurrentMedia(path, value);
          }
        };
        scope.updateCheckboxes = function () {
          var newSomeSelectedValue = false;
          var checkedOptions = [];
          var inputs = element.find('input');
          for (var i = 0; i < inputs.length; i++) {
            var input = angular.element(inputs[i]);
            if (input.attr('name') === attrs.questionId + 'Checkbox') {
              if (input.prop('checked') === true) {
                newSomeSelectedValue = true;
                checkedOptions.push(input.attr('value').toLowerCase());
              }
            }
          }
          scope.someSelected = newSomeSelectedValue;
          checkedOptions.sort();
          scope.sendToTrialData(attrs.controllerDataPath, checkedOptions);
        };
        var questionText = '<div class="row"><div class="col-md-12"><label for="' + attrs.questionId + 'Checkbox" translate>' + attrs.questionLabel + '</label><div>';
        var innerQuestionText = '';
        if (element.data('checkboxOptions')) {
          // Iterate over checkbox options
          for (var i = 0; i < element.data('checkboxOptions').length; i++) {
            var thisOption = element.data('checkboxOptions')[i];
            innerQuestionText += '<label class="checkbox-inline"><input type="checkbox" name="' + attrs.questionId + 'Checkbox" id="' + attrs.questionId + 'Checkbox' + thisOption + '" value="' + thisOption + '" ng-model="' + attrs.questionId + 'Checkbox' + thisOption + '" ng-change="updateCheckboxes()" ng-required="!someSelected">{{\'' + thisOption + '\' | translate}}</input></label>';
          }
        }
        questionText += innerQuestionText + '</div></div></div>';
        var questionElement = angular.element(questionText);
        element.append(questionElement);
        $compile(element.contents())(scope);
      }
    };
  }
]);'use strict';
// Display Trial Data for debugging
angular.module('core').directive('displayTrialData', function () {
  return {
    restrict: 'AE',
    template: '<div class="row"><div class="col-md-12"><h3>Trial Data</h3><pre>{{trialDataJson()}}</pre></div></div>'
  };
});'use strict';
angular.module('core').directive('dropdownQuestion', [
  '$compile',
  'TrialData',
  function ($compile, TrialData) {
    return {
      restrict: 'E',
      scope: {},
      link: function (scope, element, attrs) {
        scope.sendToTrialData = function (path, value) {
          if (!attrs.associatedToMedia) {
            TrialData.setValueForPath(path, value);
          } else {
            TrialData.setValueForPathForCurrentMedia(path, value);
          }
        };
        scope[attrs.questionId + 'Select'] = null;
        scope.$watch(attrs.questionId + 'Select', function (newValue) {
          scope.sendToTrialData(attrs.controllerDataPath, newValue);
        });
        if (element.data('dropdownOptions')) {
          scope.dropdownOptions = element.data('dropdownOptions');
        }
        var selectElement = angular.element('<div class="row"><div class="col-md-12 form-group"><label for="' + attrs.questionId + '" class="control-label" translate>' + attrs.questionLabel + '</label><select id="' + attrs.questionId + '" name="' + attrs.questionId + '" class="form-control" ng-model="' + attrs.questionId + 'Select" required><option ng-repeat="option in dropdownOptions">{{option | translate}}</option> </select></div></div>');
        element.append(selectElement);
        $compile(element.contents())(scope);
      }
    };
  }
]);'use strict';
// FIXME: Address radio question formatting in the context of media questions
// FIXME: Add tests for translation in individual question directives
// FIXME: Convert options to a single format instead of radioOptions, dropdownOptions, etc.
angular.module('core').directive('questionnaire', [
  '$compile',
  function ($compile) {
    var buildScaleQuestion = function (item) {
      var questionElement = angular.element('<scale-question></scale-question>');
      if (item.questionId) {
        questionElement.attr('question-id', item.questionId);
      }
      if (item.questionLabel) {
        questionElement.attr('question-label', item.questionLabel);
      }
      if (item.questionLabelType) {
        questionElement.attr('label-type', item.questionLabelType);
      }
      if (item.questionLikertMinimumDescription) {
        questionElement.attr('minimum-description', item.questionLikertMinimumDescription);
      }
      if (item.questionLikertMaximumDescription) {
        questionElement.attr('maximum-description', item.questionLikertMaximumDescription);
      }
      if (item.questionLikertSingleImageSrc) {
        questionElement.attr('single-img-src', item.questionLikertSingleImageSrc);
      }
      if (item.questionLikertLeftImageSrc) {
        questionElement.attr('left-img-src', item.questionLikertLeftImageSrc);
      }
      if (item.questionLikertRightImageSrc) {
        questionElement.attr('right-img-src', item.questionLikertRightImageSrc);
      }
      if (item.questionStoragePath) {
        questionElement.attr('controller-data-path', item.questionStoragePath);
      }
      if (item.questionIsAssociatedToMedia) {
        questionElement.attr('associated-to-media', item.questionIsAssociatedToMedia);
      }
      return questionElement;
    };
    var buildRadioQuestion = function (item) {
      var questionElement = angular.element('<radio-question></radio-question>');
      if (item.questionId) {
        questionElement.attr('question-id', item.questionId);
      }
      if (item.questionLabel) {
        questionElement.attr('question-label', item.questionLabel);
      }
      if (item.questionStoragePath) {
        questionElement.attr('controller-data-path', item.questionStoragePath);
      }
      if (item.questionIsAssociatedToMedia) {
        questionElement.attr('associated-to-media', item.questionIsAssociatedToMedia);
      }
      if (item.questionRadioOptions) {
        questionElement.data('radioOptions', item.questionRadioOptions);
      }
      return questionElement;
    };
    var buildDropdownQuestion = function (item) {
      var questionElement = angular.element('<dropdown-question></dropdown-question>');
      if (item.questionId) {
        questionElement.attr('question-id', item.questionId);
      }
      if (item.questionLabel) {
        questionElement.attr('question-label', item.questionLabel);
      }
      if (item.questionIsAssociatedToMedia) {
        questionElement.attr('associated-to-media', item.questionIsAssociatedToMedia);
      }
      if (item.questionStoragePath) {
        questionElement.attr('controller-data-path', item.questionStoragePath);
      }
      if (item.questionDropdownOptions) {
        questionElement.data('dropdownOptions', item.questionDropdownOptions);
      }
      return questionElement;
    };
    var buildCheckboxQuestion = function (item) {
      var questionElement = angular.element('<checkbox-question></checkbox-question>');
      if (item.questionId) {
        questionElement.attr('question-id', item.questionId);
      }
      if (item.questionLabel) {
        questionElement.attr('question-label', item.questionLabel);
      }
      if (item.questionIsAssociatedToMedia) {
        questionElement.attr('associated-to-media', item.questionIsAssociatedToMedia);
      }
      if (item.questionStoragePath) {
        questionElement.attr('controller-data-path', item.questionStoragePath);
      }
      if (item.questionCheckboxOptions) {
        questionElement.data('checkboxOptions', item.questionCheckboxOptions);
      }
      return questionElement;
    };
    return {
      restrict: 'E',
      scope: {
        questionnaireData: '=',
        questionnaireForm: '='
      },
      link: function (scope, element, attrs) {
        var data = scope.questionnaireData;
        // Create an element for the title
        var title = angular.element('<h1 translate>' + data.title + '</h1>');
        element.append(title);
        var formElement = angular.element('<form class="form" name="questionnaireForm" novalidate></form>');
        //('<form name="questionnaireForm" class="form" novalidate></form>');
        element.append(formElement);
        // Iterate over structure
        for (var i = 0; i < data.structure.length; i++) {
          // Create an element for each structure entry
          var questionElement;
          var item = data.structure[i];
          switch (item.questionType) {
          case 'likert':
            questionElement = buildScaleQuestion(item);
            break;
          case 'radio':
            questionElement = buildRadioQuestion(item);
            break;
          case 'dropdown':
            questionElement = buildDropdownQuestion(item);
            break;
          case 'checkbox':
            questionElement = buildCheckboxQuestion(item);
            break;
          }
          // Append a spacer row
          var spacerElement = angular.element('<div class="row"><div class="col-md-12 questionSpacer"></div></div>');
          formElement.append(questionElement);
          formElement.append(spacerElement);
        }
        $compile(element.contents())(scope);
      }
    };
  }
]);'use strict';
angular.module('core').directive('radioQuestion', [
  '$compile',
  'TrialData',
  function ($compile, TrialData) {
    return {
      restrict: 'E',
      scope: {},
      link: function (scope, element, attrs) {
        scope.sendToTrialData = function (path, value) {
          if (!attrs.associatedToMedia) {
            TrialData.setValueForPath(path, value);
          } else {
            TrialData.setValueForPathForCurrentMedia(path, value);
          }
        };
        scope[attrs.questionId + 'RadioGroup'] = null;
        scope.$watch(attrs.questionId + 'RadioGroup', function (newValue) {
          // Convert 'true' to true literals and similar for 'false'
          if (newValue === 'true') {
            newValue = true;
          } else if (newValue === 'false') {
            newValue = false;
          }
          scope.sendToTrialData(attrs.controllerDataPath, newValue);
        });
        var questionText = '<div class="row"><div class="col-md-12"><label for="' + attrs.questionId + 'Radio" translate>' + attrs.questionLabel + '</label><div>';
        var innerQuestionText = '';
        if (element.data('radioOptions')) {
          // Iterate over radio options
          for (var i = 0; i < element.data('radioOptions').length; i++) {
            var thisOption = element.data('radioOptions')[i];
            innerQuestionText += '<label class="radio-inline"><input type="radio" name="' + attrs.questionId + 'RadioGroup" id="' + attrs.questionId + 'Radio' + thisOption.label + '" value="' + thisOption.value + '" ng-model="' + attrs.questionId + 'RadioGroup" required="true">{{\'' + thisOption.label + '\' | translate}}</input></label>';
          }
        }
        questionText += innerQuestionText + '</div></div></div>';
        var questionElement = angular.element(questionText);
        element.append(questionElement);
        $compile(element.contents())(scope);
      }
    };
  }
]);'use strict';
angular.module('core').directive('scaleQuestion', [
  '$compile',
  'TrialData',
  function ($compile, TrialData) {
    return {
      restrict: 'E',
      scope: {},
      link: function (scope, element, attrs) {
        scope.sendToTrialData = function (path, value) {
          if (!attrs.associatedToMedia) {
            TrialData.setValueForPath(path, value);
          } else {
            TrialData.setValueForPathForCurrentMedia(path, value);
          }
        };
        scope[attrs.questionId + 'RadioGroup'] = null;
        scope.$watch(attrs.questionId + 'RadioGroup', function (newValue) {
          scope.sendToTrialData(attrs.controllerDataPath, parseInt(newValue));
        });
        var questionHeader;
        if (attrs.labelType === 'labelLeft') {
          questionHeader = angular.element('<div class="row"><div class="col-md-12"><label translate>' + attrs.questionLabel + '</label></div></div>');
        } else {
          questionHeader = angular.element('<div class="row"><div class="col-md-12 text-center"><h3 translate>' + attrs.questionLabel + '</h3></div></div>');
        }
        var image;
        if (attrs.singleImgSrc) {
          image = angular.element('<div class="row"><div class="col-md-2"></div><div class="col-md-8 text-center"><img src="' + attrs.singleImgSrc + '"></div><div class="col-md-2"></div></div>');
        } else if (attrs.leftImgSrc && attrs.rightImgSrc) {
          image = angular.element('<div class="row"><div class="col-md-2"></div><div class="col-md-2"><img src="' + attrs.leftImgSrc + '"></div><div class="col-md-4"></div><div class="col-md-2"><img src="' + attrs.rightImgSrc + '"></div><div class="col-md-2"></div></div>');
        }
        var innerRadioHTML = '';
        for (var i = 1; i <= 5; i++) {
          innerRadioHTML += '<div class="col-md-5ths"><input type="radio" name="' + attrs.questionId + 'RadioGroup" id="' + attrs.questionId + 'RadioGroup' + i + '" value="' + i + '" required ng-model="' + attrs.questionId + 'RadioGroup"></div>';
        }
        var radios = angular.element('<div class="row">\n    <div class="col-md-2"></div>\n    <div class="col-md-8 text-center">\n        ' + innerRadioHTML + '<div class="row">\n        </div>\n    </div>\n    <div class="col-md-2"></div>\n</div>');
        var descriptions;
        if (attrs.minimumDescription && attrs.maximumDescription) {
          descriptions = angular.element('<div class="row"><div class="col-md-2"></div><div class="col-md-2 small text-left" translate>' + attrs.minimumDescription + '</div><div class="col-md-4"></div><div class="col-md-2 small text-right" translate>' + attrs.maximumDescription + '</div><div class="col-md-2"></div></div></div>');
        }
        element.append(questionHeader);
        element.append(image);
        element.append(radios);
        if (descriptions) {
          element.append(descriptions);
        }
        $compile(element.contents())(scope);
      }
    };
  }
]);'use strict';
angular.module('core').directive('sliderScale', [
  '$compile',
  'TrialData',
  function ($compile, TrialData) {
    return {
      replace: false,
      restrict: 'E',
      scope: {},
      link: function (scope, element, attrs) {
        //noinspection RedundantIfStatementJS
        if (attrs.associatedToMedia && attrs.associatedToMedia.toLowerCase() === 'true') {
          scope.associated = true;
        } else {
          scope.associated = false;
        }
        scope.sendToTrialData = function (path, value) {
          if (scope.associated) {
            TrialData.setValueForPathForCurrentMedia(path, value);
          } else {
            TrialData.setValueForPath(path, value);
          }
        };
        var sliderElement;
        switch (attrs.imageType) {
        case 'extremes':
          sliderElement = angular.element('<div class="row"><div class="col-md-2 text-center slider-image"></div><div class="col-md-2 slider-image text-center"><img src="' + attrs.leftImageSrc + '" /></div><!----><div class="col-md-4 slider-image"></div><!----><div class="col-md-2 slider-image text-center"><img src="' + attrs.rightImageSrc + '" /></div><!----><div class="col-md-2 text-center slider-image"></div><div class="clearBoth"></div><div class="col-md-2 text-center slider-image"></div><!----><div class="col-md-8 slider-image"><slider ng-change="sendToTrialData(\'' + attrs.controllerDataPath + '\', sliderModel)" ng-model="sliderModel" floor="' + attrs.sliderFloor + '" ceiling="' + attrs.sliderCeiling + '" step="' + attrs.sliderStep + '" stretch="' + attrs.sliderStretch + '" ng-init="sliderModel=' + attrs.sliderInitialValue + '"></slider></div><!----><div class="col-md-2 text-center slider-image"></div></div>');
          break;
        case 'single':
          sliderElement = angular.element('<div class="row"><div class="col-md-12 slider-image text-center"><img src="' + attrs.singleImageSrc + '" /></div><div class="col-md-2 text-center slider-image"></div><!----><div class="col-md-8 slider-image"><slider ng-change="sendToTrialData(\'' + attrs.controllerDataPath + '\', sliderModel)" ng-model="sliderModel" floor="' + attrs.sliderFloor + '" ceiling="' + attrs.sliderCeiling + '" step="' + attrs.sliderStep + '" stretch="' + attrs.sliderStretch + '" ng-init="sliderModel=' + attrs.sliderInitialValue + '"></slider></div><!----><div class="col-md-2 text-center slider-image"></div></div>');
          break;
        default:
          sliderElement = angular.element('<div class="row"><div class="col-md-2 text-center slider-image"></div><!----><div class="col-md-8 slider-image"><slider ng-change="sendToTrialData(\'' + attrs.controllerDataPath + '\', sliderModel)" ng-model="sliderModel" floor="' + attrs.sliderFloor + '" ceiling="' + attrs.sliderCeiling + '" step="' + attrs.sliderStep + '" stretch="' + attrs.sliderStretch + '" ng-init="sliderModel=' + attrs.sliderInitialValue + '"></slider></div><!----><div class="col-md-2 text-center slider-image"></div></div>');
          break;
        }
        $compile(sliderElement)(scope);
        element.after(sliderElement);
        // Send initial values to TrialData
        scope.sendToTrialData(attrs.controllerDataPath, attrs.sliderInitialValue);
      }
    };
  }
]);'use strict';
// Trial Data service used to persist data for individual trials
angular.module('core').factory('ExperimentManager', [
  'TrialData',
  '$q',
  '$http',
  '$state',
  function (TrialData, $q, $http, $state) {
    var experimentManager = {
        advanceSlide: function () {
          TrialData.data.state.currentSlideIndex++;
          if (TrialData.data.state.currentSlideIndex === TrialData.data.schema.length) {
            $state.go('home', {}, { reload: true });
          } else {
            $state.go(TrialData.data.schema[TrialData.data.state.currentSlideIndex].name, {}, { reload: true });
          }
        },
        masterReset: function () {
          var deferred = $q.defer();
          // Reset TrialData
          TrialData.reset();
          // Generate new session identifier and store it in TrialData
          /* global UUID */
          var sessionID = UUID.generate();
          TrialData.data.metadata.session_number = sessionID;
          // Get a new experiment setup from the backend
          $http.get('/api/experiment-schemas/random').success(function (data) {
            // Assign the media property from the ExperimentSchema we received as the media property on the TrialData
            TrialData.data.media = data.media;
            TrialData.data.schema = data.structure;
            deferred.resolve();
          }).error(function () {
            deferred.reject('An experiment schema could not be fetched from the server');
          });
          return deferred.promise;
        }
      };
    return experimentManager;
  }
]);'use strict';
// Service to wrap Socket.IO
angular.module('core').factory('SocketIOService', [
  'socketFactory',
  function (socketFactory) {
    return socketFactory();
  }
]);'use strict';
// TODO: Push results to database
// TODO: Remove most engaged and most enjoyed
// Trial Data service used to persist data for individual trials
angular.module('core').factory('TrialData', [function () {
    function BlankDataObject() {
      return {
        answers: {
          musical_expertise: null,
          musical_background: null,
          most_engaged: null,
          hearing_impairments: null,
          visual_impairments: null,
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
        },
        state: {
          currentSlideIndex: -1,
          mediaPlayCount: 0
        }
      };
    }
    var trialData = {
        data: null,
        toJson: function () {
          return angular.toJson(this.data, true);
        },
        reset: function () {
          this.data = new BlankDataObject();
        },
        setValueForPath: function (path, value, options) {
          if (value === 'true') {
            value = true;
          } else if (value === 'false') {
            value = false;
          }
          var numericRegex = /\d+\.?\d?/;
          if (typeof value === 'string' && value.match(numericRegex)) {
            value = parseFloat(value);
          }
          // Downcase simple strings
          if (typeof value === 'string') {
            value = value.toLowerCase();
          }
          if (path && value !== undefined) {
            var schema = this;
            // a moving reference to internal objects within this (this TrialData)
            var pList = path.split('.');
            var len = pList.length;
            for (var i = 0; i < len - 1; i++) {
              var elem = pList[i];
              if (!schema[elem])
                schema[elem] = {};
              schema = schema[elem];
            }
            if (options && options.hasOwnProperty('array_index') && typeof options.array_index === 'number') {
              if (schema[pList[len - 1]] === undefined) {
                schema[pList[len - 1]] = [];
              }
              schema[pList[len - 1]][options.array_index] = value;
            } else {
              schema[pList[len - 1]] = value;
            }
          }
        },
        setValueForPathForCurrentMedia: function (path, value) {
          var index;
          // If no media have played (we're likely debugging)
          if (this.data.state.mediaPlayCount <= 0) {
            index = 0;
          } else {
            index = this.data.state.mediaPlayCount - 1;
          }
          this.setValueForPath(path, value, { array_index: index });
        }
      };
    trialData.data = new BlankDataObject();
    return trialData;
  }]);
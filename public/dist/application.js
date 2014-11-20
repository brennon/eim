'use strict';
var ApplicationConfiguration = function () {
    var applicationModuleName = 'emotion-in-motion', applicationModuleVendorDependencies = [
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
      ], registerModule = function (moduleName) {
        angular.module(moduleName, []), angular.module(applicationModuleName).requires.push(moduleName);
      };
    return {
      applicationModuleName: applicationModuleName,
      applicationModuleVendorDependencies: applicationModuleVendorDependencies,
      registerModule: registerModule
    };
  }();
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies), angular.module(ApplicationConfiguration.applicationModuleName).config([
  '$locationProvider',
  function ($locationProvider) {
    $locationProvider.hashPrefix('!');
  }
]), angular.module(ApplicationConfiguration.applicationModuleName).run([
  'gettextCatalog',
  function (gettextCatalog) {
    gettextCatalog.setCurrentLanguage('es'), gettextCatalog.debug = !0;
  }
]), angular.element(document).ready(function () {
  '#_=_' === window.location.hash && (window.location.hash = '#!'), angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
}), ApplicationConfiguration.registerModule('angular-hotkeys'), ApplicationConfiguration.registerModule('core'), function () {
  angular.module('cfp.hotkeys', []).provider('hotkeys', function () {
    this.includeCheatSheet = !0, this.templateTitle = 'Keyboard Shortcuts:', this.template = '<div class="cfp-hotkeys-container fade" ng-class="{in: helpVisible}" style="display: none;"><div class="cfp-hotkeys"><h4 class="cfp-hotkeys-title">{{ title }}</h4><table><tbody><tr ng-repeat="hotkey in hotkeys | filter:{ description: \'!$$undefined$$\' }"><td class="cfp-hotkeys-keys"><span ng-repeat="key in hotkey.format() track by $index" class="cfp-hotkeys-key">{{ key }}</span></td><td class="cfp-hotkeys-text">{{ hotkey.description }}</td></tr></tbody></table><div class="cfp-hotkeys-close" ng-click="toggleCheatSheet()">\xd7</div></div></div>', this.cheatSheetHotkey = '?', this.cheatSheetDescription = 'Show / hide this help menu', this.$get = [
      '$rootElement',
      '$rootScope',
      '$compile',
      '$window',
      '$document',
      function ($rootElement, $rootScope, $compile, $window, $document) {
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
          for (var i = 0; i < combo.length; i++)
            'mod' === combo[i] && (combo[i] = $window.navigator && $window.navigator.platform.indexOf('Mac') >= 0 ? 'command' : 'ctrl'), combo[i] = map[combo[i]] || combo[i];
          return combo.join(' + ');
        }
        function Hotkey(combo, description, callback, action, allowIn, persistent) {
          this.combo = combo instanceof Array ? combo : [combo], this.description = description, this.callback = callback, this.action = action, this.allowIn = allowIn, this.persistent = persistent;
        }
        function purgeHotkeys() {
          for (var i = scope.hotkeys.length; i--;) {
            var hotkey = scope.hotkeys[i];
            hotkey && !hotkey.persistent && _del(hotkey);
          }
        }
        function toggleCheatSheet() {
          scope.helpVisible = !scope.helpVisible, scope.helpVisible ? (previousEsc = _get('esc'), _del('esc'), _add('esc', previousEsc.description, toggleCheatSheet)) : (_del('esc'), previousEsc !== !1 && _add(previousEsc));
        }
        function _add(combo, description, callback, action, allowIn, persistent) {
          var _callback, preventIn = [
              'INPUT',
              'SELECT',
              'TEXTAREA'
            ], objType = Object.prototype.toString.call(combo);
          if ('[object Object]' === objType && (description = combo.description, callback = combo.callback, action = combo.action, persistent = combo.persistent, allowIn = combo.allowIn, combo = combo.combo), description instanceof Function ? (action = callback, callback = description, description = '$$undefined$$') : angular.isUndefined(description) && (description = '$$undefined$$'), void 0 === persistent && (persistent = !0), 'function' == typeof callback) {
            _callback = callback, allowIn instanceof Array || (allowIn = []);
            for (var index, i = 0; i < allowIn.length; i++)
              allowIn[i] = allowIn[i].toUpperCase(), index = preventIn.indexOf(allowIn[i]), -1 !== index && preventIn.splice(index, 1);
            callback = function (event) {
              var shouldExecute = !0, target = event.target || event.srcElement, nodeName = target.nodeName.toUpperCase();
              if ((' ' + target.className + ' ').indexOf(' mousetrap ') > -1)
                shouldExecute = !0;
              else
                for (var i = 0; i < preventIn.length; i++)
                  if (preventIn[i] === nodeName) {
                    shouldExecute = !1;
                    break;
                  }
              shouldExecute && wrapApply(_callback.apply(this, arguments));
            };
          }
          'string' == typeof action ? Mousetrap.bind(combo, wrapApply(callback), action) : Mousetrap.bind(combo, wrapApply(callback));
          var hotkey = new Hotkey(combo, description, callback, action, allowIn, persistent);
          return scope.hotkeys.push(hotkey), hotkey;
        }
        function _del(hotkey) {
          var combo = hotkey instanceof Hotkey ? hotkey.combo : hotkey;
          if (Mousetrap.unbind(combo), combo instanceof Array) {
            for (var retStatus = !0, i = 0; i < combo.length; i++)
              retStatus = _del(combo[i]) && retStatus;
            return retStatus;
          }
          var index = scope.hotkeys.indexOf(_get(combo));
          return index > -1 ? (scope.hotkeys[index].combo.length > 1 ? scope.hotkeys[index].combo.splice(scope.hotkeys[index].combo.indexOf(combo), 1) : scope.hotkeys.splice(index, 1), !0) : !1;
        }
        function _get(combo) {
          for (var hotkey, i = 0; i < scope.hotkeys.length; i++)
            if (hotkey = scope.hotkeys[i], hotkey.combo.indexOf(combo) > -1)
              return hotkey;
          return !1;
        }
        function bindTo(scope) {
          return boundScopes[scope.$id] = [], scope.$on('$destroy', function () {
            for (var i = boundScopes[scope.$id].length; i--;)
              _del(boundScopes[scope.$id][i]), delete boundScopes[scope.$id][i];
          }), {
            add: function (args) {
              var hotkey;
              return hotkey = arguments.length > 1 ? _add.apply(this, arguments) : _add(args), boundScopes[scope.$id].push(hotkey), this;
            }
          };
        }
        function wrapApply(callback) {
          return function (event, combo) {
            if (callback instanceof Array) {
              var funcString = callback[0], route = callback[1];
              callback = function () {
                route.scope.$eval(funcString);
              };
            }
            $rootScope.$apply(function () {
              callback(event, _get(combo));
            });
          };
        }
        Mousetrap.stopCallback = function (event, element) {
          return (' ' + element.className + ' ').indexOf(' mousetrap ') > -1 ? !1 : element.contentEditable && 'true' == element.contentEditable;
        }, Hotkey.prototype.format = function () {
          for (var combo = this.combo[0], sequence = combo.split(/[\s]/), i = 0; i < sequence.length; i++)
            sequence[i] = symbolize(sequence[i]);
          return sequence;
        };
        var scope = $rootScope.$new();
        scope.hotkeys = [], scope.helpVisible = !1, scope.title = this.templateTitle, scope.toggleCheatSheet = toggleCheatSheet;
        var boundScopes = [];
        if ($rootScope.$on('$routeChangeSuccess', function (event, route) {
            purgeHotkeys(), route && route.hotkeys && angular.forEach(route.hotkeys, function (hotkey) {
              var callback = hotkey[2];
              ('string' == typeof callback || callback instanceof String) && (hotkey[2] = [
                callback,
                route
              ]), hotkey[5] = !1, _add.apply(this, hotkey);
            });
          }), this.includeCheatSheet) {
          var document = $document[0], element = $rootElement[0], helpMenu = angular.element(this.template);
          _add(this.cheatSheetHotkey, this.cheatSheetDescription, toggleCheatSheet), (element === document || element === document.documentElement) && (element = document.body), angular.element(element).append($compile(helpMenu)(scope));
        }
        var previousEsc = !1, publicApi = {
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
            allowIn = 'string' == typeof attrs.hotkeyAllowIn ? attrs.hotkeyAllowIn.split(/[\s,]+/) : [], key = hotkey, hotkeys.add({
              combo: hotkey,
              description: attrs.hotkeyDescription,
              callback: func,
              action: attrs.hotkeyAction,
              allowIn: allowIn
            });
          }), el.bind('$destroy', function () {
            hotkeys.del(key);
          });
        }
      };
    }
  ]).run([
    'hotkeys',
    function () {
    }
  ]);
}(), function (window, document) {
  function _addEvent(object, type, callback) {
    return object.addEventListener ? void object.addEventListener(type, callback, !1) : void object.attachEvent('on' + type, callback);
  }
  function _characterFromEvent(e) {
    if ('keypress' == e.type) {
      var character = String.fromCharCode(e.which);
      return e.shiftKey || (character = character.toLowerCase()), character;
    }
    return _MAP[e.which] ? _MAP[e.which] : _KEYCODE_MAP[e.which] ? _KEYCODE_MAP[e.which] : String.fromCharCode(e.which).toLowerCase();
  }
  function _modifiersMatch(modifiers1, modifiers2) {
    return modifiers1.sort().join(',') === modifiers2.sort().join(',');
  }
  function _resetSequences(doNotReset) {
    doNotReset = doNotReset || {};
    var key, activeSequences = !1;
    for (key in _sequenceLevels)
      doNotReset[key] ? activeSequences = !0 : _sequenceLevels[key] = 0;
    activeSequences || (_nextExpectedAction = !1);
  }
  function _getMatches(character, modifiers, e, sequenceName, combination, level) {
    var i, callback, matches = [], action = e.type;
    if (!_callbacks[character])
      return [];
    for ('keyup' == action && _isModifier(character) && (modifiers = [character]), i = 0; i < _callbacks[character].length; ++i)
      if (callback = _callbacks[character][i], (sequenceName || !callback.seq || _sequenceLevels[callback.seq] == callback.level) && action == callback.action && ('keypress' == action && !e.metaKey && !e.ctrlKey || _modifiersMatch(modifiers, callback.modifiers))) {
        var deleteCombo = !sequenceName && callback.combo == combination, deleteSequence = sequenceName && callback.seq == sequenceName && callback.level == level;
        (deleteCombo || deleteSequence) && _callbacks[character].splice(i, 1), matches.push(callback);
      }
    return matches;
  }
  function _eventModifiers(e) {
    var modifiers = [];
    return e.shiftKey && modifiers.push('shift'), e.altKey && modifiers.push('alt'), e.ctrlKey && modifiers.push('ctrl'), e.metaKey && modifiers.push('meta'), modifiers;
  }
  function _preventDefault(e) {
    return e.preventDefault ? void e.preventDefault() : void (e.returnValue = !1);
  }
  function _stopPropagation(e) {
    return e.stopPropagation ? void e.stopPropagation() : void (e.cancelBubble = !0);
  }
  function _fireCallback(callback, e, combo, sequence) {
    Mousetrap.stopCallback(e, e.target || e.srcElement, combo, sequence) || callback(e, combo) === !1 && (_preventDefault(e), _stopPropagation(e));
  }
  function _handleKey(character, modifiers, e) {
    var i, callbacks = _getMatches(character, modifiers, e), doNotReset = {}, maxLevel = 0, processedSequenceCallback = !1;
    for (i = 0; i < callbacks.length; ++i)
      callbacks[i].seq && (maxLevel = Math.max(maxLevel, callbacks[i].level));
    for (i = 0; i < callbacks.length; ++i)
      if (callbacks[i].seq) {
        if (callbacks[i].level != maxLevel)
          continue;
        processedSequenceCallback = !0, doNotReset[callbacks[i].seq] = 1, _fireCallback(callbacks[i].callback, e, callbacks[i].combo, callbacks[i].seq);
      } else
        processedSequenceCallback || _fireCallback(callbacks[i].callback, e, callbacks[i].combo);
    var ignoreThisKeypress = 'keypress' == e.type && _ignoreNextKeypress;
    e.type != _nextExpectedAction || _isModifier(character) || ignoreThisKeypress || _resetSequences(doNotReset), _ignoreNextKeypress = processedSequenceCallback && 'keydown' == e.type;
  }
  function _handleKeyEvent(e) {
    'number' != typeof e.which && (e.which = e.keyCode);
    var character = _characterFromEvent(e);
    return character ? 'keyup' == e.type && _ignoreNextKeyup === character ? void (_ignoreNextKeyup = !1) : void Mousetrap.handleKey(character, _eventModifiers(e), e) : void 0;
  }
  function _isModifier(key) {
    return 'shift' == key || 'ctrl' == key || 'alt' == key || 'meta' == key;
  }
  function _resetSequenceTimer() {
    clearTimeout(_resetTimer), _resetTimer = setTimeout(_resetSequences, 1000);
  }
  function _getReverseMap() {
    if (!_REVERSE_MAP) {
      _REVERSE_MAP = {};
      for (var key in _MAP)
        key > 95 && 112 > key || _MAP.hasOwnProperty(key) && (_REVERSE_MAP[_MAP[key]] = key);
    }
    return _REVERSE_MAP;
  }
  function _pickBestAction(key, modifiers, action) {
    return action || (action = _getReverseMap()[key] ? 'keydown' : 'keypress'), 'keypress' == action && modifiers.length && (action = 'keydown'), action;
  }
  function _bindSequence(combo, keys, callback, action) {
    function _increaseSequence(nextAction) {
      return function () {
        _nextExpectedAction = nextAction, ++_sequenceLevels[combo], _resetSequenceTimer();
      };
    }
    function _callbackAndReset(e) {
      _fireCallback(callback, e, combo), 'keyup' !== action && (_ignoreNextKeyup = _characterFromEvent(e)), setTimeout(_resetSequences, 10);
    }
    _sequenceLevels[combo] = 0;
    for (var i = 0; i < keys.length; ++i) {
      var isFinal = i + 1 === keys.length, wrappedCallback = isFinal ? _callbackAndReset : _increaseSequence(action || _getKeyInfo(keys[i + 1]).action);
      _bindSingle(keys[i], wrappedCallback, action, combo, i);
    }
  }
  function _keysFromString(combination) {
    return '+' === combination ? ['+'] : combination.split('+');
  }
  function _getKeyInfo(combination, action) {
    var keys, key, i, modifiers = [];
    for (keys = _keysFromString(combination), i = 0; i < keys.length; ++i)
      key = keys[i], _SPECIAL_ALIASES[key] && (key = _SPECIAL_ALIASES[key]), action && 'keypress' != action && _SHIFT_MAP[key] && (key = _SHIFT_MAP[key], modifiers.push('shift')), _isModifier(key) && modifiers.push(key);
    return action = _pickBestAction(key, modifiers, action), {
      key: key,
      modifiers: modifiers,
      action: action
    };
  }
  function _bindSingle(combination, callback, action, sequenceName, level) {
    _directMap[combination + ':' + action] = callback, combination = combination.replace(/\s+/g, ' ');
    var info, sequence = combination.split(' ');
    return sequence.length > 1 ? void _bindSequence(combination, sequence, callback, action) : (info = _getKeyInfo(combination, action), _callbacks[info.key] = _callbacks[info.key] || [], _getMatches(info.key, info.modifiers, { type: info.action }, sequenceName, combination, level), void _callbacks[info.key][sequenceName ? 'unshift' : 'push']({
      callback: callback,
      modifiers: info.modifiers,
      action: info.action,
      seq: sequenceName,
      level: level,
      combo: combination
    }));
  }
  function _bindMultiple(combinations, callback, action) {
    for (var i = 0; i < combinations.length; ++i)
      _bindSingle(combinations[i], callback, action);
  }
  for (var _REVERSE_MAP, _resetTimer, _MAP = {
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
      }, _KEYCODE_MAP = {
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
      }, _SHIFT_MAP = {
        '~': '`',
        '!': '1',
        '@': '2',
        '#': '3',
        $: '4',
        '%': '5',
        '^': '6',
        '&': '7',
        '*': '8',
        '(': '9',
        ')': '0',
        _: '-',
        '+': '=',
        ':': ';',
        '"': '\'',
        '<': ',',
        '>': '.',
        '?': '/',
        '|': '\\'
      }, _SPECIAL_ALIASES = {
        option: 'alt',
        command: 'meta',
        'return': 'enter',
        escape: 'esc',
        mod: /Mac|iPod|iPhone|iPad/.test(navigator.platform) ? 'meta' : 'ctrl'
      }, _callbacks = {}, _directMap = {}, _sequenceLevels = {}, _ignoreNextKeyup = !1, _ignoreNextKeypress = !1, _nextExpectedAction = !1, i = 1; 20 > i; ++i)
    _MAP[111 + i] = 'f' + i;
  for (i = 0; 9 >= i; ++i)
    _MAP[i + 96] = i;
  _addEvent(document, 'keypress', _handleKeyEvent), _addEvent(document, 'keydown', _handleKeyEvent), _addEvent(document, 'keyup', _handleKeyEvent);
  var Mousetrap = {
      bind: function (keys, callback, action) {
        return keys = keys instanceof Array ? keys : [keys], _bindMultiple(keys, callback, action), this;
      },
      unbind: function (keys, action) {
        return Mousetrap.bind(keys, function () {
        }, action);
      },
      trigger: function (keys, action) {
        return _directMap[keys + ':' + action] && _directMap[keys + ':' + action]({}, keys), this;
      },
      reset: function () {
        return _callbacks = {}, _directMap = {}, this;
      },
      stopCallback: function (e, element) {
        return (' ' + element.className + ' ').indexOf(' mousetrap ') > -1 ? !1 : 'INPUT' == element.tagName || 'SELECT' == element.tagName || 'TEXTAREA' == element.tagName || element.isContentEditable;
      },
      handleKey: _handleKey
    };
  window.Mousetrap = Mousetrap, 'function' == typeof define && define.amd && define(Mousetrap);
}(window, document), angular.module('core').controller([
  'gettext',
  function (gettext) {
    [
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
]), angular.module('core').config([
  '$stateProvider',
  '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/'), $stateProvider.state('home', {
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
]), angular.module('core').controller('DemographicsController', [
  '$scope',
  'TrialData',
  function ($scope, TrialData) {
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
    ], $scope.years = [];
    for (var thisYear = new Date().getFullYear(), i = thisYear; i >= thisYear - 110; i--)
      $scope.years.push(i);
    $scope.nationalityChanged = function (nationality) {
      TrialData.data.answers.nationality = nationality.toLowerCase();
    }, $scope.yearChanged = function (year) {
      TrialData.data.answers.dob = year;
    }, $scope.genderChanged = function (gender) {
      TrialData.data.answers.sex = gender;
    };
  }
]), angular.module('core').controller('HomeController', [
  'ExperimentManager',
  '$scope',
  function (ExperimentManager, $scope) {
    ExperimentManager.masterReset().then(function () {
      $scope.readyToAdvance = !0;
    }, function () {
      throw $scope.addGenericErrorAlert(), new Error('An experiment schema could not be fetched from the server');
    }), $scope.readyToAdvance = !1;
  }
]), angular.module('core').controller('MasterController', [
  '$scope',
  'TrialData',
  'hotkeys',
  'ExperimentManager',
  'gettextCatalog',
  function ($scope, TrialData, hotkeys, ExperimentManager, gettextCatalog) {
    $scope.trialDataJson = function () {
      return TrialData.toJson();
    }, $scope.setLanguage = function (language) {
      gettextCatalog.setCurrentLanguage(language);
    }, $scope.advanceSlide = ExperimentManager.advanceSlide, $scope.debugMode = !1, $scope.toggleDebugMode = function () {
      $scope.debugMode = !$scope.debugMode;
      var alertMessage = 'Debug mode has been ';
      alertMessage += $scope.debugMode ? 'enabled.' : 'disabled.', $scope.addAlert({
        type: 'info',
        msg: alertMessage
      });
    }, hotkeys.add({
      combo: 'd d',
      description: 'Toggle debug mode',
      callback: $scope.toggleDebugMode
    }), hotkeys.add({
      combo: 'right',
      description: 'Advance slide',
      callback: $scope.advanceSlide
    }), $scope.alerts = [], $scope.addAlert = function (alert) {
      for (var errorExists = !1, i = 0; i < $scope.alerts.length; i++)
        if ($scope.alerts[i].msg === alert.msg && $scope.alerts[i].type === alert.type) {
          errorExists = !0;
          break;
        }
      errorExists || $scope.alerts.push(alert);
    }, $scope.closeAlert = function (index) {
      $scope.alerts.splice(index, 1);
    }, $scope.addGenericErrorAlert = function () {
      $scope.addAlert({
        type: 'danger',
        msg: 'There seems to be a problem. Please contact a mediator for assistance.'
      });
    }, $scope.blackoutClass = !1, $scope.hideBody = function () {
      $scope.blackoutClass = !0;
    }, $scope.showBody = function () {
      $scope.blackoutClass = !1;
    }, $scope.toggleBodyVisibility = function () {
      $scope.blackoutClass = !$scope.blackoutClass;
    };
  }
]), angular.module('core').controller('MediaPlaybackController', [
  '$scope',
  'TrialData',
  'SocketIOService',
  '$timeout',
  'ExperimentManager',
  function ($scope, TrialData, SocketIOService, $timeout, ExperimentManager) {
    var thisController = this;
    $scope.currentButtonLabel = 'Begin Playback', $scope.mediaHasPlayed = !1, $scope.buttonDisabled = !1, $scope.startMediaPlayback = function () {
      var mediaIndex = TrialData.data.state.mediaPlayCount, mediaLabel = TrialData.data.media[mediaIndex].label;
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
      }), $scope.buttonAction = ExperimentManager.advanceSlide;
    }, $scope.buttonAction = $scope.startMediaPlayback, this.requestEmotionIndex = function () {
      SocketIOService.emit('sendOSCMessage', {
        oscType: 'message',
        address: '/eim/control/emotionIndex',
        args: [{
            type: 'string',
            value: '' + TrialData.data.metadata.session_number
          }]
      });
    }, this.oscMessageReceivedListener = function (data) {
      if ('/eim/status/playback' === data.address)
        1 === parseInt(data.args[0].value) ? $scope.hideBody() : 0 === parseInt(data.args[0].value) && (thisController.requestEmotionIndex(), $scope.showBody(), $timeout(function () {
          $scope.$apply(function () {
            $scope.currentButtonLabel = 'Continue', $scope.mediaHasPlayed = !0, $scope.buttonDisabled = !0;
          });
        }));
      else if ('/eim/status/emotionIndex' === data.address) {
        var emotionIndex = parseInt(data.args[0].value);
        TrialData.data.answers.emotion_indices[TrialData.data.state.mediaPlayCount] = emotionIndex, TrialData.data.state.mediaPlayCount++, $timeout(function () {
          $scope.$apply(function () {
            $scope.buttonDisabled = !1;
          });
        });
      }
    }, SocketIOService.on('oscMessageReceived', this.oscMessageReceivedListener), $scope.$on('$destroy', function () {
      SocketIOService.emit('sendOSCMessage', {
        oscType: 'message',
        address: '/eim/control/stopMedia',
        args: {
          type: 'string',
          value: '' + TrialData.data.metadata.session_number
        }
      }), SocketIOService.removeListener('oscMessageReceived', thisController.oscMessageReceivedListener), $scope.showBody();
    });
  }
]), angular.module('core').controller('MusicalBackgroundController', [
  '$scope',
  'TrialData',
  'ExperimentManager',
  function ($scope, TrialData, ExperimentManager) {
    $scope.advanceSlide = ExperimentManager.advanceSlide, $scope.trialData = TrialData, $scope.musicianChanged = function (isMusician) {
      TrialData.data.answers.musical_background = 'true' === isMusician.toLowerCase() ? !0 : !1;
    }, $scope.hearingImpairmentsChanged = function (hasHearingImpairments) {
      TrialData.data.answers.hearing_impairments = 'true' === hasHearingImpairments.toLowerCase() ? !0 : !1;
    }, $scope.visualImpairmentsChanged = function (hasVisualImpairments) {
      TrialData.data.answers.visual_impairments = 'true' === hasVisualImpairments.toLowerCase() ? !0 : !1;
    }, $scope.$watch('musicalExpertise', function (musicalExpertise) {
      TrialData.data.answers.musical_expertise = musicalExpertise;
    }), $scope.stylesChanged = function () {
      var newStyles = [];
      for (var prop in $scope.subject.styles) {
        var style = prop.toString();
        $scope.subject.styles[style] && newStyles.push(style);
      }
      TrialData.data.answers.music_styles = newStyles.sort();
    }, $scope.trialDataJson = function () {
      return TrialData.toJson();
    };
  }
]), angular.module('core').controller('QuestionnaireController', [
  '$scope',
  'TrialData',
  function ($scope, TrialData) {
    $scope.questionnaireData = TrialData.data.schema[TrialData.data.state.currentSlideIndex].data;
  }
]), angular.module('core').controller('SignalTestController', [
  '$scope',
  'SocketIOService',
  'TrialData',
  function ($scope, SocketIOService, TrialData) {
    $scope.edaQuality = 0, $scope.poxQuality = 0, $scope.testRecordingComplete = !1, $scope.readyToAdvance = function () {
      return $scope.debugMode ? !0 : $scope.allSignalsGood();
    }, $scope.allSignalsGood = function () {
      return $scope.edaQuality && $scope.poxQuality;
    }, this.sendStartSignalTestMessage = function () {
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
    }, this.sendStopSignalTestMessage = function () {
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
    }, this.oscMessageReceivedListener = function (data) {
      '/eim/status/signalQuality/eda' === data.address ? $scope.$apply(function () {
        $scope.edaQuality = data.args[0].value;
      }) : '/eim/status/signalQuality/pox' === data.address ? $scope.$apply(function () {
        $scope.poxQuality = data.args[0].value;
      }) : '/eim/status/testRecordingComplete' === data.address && ($scope.$apply(function () {
        $scope.testRecordingComplete = !0;
      }), this.sendStopSignalTestMessage());
    }, SocketIOService.on('oscMessageReceived', this.oscMessageReceivedListener);
    var controller = this;
    $scope.$on('$destroy', function () {
      SocketIOService.removeListener('oscMessageReceived', controller.oscMessageReceivedListener), controller.sendStopSignalTestMessage();
    }), this.sendStartSignalTestMessage();
  }
]), angular.module('core').controller('SoundTestController', [
  '$scope',
  'SocketIOService',
  'TrialData',
  function ($scope, SocketIOService, TrialData) {
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
    }), $scope.stopSoundTest = function () {
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
    }, $scope.destroyed = !1, $scope.$on('$destroy', function () {
      $scope.stopSoundTest();
    });
  }
]), angular.module('core').controller('StartController', [
  '$scope',
  '$timeout',
  'TrialData',
  'ExperimentManager',
  'SocketIOService',
  function ($scope, $timeout, TrialData, ExperimentManager, SocketIOService) {
    $scope.readyToAdvance = function () {
      return $scope.maxReady || $scope.debugMode;
    }, this.oscMessageReceivedListener = function (data) {
      '/eim/status/startExperiment' === data.address && $scope.$apply(function () {
        $scope.maxReady = !0;
      });
    }, SocketIOService.on('oscMessageReceived', this.oscMessageReceivedListener);
    var thisController = this;
    $scope.$on('$destroy', function () {
      SocketIOService.removeListener('oscMessageReceived', thisController.oscMessageReceivedListener), $timeout.cancel(thisController.errorTimeout);
    }), this.sendExperimentStartMessage = function () {
      $scope.maxReady = !1, SocketIOService.emit('sendOSCMessage', {
        oscType: 'message',
        address: '/eim/control/startExperiment',
        args: {
          type: 'string',
          value: '' + TrialData.data.metadata.session_number
        }
      });
    }, this.sendExperimentStartMessage(), this.errorTimeout = $timeout(function () {
    }, 10000), this.errorTimeout.then(function () {
      if (!$scope.readyToAdvance)
        throw $scope.addGenericErrorAlert(), new Error('Max had not responded to startExperiment message after 10 seconds');
    });
  }
]), angular.module('core').directive('checkboxQuestion', [
  '$compile',
  'TrialData',
  function ($compile, TrialData) {
    return {
      restrict: 'E',
      scope: {},
      link: function (scope, element, attrs) {
        scope.someSelected = !1, scope.sendToTrialData = function (path, value) {
          attrs.associatedToMedia ? TrialData.setValueForPathForCurrentMedia(path, value) : TrialData.setValueForPath(path, value);
        }, scope.updateCheckboxes = function () {
          for (var newSomeSelectedValue = !1, checkedOptions = [], inputs = element.find('input'), i = 0; i < inputs.length; i++) {
            var input = angular.element(inputs[i]);
            input.attr('name') === attrs.questionId + 'Checkbox' && input.prop('checked') === !0 && (newSomeSelectedValue = !0, checkedOptions.push(input.attr('value').toLowerCase()));
          }
          scope.someSelected = newSomeSelectedValue, checkedOptions.sort(), scope.sendToTrialData(attrs.controllerDataPath, checkedOptions);
        };
        var questionText = '<div class="row"><div class="col-md-12"><label for="' + attrs.questionId + 'Checkbox" translate>' + attrs.questionLabel + '</label><div>', innerQuestionText = '';
        if (element.data('checkboxOptions'))
          for (var i = 0; i < element.data('checkboxOptions').length; i++) {
            var thisOption = element.data('checkboxOptions')[i];
            innerQuestionText += '<label class="checkbox-inline"><input type="checkbox" name="' + attrs.questionId + 'Checkbox" id="' + attrs.questionId + 'Checkbox' + thisOption + '" value="' + thisOption + '" ng-model="' + attrs.questionId + 'Checkbox' + thisOption + '" ng-change="updateCheckboxes()" ng-required="!someSelected">{{\'' + thisOption + '\' | translate}}</input></label>';
          }
        questionText += innerQuestionText + '</div></div></div>';
        var questionElement = angular.element(questionText);
        element.append(questionElement), $compile(element.contents())(scope);
      }
    };
  }
]), angular.module('core').directive('displayTrialData', function () {
  return {
    restrict: 'AE',
    template: '<div class="row"><div class="col-md-12"><h3>Trial Data</h3><pre>{{trialDataJson()}}</pre></div></div>'
  };
}), angular.module('core').directive('dropdownQuestion', [
  '$compile',
  'TrialData',
  function ($compile, TrialData) {
    return {
      restrict: 'E',
      scope: {},
      link: function (scope, element, attrs) {
        scope.sendToTrialData = function (path, value) {
          attrs.associatedToMedia ? TrialData.setValueForPathForCurrentMedia(path, value) : TrialData.setValueForPath(path, value);
        }, scope[attrs.questionId + 'Select'] = null, scope.$watch(attrs.questionId + 'Select', function (newValue) {
          scope.sendToTrialData(attrs.controllerDataPath, newValue);
        }), element.data('dropdownOptions') && (scope.dropdownOptions = element.data('dropdownOptions'));
        var selectElement = angular.element('<div class="row"><div class="col-md-12 form-group"><label for="' + attrs.questionId + '" class="control-label" translate>' + attrs.questionLabel + '</label><select id="' + attrs.questionId + '" name="' + attrs.questionId + '" class="form-control" ng-model="' + attrs.questionId + 'Select" required><option ng-repeat="option in dropdownOptions">{{option | translate}}</option> </select></div></div>');
        element.append(selectElement), $compile(element.contents())(scope);
      }
    };
  }
]), angular.module('core').directive('questionnaire', [
  '$compile',
  function ($compile) {
    var buildScaleQuestion = function (item) {
        var questionElement = angular.element('<scale-question></scale-question>');
        return item.questionId && questionElement.attr('question-id', item.questionId), item.questionLabel && questionElement.attr('question-label', item.questionLabel), item.questionLabelType && questionElement.attr('label-type', item.questionLabelType), item.questionLikertMinimumDescription && questionElement.attr('minimum-description', item.questionLikertMinimumDescription), item.questionLikertMaximumDescription && questionElement.attr('maximum-description', item.questionLikertMaximumDescription), item.questionLikertSingleImageSrc && questionElement.attr('single-img-src', item.questionLikertSingleImageSrc), item.questionLikertLeftImageSrc && questionElement.attr('left-img-src', item.questionLikertLeftImageSrc), item.questionLikertRightImageSrc && questionElement.attr('right-img-src', item.questionLikertRightImageSrc), item.questionStoragePath && questionElement.attr('controller-data-path', item.questionStoragePath), item.questionIsAssociatedToMedia && questionElement.attr('associated-to-media', item.questionIsAssociatedToMedia), questionElement;
      }, buildRadioQuestion = function (item) {
        var questionElement = angular.element('<radio-question></radio-question>');
        return item.questionId && questionElement.attr('question-id', item.questionId), item.questionLabel && questionElement.attr('question-label', item.questionLabel), item.questionStoragePath && questionElement.attr('controller-data-path', item.questionStoragePath), item.questionIsAssociatedToMedia && questionElement.attr('associated-to-media', item.questionIsAssociatedToMedia), item.questionRadioOptions && questionElement.data('radioOptions', item.questionRadioOptions), questionElement;
      }, buildDropdownQuestion = function (item) {
        var questionElement = angular.element('<dropdown-question></dropdown-question>');
        return item.questionId && questionElement.attr('question-id', item.questionId), item.questionLabel && questionElement.attr('question-label', item.questionLabel), item.questionIsAssociatedToMedia && questionElement.attr('associated-to-media', item.questionIsAssociatedToMedia), item.questionStoragePath && questionElement.attr('controller-data-path', item.questionStoragePath), item.questionDropdownOptions && questionElement.data('dropdownOptions', item.questionDropdownOptions), questionElement;
      }, buildCheckboxQuestion = function (item) {
        var questionElement = angular.element('<checkbox-question></checkbox-question>');
        return item.questionId && questionElement.attr('question-id', item.questionId), item.questionLabel && questionElement.attr('question-label', item.questionLabel), item.questionIsAssociatedToMedia && questionElement.attr('associated-to-media', item.questionIsAssociatedToMedia), item.questionStoragePath && questionElement.attr('controller-data-path', item.questionStoragePath), item.questionCheckboxOptions && questionElement.data('checkboxOptions', item.questionCheckboxOptions), questionElement;
      };
    return {
      restrict: 'E',
      scope: {
        questionnaireData: '=',
        questionnaireForm: '='
      },
      link: function (scope, element) {
        var data = scope.questionnaireData, title = angular.element('<h1 translate>' + data.title + '</h1>');
        element.append(title);
        var formElement = angular.element('<form class="form" name="questionnaireForm" novalidate></form>');
        element.append(formElement);
        for (var i = 0; i < data.structure.length; i++) {
          var questionElement, item = data.structure[i];
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
          }
          var spacerElement = angular.element('<div class="row"><div class="col-md-12 questionSpacer"></div></div>');
          formElement.append(questionElement), formElement.append(spacerElement);
        }
        $compile(element.contents())(scope);
      }
    };
  }
]), angular.module('core').directive('radioQuestion', [
  '$compile',
  'TrialData',
  function ($compile, TrialData) {
    return {
      restrict: 'E',
      scope: {},
      link: function (scope, element, attrs) {
        scope.sendToTrialData = function (path, value) {
          attrs.associatedToMedia ? TrialData.setValueForPathForCurrentMedia(path, value) : TrialData.setValueForPath(path, value);
        }, scope[attrs.questionId + 'RadioGroup'] = null, scope.$watch(attrs.questionId + 'RadioGroup', function (newValue) {
          'true' === newValue ? newValue = !0 : 'false' === newValue && (newValue = !1), scope.sendToTrialData(attrs.controllerDataPath, newValue);
        });
        var questionText = '<div class="row"><div class="col-md-12"><label for="' + attrs.questionId + 'Radio" translate>' + attrs.questionLabel + '</label><div>', innerQuestionText = '';
        if (element.data('radioOptions'))
          for (var i = 0; i < element.data('radioOptions').length; i++) {
            var thisOption = element.data('radioOptions')[i];
            innerQuestionText += '<label class="radio-inline"><input type="radio" name="' + attrs.questionId + 'RadioGroup" id="' + attrs.questionId + 'Radio' + thisOption.label + '" value="' + thisOption.value + '" ng-model="' + attrs.questionId + 'RadioGroup" required="true">{{\'' + thisOption.label + '\' | translate}}</input></label>';
          }
        questionText += innerQuestionText + '</div></div></div>';
        var questionElement = angular.element(questionText);
        element.append(questionElement), $compile(element.contents())(scope);
      }
    };
  }
]), angular.module('core').directive('scaleQuestion', [
  '$compile',
  'TrialData',
  function ($compile, TrialData) {
    return {
      restrict: 'E',
      scope: {},
      link: function (scope, element, attrs) {
        scope.sendToTrialData = function (path, value) {
          attrs.associatedToMedia ? TrialData.setValueForPathForCurrentMedia(path, value) : TrialData.setValueForPath(path, value);
        }, scope[attrs.questionId + 'RadioGroup'] = null, scope.$watch(attrs.questionId + 'RadioGroup', function (newValue) {
          scope.sendToTrialData(attrs.controllerDataPath, parseInt(newValue));
        });
        var questionHeader;
        questionHeader = angular.element('labelLeft' === attrs.labelType ? '<div class="row"><div class="col-md-12"><label translate>' + attrs.questionLabel + '</label></div></div>' : '<div class="row"><div class="col-md-12 text-center"><h3 translate>' + attrs.questionLabel + '</h3></div></div>');
        var image;
        attrs.singleImgSrc ? image = angular.element('<div class="row"><div class="col-md-2"></div><div class="col-md-8 text-center"><img src="' + attrs.singleImgSrc + '"></div><div class="col-md-2"></div></div>') : attrs.leftImgSrc && attrs.rightImgSrc && (image = angular.element('<div class="row"><div class="col-md-2"></div><div class="col-md-2"><img src="' + attrs.leftImgSrc + '"></div><div class="col-md-4"></div><div class="col-md-2"><img src="' + attrs.rightImgSrc + '"></div><div class="col-md-2"></div></div>'));
        for (var innerRadioHTML = '', i = 1; 5 >= i; i++)
          innerRadioHTML += '<div class="col-md-5ths"><input type="radio" name="' + attrs.questionId + 'RadioGroup" id="' + attrs.questionId + 'RadioGroup' + i + '" value="' + i + '" required ng-model="' + attrs.questionId + 'RadioGroup"></div>';
        var descriptions, radios = angular.element('<div class="row">\n    <div class="col-md-2"></div>\n    <div class="col-md-8 text-center">\n        ' + innerRadioHTML + '<div class="row">\n        </div>\n    </div>\n    <div class="col-md-2"></div>\n</div>');
        attrs.minimumDescription && attrs.maximumDescription && (descriptions = angular.element('<div class="row"><div class="col-md-2"></div><div class="col-md-2 small text-left" translate>' + attrs.minimumDescription + '</div><div class="col-md-4"></div><div class="col-md-2 small text-right" translate>' + attrs.maximumDescription + '</div><div class="col-md-2"></div></div></div>')), element.append(questionHeader), element.append(image), element.append(radios), descriptions && element.append(descriptions), $compile(element.contents())(scope);
      }
    };
  }
]), angular.module('core').directive('sliderScale', [
  '$compile',
  'TrialData',
  function ($compile, TrialData) {
    return {
      replace: !1,
      restrict: 'E',
      scope: {},
      link: function (scope, element, attrs) {
        scope.associated = attrs.associatedToMedia && 'true' === attrs.associatedToMedia.toLowerCase() ? !0 : !1, scope.sendToTrialData = function (path, value) {
          scope.associated ? TrialData.setValueForPathForCurrentMedia(path, value) : TrialData.setValueForPath(path, value);
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
        }
        $compile(sliderElement)(scope), element.after(sliderElement), scope.sendToTrialData(attrs.controllerDataPath, attrs.sliderInitialValue);
      }
    };
  }
]), angular.module('core').factory('ExperimentManager', [
  'TrialData',
  '$q',
  '$http',
  '$state',
  function (TrialData, $q, $http, $state) {
    var experimentManager = {
        advanceSlide: function () {
          TrialData.data.state.currentSlideIndex++, TrialData.data.state.currentSlideIndex === TrialData.data.schema.length ? $state.go('home', {}, { reload: !0 }) : $state.go(TrialData.data.schema[TrialData.data.state.currentSlideIndex].name, {}, { reload: !0 });
        },
        masterReset: function () {
          var deferred = $q.defer();
          TrialData.reset();
          var sessionID = UUID.generate();
          return TrialData.data.metadata.session_number = sessionID, $http.get('/api/experiment-schemas/random').success(function (data) {
            TrialData.data.media = data.media, TrialData.data.schema = data.structure, deferred.resolve();
          }).error(function () {
            deferred.reject('An experiment schema could not be fetched from the server');
          }), deferred.promise;
        }
      };
    return experimentManager;
  }
]), angular.module('core').factory('SocketIOService', [
  'socketFactory',
  function (socketFactory) {
    return socketFactory();
  }
]), angular.module('core').factory('TrialData', [function () {
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
          return angular.toJson(this.data, !0);
        },
        reset: function () {
          this.data = new BlankDataObject();
        },
        setValueForPath: function (path, value, options) {
          'true' === value ? value = !0 : 'false' === value && (value = !1);
          var numericRegex = /\d+\.?\d?/;
          if ('string' == typeof value && value.match(numericRegex) && (value = parseFloat(value)), 'string' == typeof value && (value = value.toLowerCase()), path && void 0 !== value) {
            for (var schema = this, pList = path.split('.'), len = pList.length, i = 0; len - 1 > i; i++) {
              var elem = pList[i];
              schema[elem] || (schema[elem] = {}), schema = schema[elem];
            }
            options && options.hasOwnProperty('array_index') && 'number' == typeof options.array_index ? (void 0 === schema[pList[len - 1]] && (schema[pList[len - 1]] = []), schema[pList[len - 1]][options.array_index] = value) : schema[pList[len - 1]] = value;
          }
        },
        setValueForPathForCurrentMedia: function (path, value) {
          var index;
          index = this.data.state.mediaPlayCount <= 0 ? 0 : this.data.state.mediaPlayCount - 1, this.setValueForPath(path, value, { array_index: index });
        }
      };
    return trialData.data = new BlankDataObject(), trialData;
  }]);
// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"H/jb":[function(require,module,exports) {
var define;
var global = arguments[3];
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/*! pagemap v1.2.0 - https://larsjung.de/pagemap/ */
(function webpackUniversalModuleDefinition(root, factory) {
  if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object' && (typeof module === "undefined" ? "undefined" : _typeof(module)) === 'object') module.exports = factory();else if (typeof define === 'function' && define.amd) define("pagemap", [], factory);else if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object') exports["pagemap"] = factory();else root["pagemap"] = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  return (
    /******/
    function (modules) {
      // webpackBootstrap

      /******/
      // The module cache

      /******/
      var installedModules = {};
      /******/

      /******/
      // The require function

      /******/

      function __webpack_require__(moduleId) {
        /******/

        /******/
        // Check if module is in cache

        /******/
        if (installedModules[moduleId]) {
          /******/
          return installedModules[moduleId].exports;
          /******/
        }
        /******/
        // Create a new module (and put it into the cache)

        /******/


        var module = installedModules[moduleId] = {
          /******/
          i: moduleId,

          /******/
          l: false,

          /******/
          exports: {}
          /******/

        };
        /******/

        /******/
        // Execute the module function

        /******/

        modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
        /******/

        /******/
        // Flag the module as loaded

        /******/

        module.l = true;
        /******/

        /******/
        // Return the exports of the module

        /******/

        return module.exports;
        /******/
      }
      /******/

      /******/

      /******/
      // expose the modules object (__webpack_modules__)

      /******/


      __webpack_require__.m = modules;
      /******/

      /******/
      // expose the module cache

      /******/

      __webpack_require__.c = installedModules;
      /******/

      /******/
      // define getter function for harmony exports

      /******/

      __webpack_require__.d = function (exports, name, getter) {
        /******/
        if (!__webpack_require__.o(exports, name)) {
          /******/
          Object.defineProperty(exports, name, {
            enumerable: true,
            get: getter
          });
          /******/
        }
        /******/

      };
      /******/

      /******/
      // define __esModule on exports

      /******/


      __webpack_require__.r = function (exports) {
        /******/
        if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
          /******/
          Object.defineProperty(exports, Symbol.toStringTag, {
            value: 'Module'
          });
          /******/
        }
        /******/


        Object.defineProperty(exports, '__esModule', {
          value: true
        });
        /******/
      };
      /******/

      /******/
      // create a fake namespace object

      /******/
      // mode & 1: value is a module id, require it

      /******/
      // mode & 2: merge all properties of value into the ns

      /******/
      // mode & 4: return value when already ns object

      /******/
      // mode & 8|1: behave like require

      /******/


      __webpack_require__.t = function (value, mode) {
        /******/
        if (mode & 1) value = __webpack_require__(value);
        /******/

        if (mode & 8) return value;
        /******/

        if (mode & 4 && _typeof(value) === 'object' && value && value.__esModule) return value;
        /******/

        var ns = Object.create(null);
        /******/

        __webpack_require__.r(ns);
        /******/


        Object.defineProperty(ns, 'default', {
          enumerable: true,
          value: value
        });
        /******/

        if (mode & 2 && typeof value != 'string') for (var key in value) {
          __webpack_require__.d(ns, key, function (key) {
            return value[key];
          }.bind(null, key));
        }
        /******/

        return ns;
        /******/
      };
      /******/

      /******/
      // getDefaultExport function for compatibility with non-harmony modules

      /******/


      __webpack_require__.n = function (module) {
        /******/
        var getter = module && module.__esModule ?
        /******/
        function getDefault() {
          return module['default'];
        } :
        /******/
        function getModuleExports() {
          return module;
        };
        /******/

        __webpack_require__.d(getter, 'a', getter);
        /******/


        return getter;
        /******/
      };
      /******/

      /******/
      // Object.prototype.hasOwnProperty.call

      /******/


      __webpack_require__.o = function (object, property) {
        return Object.prototype.hasOwnProperty.call(object, property);
      };
      /******/

      /******/
      // __webpack_public_path__

      /******/


      __webpack_require__.p = "";
      /******/

      /******/

      /******/
      // Load entry module and return exports

      /******/

      return __webpack_require__(__webpack_require__.s = 0);
      /******/
    }(
    /************************************************************************/

    /******/
    [
    /* 0 */

    /***/
    function (module, exports, __webpack_require__) {
      /* WEBPACK VAR INJECTION */
      (function (global) {
        module.exports = function (canvas, options) {
          var WIN = global.window;
          var DOC = WIN.document;
          var DOC_EL = DOC.documentElement;
          var BODY = DOC.querySelector('body');
          var CTX = canvas.getContext('2d');

          var black = function black(pc) {
            return "rgba(0,0,0,".concat(pc / 100, ")");
          };

          var settings = Object.assign({
            viewport: null,
            styles: {
              'header,footer,section,article': black(8),
              'h1,a': black(10),
              'h2,h3,h4': black(8)
            },
            back: black(2),
            view: black(5),
            drag: black(10),
            interval: null
          }, options);

          var _listener = function _listener(el, method, types, fn) {
            return types.split(/\s+/).forEach(function (type) {
              return el[method](type, fn);
            });
          };

          var on = function on(el, types, fn) {
            return _listener(el, 'addEventListener', types, fn);
          };

          var off = function off(el, types, fn) {
            return _listener(el, 'removeEventListener', types, fn);
          };

          var Rect = function Rect(x, y, w, h) {
            return {
              x: x,
              y: y,
              w: w,
              h: h
            };
          };

          var rect_rel_to = function rect_rel_to(rect) {
            var pos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
              x: 0,
              y: 0
            };
            return Rect(rect.x - pos.x, rect.y - pos.y, rect.w, rect.h);
          };

          var rect_of_doc = function rect_of_doc() {
            return Rect(0, 0, DOC_EL.scrollWidth, DOC_EL.scrollHeight);
          };

          var rect_of_win = function rect_of_win() {
            return Rect(WIN.pageXOffset, WIN.pageYOffset, DOC_EL.clientWidth, DOC_EL.clientHeight);
          };

          var el_get_offset = function el_get_offset(el) {
            var br = el.getBoundingClientRect();
            return {
              x: br.left + WIN.pageXOffset,
              y: br.top + WIN.pageYOffset
            };
          };

          var rect_of_el = function rect_of_el(el) {
            var _el_get_offset = el_get_offset(el),
                x = _el_get_offset.x,
                y = _el_get_offset.y;

            return Rect(x, y, el.offsetWidth, el.offsetHeight);
          };

          var rect_of_viewport = function rect_of_viewport(el) {
            var _el_get_offset2 = el_get_offset(el),
                x = _el_get_offset2.x,
                y = _el_get_offset2.y;

            return Rect(x + el.clientLeft, y + el.clientTop, el.clientWidth, el.clientHeight);
          };

          var rect_of_content = function rect_of_content(el) {
            var _el_get_offset3 = el_get_offset(el),
                x = _el_get_offset3.x,
                y = _el_get_offset3.y;

            return Rect(x + el.clientLeft - el.scrollLeft, y + el.clientTop - el.scrollTop, el.scrollWidth, el.scrollHeight);
          };

          var calc_scale = function () {
            var width = canvas.clientWidth;
            var height = canvas.clientHeight;
            return function (w, h) {
              return Math.min(width / w, height / h);
            };
          }();

          var resize_canvas = function resize_canvas(w, h) {
            canvas.width = w;
            canvas.height = h;
            canvas.style.width = "".concat(w, "px");
            canvas.style.height = "".concat(h, "px");
          };

          var viewport = settings.viewport;

          var find = function find(sel) {
            return Array.from((viewport || DOC).querySelectorAll(sel));
          };

          var drag = false;
          var root_rect;
          var view_rect;
          var scale;
          var drag_rx;
          var drag_ry;

          var draw_rect = function draw_rect(rect, col) {
            if (col) {
              CTX.beginPath();
              CTX.rect(rect.x, rect.y, rect.w, rect.h);
              CTX.fillStyle = col;
              CTX.fill();
            }
          };

          var apply_styles = function apply_styles(styles) {
            Object.keys(styles).forEach(function (sel) {
              var col = styles[sel];
              find(sel).forEach(function (el) {
                draw_rect(rect_rel_to(rect_of_el(el), root_rect), col);
              });
            });
          };

          var draw = function draw() {
            root_rect = viewport ? rect_of_content(viewport) : rect_of_doc();
            view_rect = viewport ? rect_of_viewport(viewport) : rect_of_win();
            scale = calc_scale(root_rect.w, root_rect.h);
            resize_canvas(root_rect.w * scale, root_rect.h * scale);
            CTX.setTransform(1, 0, 0, 1, 0, 0);
            CTX.clearRect(0, 0, canvas.width, canvas.height);
            CTX.scale(scale, scale);
            draw_rect(rect_rel_to(root_rect, root_rect), settings.back);
            apply_styles(settings.styles);
            draw_rect(rect_rel_to(view_rect, root_rect), drag ? settings.drag : settings.view);
          };

          var on_drag = function on_drag(ev) {
            ev.preventDefault();
            var cr = rect_of_viewport(canvas);
            var x = (ev.pageX - cr.x) / scale - view_rect.w * drag_rx;
            var y = (ev.pageY - cr.y) / scale - view_rect.h * drag_ry;

            if (viewport) {
              viewport.scrollLeft = x;
              viewport.scrollTop = y;
            } else {
              WIN.scrollTo(x, y);
            }

            draw();
          };

          var on_drag_end = function on_drag_end(ev) {
            drag = false;
            canvas.style.cursor = 'pointer';
            BODY.style.cursor = 'auto';
            off(WIN, 'mousemove', on_drag);
            off(WIN, 'mouseup', on_drag_end);
            on_drag(ev);
          };

          var on_drag_start = function on_drag_start(ev) {
            drag = true;
            var cr = rect_of_viewport(canvas);
            var vr = rect_rel_to(view_rect, root_rect);
            drag_rx = ((ev.pageX - cr.x) / scale - vr.x) / vr.w;
            drag_ry = ((ev.pageY - cr.y) / scale - vr.y) / vr.h;

            if (drag_rx < 0 || drag_rx > 1 || drag_ry < 0 || drag_ry > 1) {
              drag_rx = 0.5;
              drag_ry = 0.5;
            }

            canvas.style.cursor = 'crosshair';
            BODY.style.cursor = 'crosshair';
            on(WIN, 'mousemove', on_drag);
            on(WIN, 'mouseup', on_drag_end);
            on_drag(ev);
          };

          var init = function init() {
            canvas.style.cursor = 'pointer';
            on(canvas, 'mousedown', on_drag_start);
            on(viewport || WIN, 'load resize scroll', draw);

            if (settings.interval > 0) {
              setInterval(function () {
                return draw();
              }, settings.interval);
            }

            draw();
          };

          init();
          return {
            redraw: draw
          };
        };
        /* WEBPACK VAR INJECTION */

      }).call(this, __webpack_require__(1));
      /***/
    },
    /* 1 */

    /***/
    function (module, exports) {
      var g; // This works in non-strict mode

      g = function () {
        return this;
      }();

      try {
        // This works if eval is allowed (see CSP)
        g = g || new Function("return this")();
      } catch (e) {
        // This works if the window reference is available
        if ((typeof window === "undefined" ? "undefined" : _typeof(window)) === "object") g = window;
      } // g can still be undefined, but nothing to do about it...
      // We return undefined, instead of nothing here, so it's
      // easier to handle this case. if(!global) { ...}


      module.exports = g;
      /***/
    }])
  );
});
},{}],"symU":[function(require,module,exports) {
"use strict";

var _pagemap = _interopRequireDefault(require("./node_modules/pagemap"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _pagemap.default)(document.querySelector('#map'), {
  viewport: null,
  styles: {
    'header,footer,section,article': "rgba(0,0,0,0.08)",
    'h1,a, p, iframe': "rgba(0,0,0,0.10)",
    'h2,h3,h4': "rgba(0,0,0,0.08)"
  },
  back: "rgba(0,0,0,0.02)",
  view: "rgba(0,0,0,0.05)",
  drag: "rgba(0,0,0,0.10)",
  interval: null
});
},{"./node_modules/pagemap":"H/jb"}]},{},["symU"], null)
//# sourceMappingURL=MapLoader.e8aeb9fd.js.map
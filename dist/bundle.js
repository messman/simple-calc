/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			var styleTarget = fn.call(this, selector);
			// Special case to return head of iframe instead of iframe itself
			if (styleTarget instanceof window.HTMLIFrameElement) {
				try {
					// This will throw an exception if access to iframe is blocked
					// due to cross-origin restrictions
					styleTarget = styleTarget.contentDocument.head;
				} catch(e) {
					styleTarget = null;
				}
			}
			memo[selector] = styleTarget;
		}
		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(5);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton) options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else if (typeof options.insertAt === "object" && options.insertAt.before) {
		var nextSibling = getElement(options.insertInto + " " + options.insertAt.before);
		target.insertBefore(style, nextSibling);
	} else {
		throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(3);

__webpack_require__(6);

__webpack_require__(8);

__webpack_require__(11);

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(4);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js!./page.css", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js!./page.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "html {\n\tbox-sizing: border-box;\n\tfont-family: \"Arial\";\n\tcolor: #333;\n\tbackground-color: #ececec;\n}\n\nhtml, body {\n\tmargin: 0;\n\tpadding: 0;\n}\n\nheader {\n\tposition: relative;\n\tz-index: 1;\n}\n\nmain {\n\tposition: absolute;\n\tdisplay: flex;\n\ttop: 0;\n\tleft: 0;\n\twidth: 100%;\n\theight: 100%;\n\tz-index: 0;\n\talign-items: center;\n\tjustify-content: space-around;\n}\n\n.calc-container {\n\twidth: 400px;\n}\n\n.background {\n\tz-index: -1;\n\tposition: absolute;\n\ttop: 0;\n\tleft: 0;\n\twidth: 100%;\n\theight: 100%;\n}\n\n.header-inline {\n\tdisplay: inline-block;\n\tbackground-color: #ececec;\n\tpadding: 0 1em;\n\tmargin: .5em;\n}", ""]);

// exports


/***/ }),
/* 5 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(7);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js!./calc.css", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js!./calc.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "/* The overall calculator body */\n.calc {\n\twidth: 100%;\n\tborder-radius: 3px;\n\tborder-bottom-left-radius: 0;\n\tborder-bottom-right-radius: 0;\n\tborder: 1px solid #333;\n\tbox-shadow: 1px 1px 5px 0 #333;\n\tbackground-color: transparent;\n}\n\n.calc-display {\n\theight: 2em;\n\tfont-size: 2em;\n\tline-height: 2em;\n\tpadding: 0 .5em;\n\tcolor: white;\n\tbackground-color: #333;\n\tfont-family: \"Courier New\", \"Courier\", monospace;\n\ttext-decoration: underline;\n    text-decoration-color: rgba(256, 256, 256, .3);\n    overflow: hidden;\n    text-overflow: ellipsis;\n}\n\n.calc-keys {\n\twidth: 100%;\n\tborder-collapse: collapse;\n\tborder: none;\n\ttable-layout: fixed;\n}\n\n.calc-keys tr {\n\tborder: none;\n}\n\n.calc-keys td {\n\tpadding: 2px;\n\tborder: 1px solid #333;\n\tbackground-color: #f9f9f9;\n}\n\n.calc-keys td button {\n\tdisplay: table-cell;\n\twidth: 100%;\n\theight: 100%;\n\n\tcolor:#333;\n\n\tfont-size: 1.5em;\n\n\tborder: 0;\n\tborder-radius: 0;\n\tpadding: 10px;\n\t\n\tcursor: pointer;\n\tbackground-color: transparent;\n\tuser-select: none;\n\t-webkit-user-select: none;\n\tfont-weight: bold;\n}\n\n.calc-keys td:hover {\n\tbackground-color: #eee;\n}\n\n.calc-keys td:active {\n\tbackground-color: #ddd;\n}", ""]);

// exports


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(9);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js!./ticker.css", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js!./ticker.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, ".ticker {\n\twidth: 90%;\n\tmargin: auto;\n\tbackground-color: #fff;\n\tborder: 0;\n\tborder-top: none;\n\tbox-shadow: 1px 1px 3px 1px #333;\n}\n\n.ticker .ticker-output {\n\tborder: 0;\n\twidth: 100%;\n\tmargin: 0;\n\tpadding: 0;\n}", ""]);

// exports


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
var KEY_TYPE = exports.KEY_TYPE = {
	number: 0,
	mark: 1,
	parens: 2,
	operator: 3,
	clear: 4,
	equals: 5
};
var keytypekeys = Object.keys(KEY_TYPE);
keytypekeys.forEach(function (keytype) {
	KEY_TYPE[KEY_TYPE[keytype]] = keytype;
});

function pastelRange(percent) {
	// Pastel: HSL
	var h = 360 * percent;
	// canvas, display, button
	var l = [60, 75, 75];
	var a = [1, .9, .9];
	var colors = [];
	for (var i = 0; i < l.length; i++) {
		colors.push("hsla(" + h.toFixed(1) + ", 70%, " + l[i].toFixed(1) + "%, " + a[i] + ")");
	}return colors;
}

var keys = exports.keys = [
// Top Row
[["C", KEY_TYPE.action], ["(", KEY_TYPE.parens], [")", KEY_TYPE.parens], ["/", KEY_TYPE.operator]], [[7, KEY_TYPE.number], [8, KEY_TYPE.number], [9, KEY_TYPE.number], ["*", KEY_TYPE.operator]], [[4, KEY_TYPE.number], [5, KEY_TYPE.number], [6, KEY_TYPE.number], ["-", KEY_TYPE.operator]], [[1, KEY_TYPE.number], [2, KEY_TYPE.number], [3, KEY_TYPE.number], ["+", KEY_TYPE.operator]], [[0, KEY_TYPE.number, 2], // Double-width
[".", KEY_TYPE.mark], ["=", KEY_TYPE.equals]]];

var total = 0;
keys.forEach(function (row) {
	total += row.length;
});
var index = 0;
keys.forEach(function (row) {
	for (var i = 0; i < row.length; i++) {
		index++;
		var key = row[i];
		var pastelRanges = pastelRange(index / total);
		row[i] = {
			value: key[0],
			type: key[1],
			colors: pastelRanges,
			size: key[2] || 1
		};
	}
});

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _ui = __webpack_require__(12);

var UI = _interopRequireWildcard(_ui);

var _keys = __webpack_require__(10);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// Entry point to application
document.addEventListener("DOMContentLoaded", function () {
	console.log("Ready!");

	UI.bindUI();

	UI.onKeyPressed.push(function (key) {
		console.log(key);
	});

	var canvas = document.getElementById("background");

	function resize() {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	};
	window.onresize = resize;
	resize();

	var display = UI.getDisplay();

	var canvasEntriesCount = 0;
	var canvasEntries = [];
	UI.onKeyPressed.push(function (key) {

		switch (key.type) {
			case _keys.KEY_TYPE.clear:
				display.innerHTML = "";
				break;
			default:
				var span = document.createElement("span");
				span.innerHTML = key.value;
				span.style.color = key.colors[1];
				display.appendChild(span);
				break;
		}

		completed = false;
		start = Date.now();
		canvasEntries.push([key.value, key.colors, canvasEntriesCount++, start - totalStart, Math.random()]);
	});

	var totalStart = Date.now();

	var completed = true;
	var timeout = 100;
	var start = -1;
	function animate() {

		var now = Date.now();
		var totalElapsed = now - totalStart;
		if (!completed) {
			var animationElapsed = now - start;
			if (animationElapsed < timeout) {
				draw(animationElapsed / timeout, totalElapsed);
			} else {
				completed = true;
			}
		}
		if (completed) {
			draw(1, totalElapsed);
		}

		requestAnimationFrame(animate);
	}

	requestAnimationFrame(animate);

	function draw(percent, totalElapsed) {
		var rect = document.getElementById("calc").getBoundingClientRect();
		var width = rect.width;
		var middle = {
			x: rect.left + width / 2,
			y: rect.top + rect.height / 2
		};

		var radius = 100;

		var ctx = canvas.getContext("2d");
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		var windowRadius = Math.sqrt(Math.pow(window.innerWidth / 2, 2) + Math.pow(window.innerHeight / 2, 2));
		var entriesToKeep = Math.ceil(windowRadius / radius) + 1;
		var entryDiff = canvasEntries.length - entriesToKeep;
		if (entryDiff > 0) {
			canvasEntries.splice(0, entryDiff);
		}

		var length = canvasEntries.length;

		canvasEntries.forEach(function (entry, i) {
			var value = entry[0];
			var colorSet = entry[1];
			var totalIndex = entry[2];
			var elapsed = entry[3] + totalElapsed;
			var random = entry[4] * Math.PI * 2;

			var thisRadius = radius * (length - i - (1 - percent));

			// Draw the circle
			ctx.fillStyle = colorSet[0];
			ctx.beginPath();
			ctx.arc(middle.x, middle.y, thisRadius, 0, Math.PI * 2);
			ctx.closePath();
			ctx.fill();

			var direction = totalIndex % 2 === 0;
			var directionFlip = direction ? 1 : -1;
			var period = 60000;
			var offset = elapsed % period * directionFlip / period * Math.PI * 2 + random;
			var fudge = 1000;
			var nextOffset = (elapsed + (direction ? fudge : -fudge)) % period * directionFlip / period * Math.PI * 2 + random;

			ctx.fillStyle = colorSet[1];
			ctx.beginPath();
			ctx.moveTo(middle.x, middle.y);
			ctx.lineTo(middle.x + Math.cos(offset) * thisRadius, middle.y + Math.sin(offset) * thisRadius);
			ctx.arc(middle.x, middle.y, thisRadius, offset, nextOffset);
			ctx.closePath();
			ctx.fill();

			var angleDiff = Math.PI * 2 * (fudge / period);
			var pt1x = Math.cos(angleDiff) * thisRadius;
			var pt1y = Math.sin(angleDiff) * thisRadius;
			var distance = Math.sqrt(Math.pow(thisRadius - pt1x, 2) + Math.pow(0 - pt1y, 2));

			ctx.save();
			ctx.translate(middle.x, middle.y);
			var rotation = ((offset + offset + angleDiff) / 2 - Math.PI / 2) % (Math.PI * 2);
			ctx.rotate(rotation);
			ctx.translate(0, thisRadius);
			ctx.fillStyle = colorSet[0];
			ctx.font = Math.min(distance, radius) / 2 + "px \"Courier New\", \"Courier\", monospace";
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			ctx.fillText(value, 0, -radius / 2);
			ctx.restore();
		});
	}
});

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.onKeyPressed = undefined;
exports.bindUI = bindUI;
exports.getDisplay = getDisplay;

var _keys = __webpack_require__(10);

var Keys = _interopRequireWildcard(_keys);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var ui = {
	keys: "#calc-keys"
};

var onKeyPressed = exports.onKeyPressed = [];

function keyPress(keyPressed) {
	onKeyPressed.forEach(function (handler) {
		if (typeof handler === "function") handler(keyPressed);
	});
}

function bindUI() {
	var table = document.querySelector(ui.keys);
	var keys = Keys.keys;

	keys.forEach(function (row) {
		var tr = document.createElement("tr");
		row.forEach(function (key) {
			var td = document.createElement("td");
			var button = document.createElement("button");
			button.innerHTML = key.value;
			button.classList.add("keytype-" + _keys.KEY_TYPE[key.type]);
			td.style.backgroundColor = key.colors[2];
			if (key.size !== 1) td.colSpan = key.size;

			button.onclick = function () {
				keyPress(key);
			};

			td.appendChild(button);
			tr.appendChild(td);
		});

		table.appendChild(tr);
	});
}

function getDisplay() {
	return document.querySelector("#calc-display");
}

/***/ })
/******/ ]);
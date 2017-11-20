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
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
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

var	fixUrls = __webpack_require__(6);

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


Object.defineProperty(exports, "__esModule", {
	value: true
});
// keys.js
// Data on individual keys and colors

// Type of key (for maths, later?)
var KEY_TYPE = exports.KEY_TYPE = {
	number: 0,
	mark: 1,
	parens: 2,
	operator: 3,
	clear: 4,
	equals: 5

	// Borrow TypeScript's enum.x = 1, enum[1] = x
};var keytypekeys = Object.keys(KEY_TYPE);
keytypekeys.forEach(function (keytype) {
	KEY_TYPE[KEY_TYPE[keytype]] = keytype;
});

// Create the three colors based on the percent of the h-range of HSL
function pastelRange(percent) {
	// Pastel: HSL
	var h = (360 * percent).toFixed(1);
	return {
		canvas: "hsla(" + h + ", 70%, 60%, 1)",
		display: "hsla(" + h + ", 70%, 75%, .9)",
		button: "hsla(" + h + ", 70%, 75%, .9)"
	};
};

var keys = exports.keys = [
// Top Row
[["C", KEY_TYPE.clear, "c"], ["(", KEY_TYPE.parens], [")", KEY_TYPE.parens], ["/", KEY_TYPE.operator]], [[7, KEY_TYPE.number], [8, KEY_TYPE.number], [9, KEY_TYPE.number], ["*", KEY_TYPE.operator]], [[4, KEY_TYPE.number], [5, KEY_TYPE.number], [6, KEY_TYPE.number], ["-", KEY_TYPE.operator]], [[1, KEY_TYPE.number], [2, KEY_TYPE.number], [3, KEY_TYPE.number], ["+", KEY_TYPE.operator]], [[0, KEY_TYPE.number, null, 2], // Double-width
[".", KEY_TYPE.mark], ["=", KEY_TYPE.equals, "Enter"]]];

var total = 0;
keys.forEach(function (row) {
	total += row.length;
});
var index = 0;
keys.forEach(function (row) {
	for (var i = 0; i < row.length; i++) {
		index++;
		var key = row[i];
		row[i] = {
			value: key[0],
			type: key[1],
			keyName: key[2] || key[0],
			colors: pastelRange(index / total),
			size: key[3] || 1
		};
	}
});

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(4);

__webpack_require__(7);

__webpack_require__(9);

__webpack_require__(11);

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(5);
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
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "html {\n\tbox-sizing: border-box;\n\tfont-family: \"Arial\";\n\tcolor: #333;\n\tbackground-color: #ececec;\n}\n\nhtml, body {\n\tmargin: 0;\n\tpadding: 0;\n}\n\nheader {\n\tposition: relative;\n\tz-index: 1;\n}\n\nmain {\n\tposition: absolute;\n\tdisplay: flex;\n\ttop: 0;\n\tleft: 0;\n\twidth: 100%;\n\theight: 100%;\n\tz-index: 0;\n\talign-items: center;\n\tjustify-content: space-around;\n}\n\n.calc-container {\n\twidth: 400px;\n}\n\n.background {\n\tz-index: -1;\n\tposition: absolute;\n\ttop: 0;\n\tleft: 0;\n\twidth: 100%;\n\theight: 100%;\n}\n\n.header-inline {\n\tdisplay: inline-block;\n\tbackground-color: #ececec;\n\tpadding: 0 1em;\n\tmargin: .5em;\n}\n\n@media screen and (max-width: 500px), screen and (max-height: 600px) {\n\theader {\n\t\tdisplay: none;\n\t}\t\t\n\t\n\t.calc-container {\n\t\twidth: 320px;\n\t}\n}", ""]);

// exports


/***/ }),
/* 6 */
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
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(8);
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
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "/* The overall calculator body */\n.calc {\n\twidth: 100%;\n\tborder-radius: 3px;\n\tborder-bottom-left-radius: 0;\n\tborder-bottom-right-radius: 0;\n\tbox-shadow: 1px 1px 5px 0 #333;\n\tbackground-color: transparent;\n}\n\n.calc-display-container {\n\tposition: relative;\n\twidth: 100%;\n\theight: 2em;\n\tfont-size: 2em;\n\tbackground-color: #333;\n}\n\n.calc-display {\n\tdisplay: block;\n\tposition: absolute;\n\ttop: 0;\n\tleft: 0;\n\tborder: 0;\n\twidth: 100%;\n\theight: 100%;\n\tfont-size: 1em;\n\tline-height: 2em;\n\tpadding: 0 .5em;\n\tbox-sizing: border-box;\n\tcolor: white;\n\tbackground: transparent;\n\tfont-family: \"Courier New\", \"Courier\", monospace;\n    overflow: hidden;\n    text-overflow: ellipsis;\n}\n\n.calc-display-input {\n\ttext-decoration: underline;\n\ttext-decoration-color: rgba(256, 256, 256, .3);\n}\n\n.calc-keys {\n\twidth: 100%;\n\tborder-collapse: collapse;\n\tborder: none;\n\ttable-layout: fixed;\n}\n\n.calc-keys tr {\n\tborder: none;\n}\n\n.calc-keys td {\n\tpadding: 2px;\n\tborder: 1px solid #333;\n\tbackground-color: #f9f9f9;\n}\n\n.calc-keys td button {\n\tdisplay: table-cell;\n\twidth: 100%;\n\theight: 100%;\n\n\tcolor:#333;\n\n\tfont-size: 1.5em;\n\n\tborder: 0;\n\tborder-radius: 0;\n\tpadding: 10px;\n\t\n\tcursor: pointer;\n\tbackground-color: transparent;\n\tuser-select: none;\n\t-webkit-user-select: none;\n\tfont-weight: bold;\n}\n\n.calc-keys td:hover {\n\tbackground-color: #eee;\n}\n\n.calc-keys td:active {\n\tbackground-color: #ddd;\n}\n\n.calc-output-container {\n\twidth: 100%;\n\ttext-align: center;\n}\n\n.calc-output {\n\tdisplay: inline-block;\n\theight: 1.5em;\n\tline-height: 1.5em;\n\tfont-size: 1.5em;\n\tcolor: #444;\n\tbackground: rgba(250, 250, 250, .5);\n\tmargin: .5em 0;\n\tpadding: 0 .5em;\n\ttext-align: center;\n\tfont-weight: bold;\n}", ""]);

// exports


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(10);
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
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, ".ticker {\n\twidth: 90%;\n\tmargin: auto;\n\tbackground-color: #fff;\n\tborder: 0;\n\tborder-top: none;\n\tbox-shadow: 1px 1px 3px 1px #333;\n}\n\n.ticker .ticker-output {\n\tborder: 0;\n\twidth: 100%;\n\tmargin: 0;\n\tpadding: 0;\n}", ""]);

// exports


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _ui = __webpack_require__(12);

var UI = _interopRequireWildcard(_ui);

var _draw = __webpack_require__(13);

var Draw = _interopRequireWildcard(_draw);

var _keys = __webpack_require__(2);

var _calculate = __webpack_require__(14);

var Calculator = _interopRequireWildcard(_calculate);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// Calcualtor's current expression
var input = [];

// Entry point to application
document.addEventListener("DOMContentLoaded", function () {
	console.log("Ready!");

	UI.bindUIOnReady();

	Draw.bindCanvas();

	UI.onKeyPressed.push(function (key) {
		Draw.update(key);

		switch (key.type) {
			case _keys.KEY_TYPE.clear:
				UI.updateDisplay(null);
				UI.updateOutput(null);
				input = [];
				break;
			default:
				// Add the key to the display
				UI.updateDisplay(key);
				input.push(key);
				UI.updateOutput(Calculator.calc(input));
				break;
		}
	});

	UI.updateOutput(null);
});

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.onKeyPressed = exports.ui = undefined;
exports.bindUIOnReady = bindUIOnReady;
exports.updateDisplay = updateDisplay;
exports.updateOutput = updateOutput;

var _keys = __webpack_require__(2);

var Keys = _interopRequireWildcard(_keys);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// UI bindings
var ui = exports.ui = {
	keys: "#calc-keys",
	displayInput: "#calc-display-input",
	display: "#calc-display",
	output: "#calc-output"
};

// Add custom keypress listeners
var onKeyPressed = exports.onKeyPressed = [];
function keyPress(keyPressed) {
	onKeyPressed.forEach(function (handler) {
		if (typeof handler === "function") handler(keyPressed);
	});
}

// When everything is loaded, bind the UI for the keys
function bindUIOnReady() {
	var table = document.querySelector(ui.keys);
	var keys = Keys.keys;

	var flat = {};

	// Add the keys to the page row by row
	keys.forEach(function (row) {

		var tr = document.createElement("tr");

		row.forEach(function (key) {
			// Add the background color on the TD instead, the button is slightly smaller.
			var td = document.createElement("td");
			td.style.backgroundColor = key.colors.button;
			var button = document.createElement("button");

			button.innerHTML = key.value;
			button.classList.add("keytype-" + Keys.KEY_TYPE[key.type]);

			// For the "0", stretch the width
			if (key.size !== 1) td.colSpan = key.size;

			// When clicked, trigger
			td.onclick = function (e) {
				e.preventDefault();
				e.stopImmediatePropagation();
				keyPress(key);
			};

			td.appendChild(button);
			tr.appendChild(td);

			// Also add to the lookup table for keypress
			flat[key.keyName] = key;
		});

		table.appendChild(tr);
	});

	var displayInput = document.querySelector(ui.displayInput);
	displayInput.addEventListener("keypress", function (e) {
		var keyPressed = flat[e.key.toLowerCase()];
		if (keyPressed) {
			keyPress(keyPressed);
		}
		e.preventDefault();
		e.stopImmediatePropagation();
	});
}

function getCursorPosition(el) {
	if ("selectionStart" in el) {
		// Standard-compliant browsers
		return el.selectionStart;
	} else if (document.selection) {
		// IE
		el.focus();
		var selection = document.selection.createRange();
		var selectionLength = document.selection.createRange().text.length;
		selection.moveStart("character", -el.value.length);
		return selection.text.length - selectionLength;
	}
	return -1;
}

function setSelectionRange(input, selectionStart, selectionEnd) {
	if (input.setSelectionRange) {
		input.focus();
		input.setSelectionRange(selectionStart, selectionEnd);
	} else if (input.createTextRange) {
		// IE
		var range = input.createTextRange();
		range.collapse(true);
		range.moveEnd("character", selectionEnd);
		range.moveStart("character", selectionStart);
		range.select();
	}
}

function setCursorPosition(input, pos) {
	setSelectionRange(input, pos, pos);
}

// Update the display
function updateDisplay(key) {
	var display = document.querySelector(ui.display);
	var displayInput = document.querySelector(ui.displayInput);

	if (!key) {
		display.innerHTML = "";
		displayInput.value = "";
		return;
	}

	var span = document.createElement("span");
	span.innerHTML = key.value;
	span.style.color = key.colors.display;

	var numChildren = display.children.length;
	var index = getCursorPosition(displayInput);
	if (index === -1) index = numChildren;

	if (index === numChildren) display.appendChild(span);else display.insertBefore(span, display.children[index]);

	var text = displayInput.value;
	var before = text.substring(0, index);
	var after = text.substring(index);
	var newVal = before + " " + after;
	displayInput.value = newVal;
	console.log(text.length, before.length, after.length, newVal.length);

	displayInput.focus();
	setCursorPosition(displayInput, index + 1);
}

function updateOutput(result) {
	var output = document.querySelector(ui.output);
	if (result === null) {
		output.innerHTML = "";
		output.style.visibility = "hidden";
		return;
	}
	output.style.visibility = "";
	output.innerHTML = result;
}

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.bindCanvas = bindCanvas;
exports.update = update;
// All the keys we will need to draw in the canvas.
var keysToDraw = [];
// Keep track of total keys, as we will clear the array above
var allKeysPressed = 0;

// When we started the app.
var appStartTime = Date.now();

// The canvas we will draw to.
var canvas = null;
var canvasWidth = 0;
var canvasHeight = 0;
function resize() {
	canvasWidth = window.innerWidth;
	canvas.width = canvasWidth;
	canvasHeight = window.innerHeight;
	canvas.height = canvasHeight;
};
window.onresize = resize;

function bindCanvas() {
	canvas = document.getElementById("background");
	resize();
}

// Track if we are in the requestAnimationFrame loop or not
var isDrawing = false;
// New keys will be animated in.
var newKeyAnimationStart = -1;
var newKeyAnimationTimeout = 100; //ms

// Accept new keys
function update(newKey) {

	newKeyAnimationStart = Date.now();

	keysToDraw.push({
		key: newKey,
		totalIndex: allKeysPressed++,
		random: Math.random()
	});

	if (!isDrawing) animate();
}

// The animation loop
function animate() {
	isDrawing = true;

	// Figure out if we'll need to draw again
	var keepDrawing = false;

	var now = Date.now();
	var totalElapsed = now - appStartTime;

	// Check on the state of new key animation
	var isNewKeyAnimationCompleted = newKeyAnimationStart === -1;
	if (!isNewKeyAnimationCompleted) {
		// Check how far along the animation is
		var newKeyAnimationElapsed = now - newKeyAnimationStart;
		isNewKeyAnimationCompleted = newKeyAnimationElapsed > newKeyAnimationTimeout;
		// If not completed, draw the animation at its current point
		if (isNewKeyAnimationCompleted) newKeyAnimationStart = -1;else keepDrawing = draw(newKeyAnimationElapsed / newKeyAnimationTimeout, totalElapsed);
	}

	// Otherwise if completed, draw the normal animation
	if (isNewKeyAnimationCompleted) keepDrawing = draw(1, totalElapsed);

	// If true, we have keys that aren't cleared that we should draw
	if (keepDrawing) {
		requestAnimationFrame(animate);
	} else {
		// Be done drawing, signal that this function will need to be called manually again.
		isDrawing = false;
	}
}

// How large a ring is
var ringRadius = 100;

// Returns a boolean of whether or not drawing should occur; if true, draws.
function draw(newKeyAnimationPercent, totalElapsed) {

	// Clear the canvas
	var ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// If no keys, get outta here
	if (!keysToDraw.length) return false;

	// Get our calculator position on the screen
	var rect = document.getElementById("calc").getBoundingClientRect();
	var width = rect.width;
	var middle = {
		x: rect.left + width / 2,
		y: rect.top + rect.height / 2
	};

	// Figure out the (diagonal) radius of our window (which is the canvas size).
	var windowRadius = Math.sqrt(Math.pow(canvasWidth / 2, 2) + Math.pow(canvasHeight / 2, 2));
	// Only keep enough keys to draw just past the diagonal of the screen, to conserve memory.
	var keysToKeep = Math.ceil(windowRadius / ringRadius) + 1;
	var diff = keysToDraw.length - keysToKeep;
	if (diff > 0) {
		keysToDraw.splice(0, diff);
	}

	var length = keysToDraw.length;
	if (length === 0) return false;

	for (var i = 0; i < length; i++) {
		drawSingle(ctx, keysToDraw[i], i, length, middle, newKeyAnimationPercent, totalElapsed);
	}return true;
}

var TWO_PI = Math.PI * 2;
// The time it takes to rotate the ring
var blockPeriod = 60000;
// Size of the block represents how many ms of time?
var blockSize = 5000;
// Size of the block in radians
var blockSizeRadians = blockSize / blockPeriod * TWO_PI;

function drawSingle(ctx, keyEntry, index, length, middle, newKeyAnimationPercent, totalElapsed) {

	// Value of the key
	var value = keyEntry.key.value;
	// Colors of the key
	var colors = keyEntry.key.colors;
	// Total index (not index in array)
	var totalIndex = keyEntry.totalIndex,
	    random = keyEntry.random;

	// The radius of this ring may be different if we are animating a new key

	var radius = ringRadius * (length - index - (1 - newKeyAnimationPercent));

	// Draw the circle/ring
	ctx.fillStyle = colors.canvas;
	ctx.beginPath();
	ctx.arc(middle.x, middle.y, radius, 0, TWO_PI);
	ctx.closePath();
	ctx.fill();

	// Now draw the block that will rotate.

	// Direction (clockwise or counter) depends on the *total* index.
	var clockwise = totalIndex % 2 === 0;

	// Compute the angle of the block's side.
	var blockRotation = (totalElapsed % blockPeriod / blockPeriod + random) * (clockwise ? 1 : -1) * TWO_PI;
	var blockRotationNext = blockSizeRadians * (clockwise ? -1 : 1);

	// Draw an arc (pizza slice) out from the middle
	ctx.fillStyle = colors.display;
	ctx.beginPath();
	ctx.moveTo(middle.x, middle.y);
	ctx.lineTo(middle.x + Math.cos(blockRotation) * radius, middle.y + Math.sin(blockRotation) * radius);
	ctx.arc(middle.x, middle.y, radius, blockRotation, blockRotation + blockRotationNext, clockwise);
	ctx.closePath();
	ctx.fill();

	// Compute the line distance between the two furthest points of our slice block.
	var pt1x = Math.cos(blockSizeRadians) * radius;
	var pt1y = Math.sin(blockSizeRadians) * radius;
	var distance = Math.sqrt(Math.pow(radius - pt1x, 2) + Math.pow(0 - pt1y, 2));

	// Draw the value of the key.
	ctx.save();
	ctx.translate(middle.x, middle.y);
	var rotation = ((blockRotation + blockRotation + blockRotationNext) / 2 - Math.PI / 2) % TWO_PI;
	ctx.rotate(rotation);
	ctx.translate(0, radius);
	ctx.fillStyle = colors.canvas;
	ctx.font = "bold " + Math.min(distance, ringRadius) / 2 + "px \"Courier New\", \"Courier\", monospace";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillText(value, 0, -ringRadius / 2);
	ctx.restore();
}

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.calc = calc;

var Invalid = 0 / 0;

var decimalMaxPrecision = 3;
function toString(result) {
	var num = parseFloat(result);
	if (isNaN(num)) return num;
	var r = Math.pow(10, decimalMaxPrecision);
	return Math.round(num * r) / r;
}

function calc(input) {
	var result = void 0;
	try {
		result = eval(input.map(function (a) {
			return a.value;
		}).join(""));
	} catch (e) {
		result = Invalid;
	}
	return toString(result);
}

/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map
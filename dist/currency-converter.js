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
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
module.exports = __webpack_require__(4);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const options_1 = __webpack_require__(2);
const dom_1 = __webpack_require__(3);
function CurrencyConverterInstance(element, instanceConfig) {
    const self = {
        _bind: bind,
        _createElement: dom_1.createElement,
        _data: {
            from: {
                amount: null,
                currency: null
            },
            to: {
                amount: null,
                currency: null
            }
        },
        destroy: destroy,
        getData: getData,
        setAmount: seAmount,
        setCurrency: setCurrency,
        updateCurrencyData: updateCurrencyData
    };
    self._handlers = [];
    let _currencyData = {};
    let _wrapperElm = null;
    let _currencyTextElm = null;
    function init() {
        var _a;
        self.element = element;
        self.config = parseConfig();
        self._data.from.currency = self.config.fromCurrency;
        self._data.to.currency = self.config.toCurrency;
        buildOut();
        if ((_a = self === null || self === void 0 ? void 0 : self.config) === null || _a === void 0 ? void 0 : _a.currencyData) {
            parseAndLoadCurrencyData(self.config.currencyData);
        }
        else {
            fetchCurrencyData().then((data) => {
                parseAndLoadCurrencyData(data);
            });
        }
        bindEvents();
        triggerEvent("onReady");
    }
    function parseConfig() {
        const userConfig = Object.assign({}, (instanceConfig || {}));
        if ('locale' in userConfig) {
            userConfig.locale = Object.assign(Object.assign({}, options_1.defaults.locale), userConfig.locale);
        }
        if ('precision' in userConfig && isNaN(userConfig.precision)) {
            delete userConfig.precision;
        }
        return Object.assign(Object.assign({}, options_1.defaults), (userConfig));
    }
    function getLocale(key) {
        var _a;
        if (((_a = self === null || self === void 0 ? void 0 : self.config) === null || _a === void 0 ? void 0 : _a.locale) && key in self.config.locale) {
            return self.config.locale[key];
        }
        return key;
    }
    function buildOut() {
        const config = self.config;
        _wrapperElm = dom_1.createElement('div', ('currency-converter' + (typeof config.wrapperClass === 'string' ? ` ${config.wrapperClass}` : '')));
        const fromGroup = dom_1.createElement('div', 'from-group');
        const fromLabel = dom_1.createElement('label', '', getLocale('From'));
        const fromAmountElm = dom_1.createNumberInput(('input-from-amount' + (typeof config.inputFromAmountClass === 'string' ? ` ${config.inputFromAmountClass}` : '')));
        const fromCurrencyElm = dom_1.createSelect(('select-from-currency' + (typeof config.inputFromCurrencyClass === 'string' ? ` ${config.inputFromCurrencyClass}` : '')));
        fromGroup.appendChild(fromLabel);
        fromGroup.appendChild(fromAmountElm);
        fromGroup.appendChild(fromCurrencyElm);
        const toGroup = dom_1.createElement('div', 'to-group');
        const toLabel = dom_1.createElement('label', '', getLocale('To'));
        const toAmountElm = dom_1.createNumberInput(('input-to-amount' + (typeof config.inputToAmountClass === 'string' ? ` ${config.inputToAmountClass}` : '')));
        const toCurrencyElm = dom_1.createSelect(('select-to-currency' + (typeof config.inputToCurrencyClass === 'string' ? ` ${config.inputToCurrencyClass}` : '')));
        toGroup.appendChild(toLabel);
        toGroup.appendChild(toAmountElm);
        toGroup.appendChild(toCurrencyElm);
        const containerElm = dom_1.createElement('div', 'currency-converter-container');
        containerElm.appendChild(fromGroup);
        containerElm.appendChild(toGroup);
        _wrapperElm.appendChild(containerElm);
        if (config.withText) {
            _currencyTextElm = dom_1.createElement('div', 'currency-text');
            _wrapperElm.appendChild(_currencyTextElm);
        }
        self.element.appendChild(_wrapperElm);
        self._elms = {
            fromAmount: fromAmountElm.getElementsByTagName("input")[0],
            fromCurrency: fromCurrencyElm.getElementsByTagName("select")[0],
            toAmount: toAmountElm.getElementsByTagName("input")[0],
            toCurrency: toCurrencyElm.getElementsByTagName("select")[0],
        };
        self._elms.fromAmount.value = !isNaN(config.baseAmount) ? config.baseAmount.toString() : '1';
    }
    function fetchCurrencyData() {
        return new Promise((resolve) => {
            fetch(self.config.currencyApi).then(results => {
                return results.json();
            }).then(data => {
                resolve(data);
            }).catch(reason => {
                console.error(reason);
            });
        });
    }
    function parseAndLoadCurrencyData(data) {
        parseCurrencyData(data);
        loadCurrencyData();
    }
    function parseCurrencyData(data) {
        if ((data === null || data === void 0 ? void 0 : data.rates) && (data === null || data === void 0 ? void 0 : data.base)) {
            _currencyData = Object.assign(Object.assign({}, data.rates), { [data.base]: 1 });
        }
        else if (data === null || data === void 0 ? void 0 : data.rates) {
            _currencyData = Object.assign({}, data.rates);
        }
        else {
            _currencyData = data;
        }
    }
    function loadCurrencyData() {
        if (!_currencyData) {
            return;
        }
        const elms = self._elms;
        if (!elms || !elms.fromCurrency || !elms.toCurrency) {
            return;
        }
        elms.fromCurrency.innerHTML = '';
        elms.toCurrency.innerHTML = '';
        const currencyArr = Object.keys(_currencyData).sort();
        let currency;
        for (currency of currencyArr) {
            const optionElm = dom_1.createElement('option', '', getLocale(currency));
            optionElm.setAttribute('value', currency);
            elms.fromCurrency.appendChild(optionElm);
            elms.toCurrency.appendChild(optionElm.cloneNode(true));
        }
        const data = self._data;
        if (data.from.currency && data.from.currency in _currencyData) {
            elms.fromCurrency.value = data.from.currency;
        }
        else {
            if (currencyArr.length) {
                elms.fromCurrency.value = currencyArr[0];
            }
            else {
                elms.fromCurrency.value = '';
            }
        }
        if (data.to.currency && data.to.currency in _currencyData) {
            elms.toCurrency.value = data.to.currency;
        }
        else {
            if (currencyArr.length) {
                elms.toCurrency.value = currencyArr[0];
            }
            else {
                elms.toCurrency.value = '';
            }
        }
        onCurrencyChange();
    }
    function round(value, precision) {
        const multiplier = Math.pow(10, precision || 0);
        return Math.round(value * multiplier) / multiplier;
    }
    function convertFrom(bNoTrigger) {
        const elms = self._elms || null;
        if (elms && elms.fromAmount && elms.fromCurrency && elms.toAmount && elms.toCurrency) {
            const data = {
                from: {
                    amount: elms.fromAmount.value,
                    currency: elms.fromCurrency.value
                },
                to: {
                    amount: null,
                    currency: elms.toCurrency.value
                }
            };
            if (!isNaN(data.from.amount)) {
                if (data.from.currency in _currencyData && data.to.currency in _currencyData) {
                    const fromRate = parseFloat(_currencyData[data.from.currency].toString());
                    const toRate = parseFloat(_currencyData[data.to.currency].toString());
                    if (fromRate && toRate) {
                        const fromAMount = parseFloat(data.from.amount);
                        data.to.amount = round(fromAMount * (toRate / fromRate), self.config.precision);
                    }
                }
            }
            elms.toAmount.value = !isNaN(data.to.amount) ? data.to.amount : '';
            setData(data, bNoTrigger);
        }
    }
    function convertTo(bNoTrigger) {
        const elms = self._elms || null;
        if (elms && elms.fromAmount && elms.fromCurrency && elms.toAmount && elms.toCurrency) {
            const data = {
                from: {
                    amount: null,
                    currency: elms.fromCurrency.value
                },
                to: {
                    amount: elms.toAmount.value,
                    currency: elms.toCurrency.value
                }
            };
            if (!isNaN(data.to.amount)) {
                if (data.from.currency in _currencyData && data.to.currency in _currencyData) {
                    const fromRate = parseFloat(_currencyData[data.from.currency].toString());
                    const toRate = parseFloat(_currencyData[data.to.currency].toString());
                    if (fromRate && toRate) {
                        const toAmount = parseFloat(data.to.amount);
                        data.from.amount = round(toAmount * (fromRate / toRate), self.config.precision);
                    }
                }
            }
            elms.fromAmount.value = !isNaN(data.from.amount) ? data.from.amount : '';
            setData(data, bNoTrigger);
        }
    }
    function setData(data, bNoTrigger) {
        var _a;
        self._data = data;
        if (!bNoTrigger) {
            if (typeof ((_a = self === null || self === void 0 ? void 0 : self.config) === null || _a === void 0 ? void 0 : _a.onChange) === 'function') {
                self.config.onChange(data);
            }
            triggerEvent('onChange', data);
        }
    }
    function getData() {
        return self._data;
    }
    function inputFilter(value) {
        return /^-?\d*[.,]?\d*$/.test(value);
    }
    function onInputEvent(event) {
        const target = event.target;
        if (inputFilter(target.value)) {
            target.oldValue = target.value;
            target.oldSelectionStart = target.selectionStart;
            target.oldSelectionEnd = target.selectionEnd;
        }
        else if (target.hasOwnProperty("oldValue")) {
            target.value = target.oldValue || '';
            target.setSelectionRange(target.oldSelectionStart || 0, target.oldSelectionEnd || 0);
        }
        else {
            target.value = "";
        }
    }
    function onCurrencyChange() {
        convertFrom();
        showCurrencyText();
    }
    function showCurrencyText() {
        var _a, _b;
        if (self.config.withText && _currencyTextElm && self._data && _currencyData) {
            const data = self._data;
            if (((_a = data === null || data === void 0 ? void 0 : data.from) === null || _a === void 0 ? void 0 : _a.currency) && ((_b = data === null || data === void 0 ? void 0 : data.to) === null || _b === void 0 ? void 0 : _b.currency) && data.from.currency in _currencyData && data.to.currency in _currencyData) {
                _currencyTextElm.innerHTML = '';
                const fromRate = parseFloat(_currencyData[data.from.currency].toString());
                const toRate = parseFloat(_currencyData[data.to.currency].toString());
                const rate = round(toRate / fromRate, self.config.precision);
                const fromCurrency = getLocale(data.from.currency);
                const toCurrency = getLocale(data.to.currency);
                _currencyTextElm.appendChild(dom_1.createElement('span', 'from-amount-text', '1'));
                _currencyTextElm.appendChild(document.createTextNode(' '));
                _currencyTextElm.appendChild(dom_1.createElement('span', 'from-currency-text', fromCurrency));
                _currencyTextElm.appendChild(document.createTextNode(' = '));
                _currencyTextElm.appendChild(dom_1.createElement('span', 'to-amount-text', rate.toString()));
                _currencyTextElm.appendChild(document.createTextNode(' '));
                _currencyTextElm.appendChild(dom_1.createElement('span', 'to-currency-text', toCurrency));
            }
        }
    }
    function bind(element, event, handler, options) {
        if (event instanceof Array)
            return event.forEach((ev) => bind(element, ev, handler, options));
        if (element instanceof Array)
            return element.forEach((el) => bind(el, event, handler, options));
        element.addEventListener(event, handler, options);
        self._handlers.push({
            element: element,
            event,
            handler,
            options,
        });
    }
    function bindEvents() {
        const elms = self._elms;
        if (elms && elms.fromAmount && elms.fromCurrency && elms.toAmount && elms.toCurrency) {
            bind(elms.fromAmount, ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"], onInputEvent);
            bind(elms.fromAmount, ["change", "keyup"], () => convertFrom());
            bind(elms.fromCurrency, "change", () => onCurrencyChange());
            bind(elms.toAmount, ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"], onInputEvent);
            bind(elms.toAmount, ["change", "keyup"], () => convertTo());
            bind(elms.toCurrency, "change", () => onCurrencyChange());
        }
    }
    function triggerEvent(event, data) {
        const e = data ? new CustomEvent(event, data) : new CustomEvent(event);
        e.initEvent(name, true, true);
        self.element.dispatchEvent(e);
    }
    function destroy() {
        if (self.config !== undefined)
            triggerEvent("onDestroy");
        for (let i = self._handlers.length; i--;) {
            const h = self._handlers[i];
            h.element.removeEventListener(h.event, h.handler, h.options);
        }
        self._handlers = [];
        if (_wrapperElm) {
            _wrapperElm.remove();
        }
    }
    function updateCurrencyData(data) {
        parseAndLoadCurrencyData(data);
    }
    function seAmount(amount) {
        var _a;
        if ((_a = self === null || self === void 0 ? void 0 : self._elms) === null || _a === void 0 ? void 0 : _a.fromAmount) {
            const input = amount.toString();
            if (inputFilter(input)) {
                self._elms.fromAmount.value = input;
                convertFrom();
            }
        }
    }
    function setCurrency(currency) {
        var _a;
        if ((_a = self === null || self === void 0 ? void 0 : self._elms) === null || _a === void 0 ? void 0 : _a.fromAmount) {
            if (currency in _currencyData) {
                self._elms.fromCurrency.value = currency;
                onCurrencyChange();
            }
        }
    }
    init();
    return self;
}
function _currencyConverter(nodeList, config) {
    const nodes = Array.prototype.slice
        .call(nodeList)
        .filter((x) => x instanceof HTMLElement);
    let instances = [];
    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        try {
            if (node.getAttribute("data-cc-omit") !== null)
                continue;
            if (["input", "select", "textarea", "button", "label",
                "fieldset", "legend", "datalist", "output", "option", "optgroup"].indexOf(node.tagName.toLowerCase()) > -1) {
                console.error("Invalid element", node);
                continue;
            }
            if (node._currencyConverter !== undefined) {
                node._currencyConverter.destroy();
                node._currencyConverter = undefined;
            }
            node._currencyConverter = CurrencyConverterInstance(node, config || {});
            instances.push(node._currencyConverter);
        }
        catch (e) {
            console.error(e);
        }
    }
    return instances.length === 1 ? instances[0] : instances;
}
if (typeof HTMLElement !== "undefined" &&
    typeof HTMLCollection !== "undefined" &&
    typeof NodeList !== "undefined") {
    HTMLCollection.prototype.currencyConverter = NodeList.prototype.currencyConverter = function (config) {
        return _currencyConverter(this, config);
    };
    HTMLElement.prototype.currencyConverter = function (config) {
        return _currencyConverter([this], config);
    };
}
const currencyConverter = function (selector, config) {
    if (typeof selector === "string") {
        return _currencyConverter(window.document.querySelectorAll(selector), config);
    }
    else if (selector instanceof Node) {
        return _currencyConverter([selector], config);
    }
    else {
        return _currencyConverter(selector, config);
    }
};
if (typeof window !== "undefined") {
    window.currencyConverter = currencyConverter;
}
exports.default = currencyConverter;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.defaults = void 0;
exports.defaults = {
    fromCurrency: 'EUR',
    toCurrency: 'USD',
    baseAmount: 100,
    currencyApi: `https://api.exchangeratesapi.io/latest`,
    precision: 4,
    locale: {},
    withText: true
};


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.createSelect = exports.createNumberInput = exports.createElement = void 0;
function createElement(tag, className, content) {
    const e = window.document.createElement(tag);
    className = className || "";
    content = content || "";
    e.className = className;
    if (content !== undefined)
        e.textContent = content;
    return e;
}
exports.createElement = createElement;
function createNumberInput(inputClassName, opts) {
    const wrapper = createElement("div", "input-wrapper"), numInput = createElement("input", inputClassName);
    if (navigator.userAgent.indexOf("MSIE 9.0") === -1) {
        numInput.type = "number";
    }
    else {
        numInput.type = "text";
    }
    if (opts !== undefined)
        for (const key in opts)
            numInput.setAttribute(key, opts[key]);
    wrapper.appendChild(numInput);
    return wrapper;
}
exports.createNumberInput = createNumberInput;
function createSelect(inputClassName, opts) {
    const wrapper = createElement("div", "select-wrapper"), numInput = createElement("select", inputClassName);
    if (opts !== undefined)
        for (const key in opts)
            numInput.setAttribute(key, opts[key]);
    wrapper.appendChild(numInput);
    return wrapper;
}
exports.createSelect = createSelect;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ })
/******/ ]);
//# sourceMappingURL=currency-converter.map
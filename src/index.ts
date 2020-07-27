import {CurrencyData, defaults as defaultOptions, HookKey, InstanceCurrencyData, Options,} from "./types/options";
import {CurrencyConverterFn, Instance, InstanceElements} from "./types/instance";
import {createElement, createNumberInput, createSelect} from "./utils/dom";

function CurrencyConverterInstance(
    element: HTMLElement,
    instanceConfig?: Options | {}
): Instance {
    const self: Instance = {
        _bind: bind,
        _createElement: createElement,
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
    } as Instance;

    self._handlers = [];

    let _currencyData: CurrencyData = {};
    let _wrapperElm: HTMLElement | null = null;
    let _currencyTextElm: HTMLElement | null = null;

    /**
     * Initialization
     */
    function init(): void {
        self.element = element;
        self.config = parseConfig();

        self._data.from.currency = self.config.fromCurrency;
        self._data.to.currency = self.config.toCurrency;

        buildOut();
        if (self?.config?.currencyData) {
            parseAndLoadCurrencyData(self.config.currencyData);
        } else {
            fetchCurrencyData().then((data: any) => {
                parseAndLoadCurrencyData(data);
            });
        }

        bindEvents();

        triggerEvent("onReady");
    }

    /**
     * Parses the configuration options
     */
    function parseConfig(): Options {
        const userConfig: any = {...(instanceConfig || {})};

        if ('locale' in userConfig) {
            userConfig.locale = {...defaultOptions.locale, ...userConfig.locale}
        }

        if ('precision' in userConfig && isNaN(userConfig.precision)) {
            delete userConfig.precision;
        }

        return {
            ...defaultOptions,
            ...(userConfig),
        };
    }

    /**
     * Gets locale string
     *
     * @param key
     *
     * @return {String} key to be localized
     */
    function getLocale(key: string): string {
        if (self?.config?.locale && key in self.config.locale) {
            return self.config.locale[key];
        }

        return key;
    }

    /**
     * Build outs the layout
     */
    function buildOut(): void {
        const config: Options = self.config;

        _wrapperElm = createElement('div',
            ('currency-converter' + (typeof config.wrapperClass === 'string' ? ` ${config.wrapperClass}` : '')));

        const fromGroup: HTMLElement = createElement('div', 'from-group');
        const fromLabel: HTMLElement = createElement('label', '', getLocale('From'));
        const fromAmountElm: HTMLElement = createNumberInput(
            ('input-from-amount' + (typeof config.inputFromAmountClass === 'string' ? ` ${config.inputFromAmountClass}` : ''))
        );
        const fromCurrencyElm: HTMLElement = createSelect(
            ('select-from-currency' + (typeof config.inputFromCurrencyClass === 'string' ? ` ${config.inputFromCurrencyClass}` : ''))
        ) as HTMLInputElement;

        fromGroup.appendChild(fromLabel);
        fromGroup.appendChild(fromAmountElm);
        fromGroup.appendChild(fromCurrencyElm);

        const toGroup: HTMLElement = createElement('div', 'to-group');
        const toLabel: HTMLElement = createElement('label', '', getLocale('To'));
        const toAmountElm: HTMLElement = createNumberInput(
            ('input-to-amount' + (typeof config.inputToAmountClass === 'string' ? ` ${config.inputToAmountClass}` : ''))
        );
        const toCurrencyElm = createSelect(
            ('select-to-currency' + (typeof config.inputToCurrencyClass === 'string' ? ` ${config.inputToCurrencyClass}` : ''))
        );

        toGroup.appendChild(toLabel);
        toGroup.appendChild(toAmountElm);
        toGroup.appendChild(toCurrencyElm);

        const containerElm = createElement('div', 'currency-converter-container');

        containerElm.appendChild(fromGroup);
        containerElm.appendChild(toGroup);
        _wrapperElm.appendChild(containerElm);

        if (config.withText) {
            _currencyTextElm = createElement('div', 'currency-text');
            _wrapperElm.appendChild(_currencyTextElm);
        }

        self.element.appendChild(_wrapperElm);

        self._elms = {
            fromAmount: fromAmountElm.getElementsByTagName("input")[0] as HTMLInputElement,
            fromCurrency: fromCurrencyElm.getElementsByTagName("select")[0] as HTMLSelectElement,
            toAmount: toAmountElm.getElementsByTagName("input")[0] as HTMLInputElement,
            toCurrency: toCurrencyElm.getElementsByTagName("select")[0] as HTMLSelectElement,
        };

        self._elms.fromAmount.value = !isNaN(config.baseAmount) ? config.baseAmount.toString() : '1';
    }

    /**
     * Fetches currency data from api
     *
     * @return Promise
     */
    function fetchCurrencyData(): Promise<any> {
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

    /**
     * Parses the currency data and loads currency to select elements
     *
     * @param {object} data
     */
    function parseAndLoadCurrencyData(data: object): void {
        parseCurrencyData(data);
        loadCurrencyData();
    }

    /**
     * Parses currency data
     *
     * @param data
     */
    function parseCurrencyData(data: any): void {
        if (data?.rates && data?.base) {
            _currencyData = {...data.rates, ...{[data.base]: 1}} as CurrencyData;
        } else if (data?.rates) {
            _currencyData = {...data.rates} as CurrencyData;
        } else {
            _currencyData = data as CurrencyData;
        }
    }

    /**
     * Loads currency data in to select elements
     */
    function loadCurrencyData() {
        if (!_currencyData) {
            return;
        }

        const elms: InstanceElements | undefined = self._elms;
        if (!elms || !elms.fromCurrency || !elms.toCurrency) {
            return;
        }

        elms.fromCurrency.innerHTML = '';
        elms.toCurrency.innerHTML = ''

        const currencyArr: string[] = Object.keys(_currencyData).sort();
        let currency: string;
        for (currency of currencyArr) {
            const optionElm: HTMLElement = createElement('option', '', getLocale(currency));
            optionElm.setAttribute('value', currency);

            elms.fromCurrency.appendChild(optionElm);
            elms.toCurrency.appendChild(optionElm.cloneNode(true));
        }

        const data: InstanceCurrencyData = self._data;
        if (data.from.currency && data.from.currency in _currencyData) {
            elms.fromCurrency.value = data.from.currency;
        } else {
            if (currencyArr.length) {
                elms.fromCurrency.value = currencyArr[0];
            } else {
                elms.fromCurrency.value = '';
            }
        }

        if (data.to.currency && data.to.currency in _currencyData) {
            elms.toCurrency.value = data.to.currency;
        } else {
            if (currencyArr.length) {
                elms.toCurrency.value = currencyArr[0];
            } else {
                elms.toCurrency.value = '';
            }
        }

        onCurrencyChange();
    }

    /**
     * Rounds of the number
     *
     * @param {Number} value
     * @param {Number} precision
     *
     * @return number
     */
    function round(value: number, precision: number): number {
        const multiplier: number = Math.pow(10, precision || 0);
        return Math.round(value * multiplier) / multiplier;
    }

    /**
     * Converts from amount to to amount
     *
     * @param {Boolean} bNoTrigger
     */
    function convertFrom(bNoTrigger?: boolean): void {
        const elms: InstanceElements | null = self._elms || null;
        if (elms && elms.fromAmount && elms.fromCurrency && elms.toAmount && elms.toCurrency) {
            const data: any = {
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
                    const fromRate: number = parseFloat(_currencyData[data.from.currency].toString());
                    const toRate: number = parseFloat(_currencyData[data.to.currency].toString());

                    if (fromRate && toRate) {
                        const fromAMount: number = parseFloat(data.from.amount);
                        data.to.amount = round(fromAMount * (toRate / fromRate), self.config.precision);
                    }
                }
            }

            elms.toAmount.value = !isNaN(data.to.amount) ? data.to.amount : '';

            setData(data, bNoTrigger);
        }
    }

    /**
     * Converts to amount to from amount
     *
     * @param {Boolean} bNoTrigger
     */
    function convertTo(bNoTrigger?: boolean) {
        const elms: InstanceElements | null = self._elms || null;
        if (elms && elms.fromAmount && elms.fromCurrency && elms.toAmount && elms.toCurrency) {

            const data: any = {
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
                    const fromRate: number = parseFloat(_currencyData[data.from.currency].toString());
                    const toRate: number = parseFloat(_currencyData[data.to.currency].toString());

                    if (fromRate && toRate) {
                        const toAmount: number = parseFloat(data.to.amount);
                        data.from.amount = round(toAmount * (fromRate / toRate), self.config.precision);
                    }
                }
            }

            elms.fromAmount.value = !isNaN(data.from.amount) ? data.from.amount : '';

            setData(data, bNoTrigger);
        }
    }

    /**
     * Sets data and triggers change event
     *
     * @param {InstanceCurrencyData} data
     * @param {Boolean} bNoTrigger
     */
    function setData(data: InstanceCurrencyData, bNoTrigger?: boolean) {
        self._data = data;

        if (!bNoTrigger) {
            if (typeof self?.config?.onChange === 'function') {
                self.config.onChange(data);
            }

            triggerEvent('onChange', data);
        }
    }

    /**
     * Gets current data
     *
     * @return InstanceCurrencyData
     */
    function getData(): InstanceCurrencyData {
        return self._data;
    }

    /**
     * Filters input amount data
     *
     * @param {String} value
     */
    function inputFilter(value: string) {
        return /^-?\d*[.,]?\d*$/.test(value);
    }

    /**
     * Input event on input elements
     *
     * @param {KeyboardEvent} event
     */
    function onInputEvent(event: KeyboardEvent): void {
        const target: HTMLInputElement = event.target as HTMLInputElement;
        if (inputFilter(target.value)) {
            target.oldValue = target.value;
            target.oldSelectionStart = target.selectionStart;
            target.oldSelectionEnd = target.selectionEnd;
        } else if (target.hasOwnProperty("oldValue")) {
            target.value = target.oldValue || '';
            target.setSelectionRange(target.oldSelectionStart || 0, target.oldSelectionEnd || 0);
        } else {
            target.value = "";
        }
    }

    /**
     * Triggered when currency is changed
     */
    function onCurrencyChange(): void {
        convertFrom();
        showCurrencyText();
    }

    /**
     * Shows currency text
     */
    function showCurrencyText() {
        if (self.config.withText && _currencyTextElm && self._data && _currencyData) {
            const data: InstanceCurrencyData = self._data;
            if (data?.from?.currency && data?.to?.currency && data.from.currency in _currencyData && data.to.currency in _currencyData) {
                _currencyTextElm.innerHTML = '';
                const fromRate: number = parseFloat(_currencyData[data.from.currency].toString());
                const toRate: number = parseFloat(_currencyData[data.to.currency].toString());
                const rate: number = round(toRate / fromRate, self.config.precision);
                const fromCurrency: string = getLocale(data.from.currency);
                const toCurrency: string = getLocale(data.to.currency);

                _currencyTextElm.appendChild(
                    createElement('span', 'from-amount-text', '1')
                );
                _currencyTextElm.appendChild(
                    document.createTextNode(' ')
                );
                _currencyTextElm.appendChild(
                    createElement('span', 'from-currency-text', fromCurrency)
                );
                _currencyTextElm.appendChild(
                    document.createTextNode(' = ')
                );
                _currencyTextElm.appendChild(
                    createElement('span', 'to-amount-text', rate.toString())
                );
                _currencyTextElm.appendChild(
                    document.createTextNode(' ')
                );
                _currencyTextElm.appendChild(
                    createElement('span', 'to-currency-text', toCurrency)
                );
            }
        }
    }

    /**
     * Essentially addEventListener + tracking
     * @param {Element} element the element to addEventListener to
     * @param {String} event the event name
     * @param {Function} handler the event handler
     * @param {Object} options for the event
     */
    function bind<E extends Element | Window | Document>(
        element: E | E[],
        event: string | string[],
        handler: (e?: any) => void,
        options?: object
    ): void {
        if (event instanceof Array)
            return event.forEach((ev) => bind(element, ev, handler, options));

        if (element instanceof Array)
            return element.forEach((el) => bind(el, event, handler, options));

        element.addEventListener(event, handler, options);
        self._handlers.push({
            element: element as Element,
            event,
            handler,
            options,
        });
    }

    /**
     * Binds events to elements
     */
    function bindEvents(): void {
        const elms: InstanceElements | undefined = self._elms;
        if (elms && elms.fromAmount && elms.fromCurrency && elms.toAmount && elms.toCurrency) {
            bind(elms.fromAmount, ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"], onInputEvent);
            bind(elms.fromAmount, ["change", "keyup"], () => convertFrom());

            bind(elms.fromCurrency, "change", () => onCurrencyChange());

            bind(elms.toAmount, ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"], onInputEvent);
            bind(elms.toAmount, ["change", "keyup"], () => convertTo());

            bind(elms.toCurrency, "change", () => onCurrencyChange());
        }
    }

    /**
     * Triggers the event
     *
     * @param {HookKey} event
     * @param data
     */
    function triggerEvent(event: HookKey, data?: any) {
        const e = data ? new CustomEvent(event, data) : new CustomEvent(event);
        e.initEvent(name, true, true);

        self.element.dispatchEvent(e);
    }

    /**
     * Destroys the plugin
     */
    function destroy(): void {
        if (self.config !== undefined) triggerEvent("onDestroy");

        for (let i = self._handlers.length; i--;) {
            const h = self._handlers[i];
            h.element.removeEventListener(
                h.event,
                h.handler as EventListener,
                h.options
            );
        }

        self._handlers = [];

        if (_wrapperElm) {
            _wrapperElm.remove();
        }
    }

    /**
     * Updates the currency data
     *
     * @param data
     */
    function updateCurrencyData(data: any): void {
        parseAndLoadCurrencyData(data);
    }

    /**
     * Sets the input from amount
     *
     * @param {Number} amount
     */
    function seAmount(amount: number): void {
        if (self?._elms?.fromAmount) {
            const input = amount.toString();
            if (inputFilter(input)) {
                self._elms.fromAmount.value = input;
                convertFrom();
            }
        }
    }

    /**
     * Sets the input from currency
     *
     * @param {String} currency
     */
    function setCurrency(currency: string): void {
        if (self?._elms?.fromAmount) {
            if (currency in _currencyData) {
                self._elms.fromCurrency.value = currency;
                onCurrencyChange();
            }
        }
    }

    init();

    return self;
}

/* istanbul ignore next */
function _currencyConverter(
    nodeList: ArrayLike<Node>,
    config?: Options
): Instance | Instance[] {
    // static list
    const nodes = Array.prototype.slice
        .call(nodeList)
        .filter((x) => x instanceof HTMLElement) as HTMLElement[];

    let instances: Instance[] = [];
    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        try {
            if (node.getAttribute("data-cc-omit") !== null) continue;

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
        } catch (e) {
            console.error(e);
        }
    }

    return instances.length === 1 ? instances[0] : instances;
}

if (
    typeof HTMLElement !== "undefined" &&
    typeof HTMLCollection !== "undefined" &&
    typeof NodeList !== "undefined"
) {
    // browser env
    HTMLCollection.prototype.currencyConverter = NodeList.prototype.currencyConverter = function (
        config?: Options
    ) {
        return _currencyConverter(this, config);
    };

    HTMLElement.prototype.currencyConverter = function (config?: Options) {
        return _currencyConverter([this], config) as Instance;
    };
}

const currencyConverter = function (
    selector: ArrayLike<Node> | Node | string,
    config?: Options
) {
    if (typeof selector === "string") {
        return _currencyConverter(window.document.querySelectorAll(selector), config);
    } else if (selector instanceof Node) {
        return _currencyConverter([selector], config);
    } else {
        return _currencyConverter(selector, config);
    }
} as CurrencyConverterFn;

if (typeof window !== "undefined") {
    window.currencyConverter = currencyConverter;
}

export default currencyConverter;

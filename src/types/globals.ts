import {Options} from "./options";
import {CurrencyConverterFn, Instance} from "./instance";

declare global {
    interface HTMLElement {
        currencyConverter: (config?: Options) => Instance;
        _currencyConverter?: Instance;
    }

    interface HTMLInputElement {
        oldValue?: string;
        oldSelectionStart?: number | null;
        oldSelectionEnd?: number | null;
    }

    interface NodeList {
        currencyConverter: (config?: Options) => Instance | Instance[];
    }

    interface HTMLCollection {
        currencyConverter: (config?: Options) => Instance | Instance[];
    }

    interface Window {
        currencyConverter: CurrencyConverterFn;
    }
}

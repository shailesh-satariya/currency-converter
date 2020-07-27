import {CurrencyConverterFn, Instance as _Instance, Plugin as _Plugin} from "./types/instance";
import {Options as _Options} from "./types/options";

declare var currencyConverter: CurrencyConverterFn;

declare namespace currencyConverter {
    export type Instance = _Instance;

    export namespace Options {
        export type Options = _Options;

        export type Plugin = _Plugin;
    }
}

export default currencyConverter;

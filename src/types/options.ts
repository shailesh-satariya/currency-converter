export interface Options {
    wrapperClass?: string;
    fromCurrency: string;
    toCurrency: string;
    baseAmount: number;
    currencyApi: string;
    withText: boolean;

    locale: Record<string, string>;

    precision: number;

    onChange?: (data: InstanceCurrencyData) => void;

    currencyData?: CurrencyData | {
        base: string;
        date?: string;
        rates: CurrencyData;
    };

    inputFromAmountClass?: string;
    inputFromCurrencyClass?: string;
    inputToAmountClass?: string;
    inputToCurrencyClass?: string;
}

export interface InstanceCurrencyData {
    from: {
        amount: number | null,
        currency: string | null,
    },
    to: {
        amount: number | null,
        currency: string | null,
    }
}

export interface CurrencyData {
    [key: string]: number
}

export const defaults: Options = {
    fromCurrency: 'EUR',
    toCurrency: 'USD',
    baseAmount: 100,
    currencyApi: `https://api.exchangeratesapi.io/latest`,

    precision: 4,

    locale: {},

    withText: true
}

export type HookKey =
    | "onChange"
    | "onDestroy"
    | "onReady";

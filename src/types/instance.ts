import {InstanceCurrencyData, Options} from "./options";

export interface Elements {
    element: HTMLElement;

    config: Options;

    destroy: () => void;

    _handlers: {
        event: string;
        element: Element;
        handler: (e?: Event) => void;
        options?: { capture?: boolean };
    }[];

    _data: InstanceCurrencyData;

    _bind: <E extends Element>(
        element: E | E[],
        event: string | string[],
        handler: (e?: any) => void
    ) => void;

    _createElement: <E extends HTMLElement>(
        tag: keyof HTMLElementTagNameMap,
        className: string,
        content?: string
    ) => E;

    _elms?: InstanceElements;

    getData: () => InstanceCurrencyData;

    setAmount: (amount: number) => void;

    setCurrency: (currency: string) => void;

    updateCurrencyData: (data: any) => void;
}

export type Instance = Elements;

export interface InstanceElements {
    fromAmount: HTMLInputElement;
    fromCurrency: HTMLSelectElement;
    toAmount: HTMLInputElement;
    toCurrency: HTMLSelectElement;
}

export interface CurrencyConverterFn {
    (selector: Node, config?: Options): Instance;

    (selector: ArrayLike<Node>, config?: Options): Instance[];

    (selector: string, config?: Options): Instance | Instance[];
}

export type Plugin<E = {}> = (fp: Instance & E) => Options;

export function createElement<T extends HTMLElement>(
    tag: keyof HTMLElementTagNameMap,
    className: string,
    content?: string
): T {
    const e = window.document.createElement(tag) as T;
    className = className || "";
    content = content || "";

    e.className = className;

    if (content !== undefined) e.textContent = content;

    return e;
}

export function createNumberInput(
    inputClassName: string,
    opts?: Record<string, any>
) {
    const wrapper = createElement<HTMLDivElement>("div", "input-wrapper"),
        numInput = createElement<HTMLInputElement>(
            "input", inputClassName
        );

    if (navigator.userAgent.indexOf("MSIE 9.0") === -1) {
        numInput.type = "number";
    } else {
        numInput.type = "text";
    }

    if (opts !== undefined)
        for (const key in opts) numInput.setAttribute(key, opts[key]);

    wrapper.appendChild(numInput);

    return wrapper;
}

export function createSelect(
    inputClassName: string,
    opts?: Record<string, any>
) {
    const wrapper = createElement<HTMLDivElement>("div", "select-wrapper"),
        numInput = createElement<HTMLInputElement>(
            "select", inputClassName
        );

    if (opts !== undefined)
        for (const key in opts) numInput.setAttribute(key, opts[key]);

    wrapper.appendChild(numInput);

    return wrapper;
}

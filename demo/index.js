document.addEventListener("DOMContentLoaded", function () {
    currencyConverter("#example-1");

    currencyConverter("#example-2", {
        currencyData: {
            AUD: 1.6376,
            BGN: 1.9558,
            BRL: 6.0777,
            EUR: 1
        },
        toCurrency: "BGN"
    });

    currencyConverter("#example-3", {
        withText: false
    });

    currencyConverter("#example-4", {
        baseAmount: 10,
        fromCurrency: "INR",
        toCurrency: "JPY",
        precision: 2,
        locale: {
            From: "Von",
            To: "Zu",
            INR: "Indian Rupee",
            JPY: "Japanese Yen"
        }
    });
});

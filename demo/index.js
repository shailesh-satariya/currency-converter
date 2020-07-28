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

    const elm = document.getElementById( 'example-4' );
    const cc = currencyConverter(elm, {
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


    // Bind the events
    elm.addEventListener( 'onReady', function ( event ) {
        // Set amount
        cc.setAmount( 500 );
    } );

    elm.addEventListener( 'onChange', function ( event ) {
        console.log( event.data );
    } );
});

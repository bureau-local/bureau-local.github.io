(function() {
    if (!parent || !parent.postMessage || !name) {
        return;
    }

    var addEventListener = function(event, func) {
        if (window.addEventListener){
            window.addEventListener(event, func);
        }
        else {
            window.attachEvent('onload', func);
        }
    };

    var expectedHeight;

    // The loop tries every 100 milliseconds until it sees that the frame is the right height
    var tryPostMessageHeight = function () {
        // window.innerHeight originally instead of screen height
        if (screen.height !== expectedHeight) {
            console.log(window.innerHeight, expectedHeight);
            parent.postMessage({
                name: name,
                documentHeight: expectedHeight
            }, "*");
            setTimeout(tryPostMessageHeight, 100);
        }
    }

    // We're setting what the height should be with expectedHeight
    // and trygering the loop
    var postMessageHeight = function() {
        expectedHeight = document.body.scrollHeight;
        tryPostMessageHeight();
    }

    addEventListener('load', function() {
        postMessageHeight();
    });

    addEventListener('resize', function() {
        postMessageHeight();
    });
})();
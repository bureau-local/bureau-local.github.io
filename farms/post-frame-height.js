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

    var postMessageHeight = function() {
        parent.postMessage({
            name: name,
            documentHeight: document.body.scrollHeight
        }, "*");
    }

    addEventListener('load', function() {
        postMessageHeight();
    });

    addEventListener('resize', function() {
        postMessageHeight();
    });
})();
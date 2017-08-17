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
        console.log(document.body.scrollHeight);
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
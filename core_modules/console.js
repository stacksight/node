var fs = require('fs');

module.exports = function(sts) {

    if (!sts.features.logs) return;

    sts.features.logs.forEach(function(method) {

        var oldMethod = console[method];
        console[method] = function() {
            var text = '';

            for (var index in arguments) {
                if(typeof arguments[index] == 'object') {
                    arguments[index] = JSON.stringify(arguments[index],null,2);
                }
                text += arguments[index];
            }
           
            sts.index('logs/log', {
                method: method,
                content: text
            });

            oldMethod.apply(console, arguments);
        };
    });
}
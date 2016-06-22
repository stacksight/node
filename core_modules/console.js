var fs = require('fs');

module.exports = function(sts) {
/*
    function writeErrorLog(text) {
        fs.existsSync('logs') ? '' : fs.mkdir('logs');
        fs.appendFile('logs/error.log', text, function() {});
    }
*/
    ['log', 'warn', 'error', 'info', 'dir'].forEach(function(method) {
        var oldMethod = console[method];
        console[method] = function() {
            var text = '';

            for (var index in arguments) {
                if(typeof arguments[index] == 'object') {
                    arguments[index] = JSON.stringify(arguments[index],null,2);
                }
                text += arguments[index];
                // if (typeof(arguments[index]) === 'string' && arguments[index].indexOf('%') === 0) continue;
                // text +=  ((method === 'dir') ? JSON.stringify(arguments[index]) : (arguments[index]) ? arguments[index] : '') + ' ';
            }
            // if (arguments[0] === '%s: %dms') text += 'ms';
           
            sts.index('logs/log', {
                method: method,
                content: text
            });

            // if (method == 'error') writeErrorLog([new Date().toISOString()] + ' ' + text + '\n');
            oldMethod.apply(console, arguments);
        };
    });
}
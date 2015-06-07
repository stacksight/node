'use strict';

module.exports = function(StackSight, sts) {

    function Sessions() {
        // this.git = 'http://......',
        // this.
    };

    Sessions.prototype.up = function() {
        sts.index({
            index: 'sessions',
            type: 'sessions',
            action: 'up'
        });
    };

    function exitHandler(options, err) {
        sts.index({
            index: 'sessions',
            type: 'sessions',
            action: 'down',
            err: err
        });
        setTimeout(function() {
            // console.log('##########################################');
            if (options.cleanup) console.log('clean');
            if (err) console.log(err.stack);
            if (options.exit) process.exit();
        }, 100);
    }

    //do something when app is closing
    process.on('exit', exitHandler.bind(null,{cleanup:true}));
    process.on('error', exitHandler.bind(null,{cleanup:true}));


    //catches ctrl+c event
    process.on('SIGINT', exitHandler.bind(null, {exit:true}));

    //catches uncaught exceptions
    process.on('uncaughtException', exitHandler.bind(null, {exit:true}));

    StackSight.prototype.sessions = new Sessions();
};
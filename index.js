'use strict';


var request = require('request');
var stackSight;

function StackSight(options) {

    this.apiKey = options.apiKey;
    this.appId = options.appId;
    this.app = options.app;
    this.disable = options.disable || false;
    this.features = options.features || {};

    try {
        require('meanio');
        this.platform = 'mean';
    } catch (err) {
        this.platform = 'nodejs';
    }
}

StackSight.prototype.index = function(index, data) {

    if (this.disable) return;

    data.platform = this.platform;
    data.token = this.apiKey;
    data.appId = this.appId;
    data.created = new Date();

    var mapiOpt = {
        uri: 'https://api.stacksight.io/v0.1/index/' + index,
        method: 'POST',
        form: data,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    };

    request(mapiOpt, function(err, res, body) {});

};


module.exports = function(options) {

    options.features = options.features || {};

    var features = {
        logs: ['log', 'warn', 'error', 'info', 'dir'],
        updates: true,
        sessions: true,
        events: true,
        requests: true
    };

    for (var index in features) {
        options.features[index] = (options.features[index] === false) ? false : (options.features[index] || features[index]);
    };

    if (!stackSight) {

        if (!options.apiKey) throw 'StackSight Error: apiKey not supplied';
        if (!options.appId) throw 'StackSight Error: appId not supplied';

        stackSight = new StackSight(options);
        (require('./core_modules/console')(stackSight));
        (require('./core_modules/events')(StackSight, stackSight));

        if (options.features.sessions)
            (require('./core_modules/sessions')(StackSight, stackSight));
        if (options.features.updates)
            (require('./core_modules/updates')(stackSight));

        if (stackSight.app && options.features.requests)
            (require('./core_modules/requests')(stackSight));
    }

    return stackSight;
};

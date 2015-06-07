'use strict';


var os = require('os');
var request = require('request');
var stackSight;
var tried = false;


function StackSight(options) {
    var options = options || {};
    var allow = options.user && options.appId ? true : false;
    this.user = options.user || this.user;
    this.appId = options.appId || this.appId;
    this.app = options.app || this.app;
    this.allow = options.allow || allow;
}

StackSight.prototype.index = function(data) {

    if (!this.allow) return;

    data.token = this.user;
    data.created = new Date();
    data.appId = this.appId;
    data.loadavg = os.loadavg();
    data.freemem = os.freemem();
    data.totalmem = os.totalmem();
    data.cpus = os.cpus();

    var mapiOpt = {
        uri: 'https://network.mean.io/api/v0.1/index/' + data.index + '/' + data.type,
        method: 'POST',
        form: data,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    };

    delete mapiOpt.form.index;
    delete mapiOpt.form.type;

    request(mapiOpt, function(error, response, body) {});

};


module.exports = function(options) {

    if (!stackSight) {
        stackSight = new StackSight(options);
        (require('./core_modules/events')(StackSight, stackSight));
        (require('./core_modules/console')(stackSight));
        (require('./core_modules/sessions')(StackSight, stackSight));
    
        if (stackSight.app)
            (require('./core_modules/requests')(stackSight));
    }

    return stackSight;
};


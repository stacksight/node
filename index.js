'use strict';


var request = require('request');
var stackSight;


function StackSight(options) {
    
    this.apiKey = options.apiKey;
    this.appId = options.appId;
    this.app = options.app;

    try {
        require('meanio');
        this.platform = 'mean';
    } catch (err) {
        this.platform = 'nodejs';
    }
}

StackSight.prototype.index = function(index, data) {

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

    request(mapiOpt, function(err, res, body) {
        process.stdout.write(JSON.stringify(mapiOpt,null,2))
    });

};


module.exports = function(options) {

    if (!stackSight) {
        
        if(!options.apiKey) throw 'StackSight Error: apiKey not supplied';
        if(!options.appId) throw 'StackSight Error: appId not supplied';
        
        stackSight = new StackSight(options);
        (require('./core_modules/console')(stackSight));
        (require('./core_modules/events')(StackSight, stackSight));
        (require('./core_modules/sessions')(StackSight, stackSight));
        (require('./core_modules/updates')(stackSight));
    
        if (stackSight.app)
            (require('./core_modules/requests')(stackSight));
    }

    return stackSight;
};
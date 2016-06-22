'use strict';

module.exports = function(sts) {

  var options = {
    skip: function(req, res) {

      var data = {
                type: 'request',
                method: req.method,
                content: req.originalUrl,
                status: res.statusCode
            };

            sts.index('logs/log', data);
    }
  };

    sts.app.use(require('morgan')('dev', options));
};
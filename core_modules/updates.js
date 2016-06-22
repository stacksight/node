'use strict';

var child = require('child_process');

module.exports = function(sts) {


  (function update(){

    child.exec('cd ' + require.main.paths[0].slice(0,-13) + ' && npm outdated --json --long', function(err, stdout, stderr) {

      var interval = 24*60*60*1000;
      setTimeout(update, Math.ceil(Date.now()/interval)*interval - Date.now());

      if (err || stderr) {
        console.error(err || stderr);
      }

      var updates = JSON.parse(String(stdout));
      var data = new Array();

      for (var p in updates) {
        var info = JSON.parse(String(child.execFileSync('npm', ['info', p, '--json']))); // not synchronus. may try via Object.keys and forEach loop.

        data.push({
          title:           p                                                                ,
          release_ts:      new Date(info.time[updates[p].latest]).getTime()/1000 || ''      ,
          current_version: updates[p].current || 'not installed'                            ,
          latest_version:  updates[p].latest                                                ,
          type:            updates[p].type                                                  ,
          status:          updates[p].wanted == updates[p].current ? 5 : 1                  ,
          description:     info.description                                                 ,
          release_link:    info.homepage                                                    ,
          download_link:   (info.repository.url || info.homepage).match(/http.*/)[0]
        });

      }

      sts.index('updates/update', {data: data});

    })

  })()

};


'use strict';

module.exports = function(StackSight, sts) {

    StackSight.prototype.event = function(data) {

        if (!sts.features.events) return;

        var data = {
            action: data.action,
            type: data.type, // 'post', 'taxonomy', 'user', 'settings' or 'file'.
            subtype: data.subtype, // 'page' or 'image'.
            id: data.id,
            name: data.name,
            desc: data.desc,
            url: data.url,
            data: data.data,
            user: data.user,
            icon: data.icon || 'fa-bars',
            icon_col: data.icon_col || '#176583'
        };

        sts.index('events/event', data);

    };
};

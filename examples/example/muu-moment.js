define(['moment'], function(moment) {
    "use strict";

    return function(muu) {
        muu.registerDirective('moment', '<time aria-live datetime="{{machine}}">{{human}}</time>', function(self) {
            var update = function() {
                self.update({
                    machine: moment().format(),
                    human: moment().format('llll')
                });
            };

            update();
            var intervalID = window.setInterval(update, 60000);

            return function() {
                window.clearInterval(intervalID);
            };
        })
    };
});

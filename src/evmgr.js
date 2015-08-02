define([], function() {
    "use strict";

    /**
     * Generic event handler with on, off and trigger.
     */
    return function() {
        var self = this;

        var handlers = {};
        var nextID = 0;

        var getNextID = function() {
            return nextID++;
        }

        self.on = function(eventName, handler) {
            handlers[eventName] = handlers[eventName] || {};
            var id = getNextID();
            handlers[eventName][id] = handler;

            return function() {
                self.off(eventName, id);
            };
        }

        self.off = function(eventName, id) {
            if (eventName === void 0) {
                handlers = {};
            } else if (id === void 0) {
                delete handlers[eventName];
            } else {
                delete handlers[eventName][id];
            }
        }

        self.trigger = function(eventName, arg) {
            for (var id in handlers[eventName]) {
                if (handlers[eventName].hasOwnProperty(id)) {
                    var handler = handlers[eventName][id];
                    handler(arg);
                }
            }
        }
    }
});

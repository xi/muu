/**
 * This module gives access to the following objects:
 *
 * -   `Registry` - {@link Registry}
 * -   `$` - {@link module:muu-dom-helpers}
 * -   `$location` - {@link module:muu-location}
 *
 * @module muu
 */
define(['muu-registry', 'muu-dom-helpers', 'muu-location'], function(Registry, $, $location) {
    "use strict";

    var module = {};

    module.Registry = Registry;
    module.$ = $;
    module.$location = $location;

    return module;
});

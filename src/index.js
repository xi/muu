/**
 * This module gives access to the following objects:
 *
 * -   `Registry` - {@link Registry}
 * -   `$` - {@link module:dom-helpers}
 * -   `$location` - {@link module:location}
 *
 * @module muu
 */
define('muu', ['registry', 'dom-helpers', 'location'], function(Registry, $, $location) {
    "use strict";

    var module = {};

    module.Registry = Registry;
    module.$ = $;
    module.$location = $location;

    return module;
});

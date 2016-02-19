muu offers angular inspired directives, but with a strong focus on simplicity
and modularity rather than performance and completeness.

While this currently is only about directives and data binding, other aspects
of angular may be added later on.

For an introduction to the concepts, see the {@tutorial phonecat} tutorial.

# Getting started

Muu can be installed with bower:

    bower install xi/muu

It can be used either as AMD module or global variable.

See [this
tutorial](https://github.com/xi/muu/blob/master/.doc/tutorials/phonecat.md) for
what you can do once muu is loaded.

## custom builds

Not all parts of muu are required. This repository contains a minimal build
in `dist/muu-core.js`. It requires [lodash](https://lodash.com) and an external
templating system, e.g. [mustache.js](https://github.com/janl/mustache.js):

    var registry = new muu.Registry({
        renderer: Mustache.render
    });

In addition, `muu.$location` is not available.

# history

I have worked a bit with [angular](https://angularjs.org/) and found it to be a
great set of features.  But I always wondered why this *set* is wrapped in a
monolithic framework. Why can't I have `$location` or `$http` on their own?

So I started looking around for more modular, more lightweight solutions for
things I liked about angular. One such thing is [wrapping `XMLHttpRequest` in
native ES6 Promises](https://github.com/wildlyinaccurate/promise-xhr).

Probably the most important aspect of angular is data binding. It gives you a
nice abstraction for all DOM interactions. However, I have some issues with the
way angular does this:

-   There are many new concepts to learn.
-   In order to do dirty-checking, angular needs to be integrated with
    everything that happens on the site.
-   Information from the application to the DOM, information from the DOM to
    the application and events that are triggered by the DOM all are stuffed
    into the `$scope`.

So I started an experiment to create a data binding system that was as minimal
and close to existing standards as possible.

The initial idea was to have a template that is rendered with the data from my
scope. The result is diffed with the existing DOM and a minimal set of changes
is applied. This way, I hoped, you could have data binding with any templating
engine. As it turns out, it is not that simple.

One big issue was that, once the template had been rendered, I had lost the
information about which part of the DOM represented which variable. So having
two-way data binding was near impossible.

As explained above, I had not been to keen about two-way data binding anyway,
so that was not that much of a problem. I just created a second channel to
receive information from the DOM (based on forms) and another one for receiving
events.

For several reason, I also wanted to have directives. Now in angular, you can
use directives, but you don't have to. In my experience, that is the source of
much confusion. So I wrapped all the functionality described above in
directives.

# misc

## Yet another framework?

This is an experiment, not an actual framework for use in production. So the
main objective is to learn something from it.

Then again, this whole thing is so little that it is more of a concept or
methodology than a software. I guess it is ok to use a framework if it is tiny
and does not force you to do everything in a specific way.

## Why the name

I started with "modular angular" which was not very catchy and also too long to
use it as a prefix in code. I somehow stuck with "muu".

I later learned that there is an old Chinese word "muu" that means "emptiness"
which fits quite will with approach of *so little framework that it is
basically a mere methodology rather than code*.

## modularity

I started out using [lodash](https://lodash.com/) for JavaScript helpers,
[jquery](https://jquery.com/) for DOM helpers and
[mustache](mustache.github.io) as templating system. I later switched to custom
code ({@link module:js-helpers}, {@link module:dom-helpers} and {@link
module:template}). But switching back to more stable libraries should be fairly
simple. In the case of templating, you can even select an engine in the {@link
Registry} configuration.

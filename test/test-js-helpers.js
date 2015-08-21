/* global define, describe, it, beforeEach, afterEach, expect, sinon */
define(['muu-js-helpers'], function(_) {
    "use strict";

    var monkeyPatchArray = function(feature, tests) {
        describe('native', function() {
            tests();
        });
        describe('custom', function() {
            var orig = Array.prototype[feature];

            beforeEach(function() {
                delete Array.prototype[feature];
            });

            afterEach(function() {
                Array.prototype[feature] = orig;
            });

            tests();
        });
    };

    function functionDeclaration() {}
    var functionExpression = function() {};

    describe('muuJsHelpers', function() {
        describe('isString', function() {
            it('returns `true` for string', function() {
                expect(_.isString('a')).to.be.ok();
            });

            it('returns `true` for empty string', function() {
                expect(_.isString('')).to.be.ok();
            });

            it('returns `true` for string object', function() {
                expect(_.isString(Object('a'))).to.be.ok();
            });

            it('returns `true` for empty string object', function() {
                expect(_.isString(Object(''))).to.be.ok();
            });

            it('returns `false` for non-strings', function() {
                expect(_.isString()).not.to.be.ok();
                expect(_.isString(0)).not.to.be.ok();
                expect(_.isString(false)).not.to.be.ok();
                expect(_.isString(NaN)).not.to.be.ok();
                expect(_.isString(null)).not.to.be.ok();
                expect(_.isString(undefined)).not.to.be.ok();

                expect(_.isString([1, 2, 3])).not.to.be.ok();
                expect(_.isString(true)).not.to.be.ok();
                expect(_.isString(new Date)).not.to.be.ok();
                expect(_.isString(new Error)).not.to.be.ok();
                expect(_.isString(_)).not.to.be.ok();
                expect(_.isString(functionDeclaration)).not.to.be.ok();
                expect(_.isString(functionExpression)).not.to.be.ok();
                expect(_.isString({ '0': 1, 'length': 1 })).not.to.be.ok();
                expect(_.isString(1)).not.to.be.ok();
                expect(_.isString(/x/)).not.to.be.ok();
            });
        });

        describe('isArray', function() {
            it('returns `true` for arrays', function() {
                expect(_.isArray([1, 2, 3])).to.be.ok();
                expect(_.isArray([])).to.be.ok();
            });

            it('returns `false` for non-arrays', function() {
                expect(_.isArray()).not.to.be.ok();
                expect(_.isArray('')).not.to.be.ok();
                expect(_.isArray(0)).not.to.be.ok();
                expect(_.isArray(false)).not.to.be.ok();
                expect(_.isArray(NaN)).not.to.be.ok();
                expect(_.isArray(null)).not.to.be.ok();
                expect(_.isArray(undefined)).not.to.be.ok();

                expect(_.isArray(true)).not.to.be.ok();
                expect(_.isArray(new Date)).not.to.be.ok();
                expect(_.isArray(new Error)).not.to.be.ok();
                expect(_.isArray(_)).not.to.be.ok();
                expect(_.isString(functionDeclaration)).not.to.be.ok();
                expect(_.isString(functionExpression)).not.to.be.ok();
                expect(_.isArray({ '0': 1, 'length': 1 })).not.to.be.ok();
                expect(_.isArray(1)).not.to.be.ok();
                expect(_.isArray(/x/)).not.to.be.ok();
                expect(_.isArray('a')).not.to.be.ok();
            });
        });

        describe('isFunction', function() {
            it('returns `true` for function declaration', function() {
                expect(_.isFunction(functionDeclaration)).to.be.ok();
            });
            it('returns `true` for function expression', function() {
                expect(_.isFunction(functionExpression)).to.be.ok();
            });
            it('returns `false` for non-functions', function() {
                expect(_.isFunction()).not.to.be.ok();
                expect(_.isFunction('')).not.to.be.ok();
                expect(_.isFunction(0)).not.to.be.ok();
                expect(_.isFunction(false)).not.to.be.ok();
                expect(_.isFunction(NaN)).not.to.be.ok();
                expect(_.isFunction(null)).not.to.be.ok();
                expect(_.isFunction(undefined)).not.to.be.ok();

                expect(_.isFunction([1, 2, 3])).not.to.be.ok();
                expect(_.isFunction(true)).not.to.be.ok();
                expect(_.isFunction(new Date)).not.to.be.ok();
                expect(_.isFunction(new Error)).not.to.be.ok();
                expect(_.isFunction({ 'a': 1 })).not.to.be.ok();
                expect(_.isFunction(1)).not.to.be.ok();
                expect(_.isFunction(/x/)).not.to.be.ok();
                expect(_.isFunction('a')).not.to.be.ok();

                expect(_.isFunction(document.getElementsByTagName('body'))).not.to.be.ok();
            });
        });

        describe('once', function() {
            it ('executes the wrapped function only once', function() {
                var inner = sinon.spy();
                var fn = _.once(inner);

                expect(inner.callCount).to.be(0);
                fn();
                expect(inner.callCount).to.be(1);
                fn();
                expect(inner.callCount).to.be(1);
                fn();
                expect(inner.callCount).to.be(1);
            });
            it ('returns a constant function', function() {
                var inner = sinon.stub().returns(1);
                var fn = _.once(inner);

                expect(fn()).to.equal(1);

                inner.returns(2);
                expect(fn()).to.equal(1);
            });
        });

        describe('indexOf', function() {
            monkeyPatchArray('indexOf', function() {
                it('returns the correct index', function() {
                    expect(_.indexOf([4,6,2,4], 6)).to.equal(1);
                });
                it('returns the first correct index', function() {
                    expect(_.indexOf([4,6,2,4], 4)).to.equal(0);
                });
                it('returns -1 if the item is not in the array', function() {
                    expect(_.indexOf([4,6,2,4], 5)).to.equal(-1);
                });
            });
        });

        describe('forEach', function() {
            monkeyPatchArray('forEach', function() {
                it('executes the function for each item', function() {
                    var items = [1, 2, 3];
                    var results = [];
                    _.forEach(items, function(item) {
                        results.push(item * item);
                    });
                    expect(results).to.eql([1,4,9]);
                });
            });
        });

        describe('map', function() {
            monkeyPatchArray('map', function() {
                it('executes the function for each item', function() {
                    var items = [1, 2, 3];
                    var results = [];
                    _.map(items, function(item) {
                        results.push(item * item);
                    });
                    expect(results).to.eql([1,4,9]);
                });
                it('maps the items to an output array', function() {
                    var items = [1, 2, 3];
                    var results = _.map(items, function(item) {
                        return item * item;
                    });
                    expect(results).to.eql([1,4,9]);
                });
            });
        });

        describe('filter', function() {
            monkeyPatchArray('filter', function() {
                it('includes exactly those items in the result, for which the function is truthy', function() {
                    var items = [1, 2, 3];
                    var results = _.filter(items, function(item) {
                        return item * item < 8;
                    });
                    expect(results).to.eql([1,2]);
                });
            });
        });

        describe('union', function() {
            it('returns the set union of all passed lists', function() {
                var input = [[1,1,2,3], [2,3,4], [4,5,3]];
                expect(_.union(input)).to.eql([1,2,3,4,5]);
            });
        });

        describe('difference', function() {
            it('returns the first without all item from the second list', function() {
                expect(_.difference([1,1,2,3], [3,4])).to.eql([1,1,2]);
            });
        });

        describe('flatten', function() {
            it('returns a flat list from an arbitrarily nested list', function() {
                var input = [
                    [1, 2, 3],
                    [
                        [4, 5],
                        [6]
                    ],
                    7
                ];
                var output = [1, 2, 3, 4, 5, 6, 7];
                expect(_.flatten(input)).to.eql(output);
            });
        });
    });
});

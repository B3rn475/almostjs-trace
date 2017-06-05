// Copyright (c) 2017, the ALMOsT project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by a MIT-style license that can be found in the LICENSE file.
/*jslint node: true, nomen: true*/
"use strict";

var _ = require('lodash'),
    groupToMap = require('./utils').groupToMap,
    createPartialsMap = require('./utils').createPartialsMap;

function withOutput(e) { return e.hasOwnProperty('output'); }
function withoutOutput(e) { return !withOutput(e); }

function Trace(options) {
    if (!(this instanceof Trace)) { return new Trace(options); }

    var all = _.concat(options.skipped, options.executed);

    this.transformer = options.transformer;
    this.model = options.model;
    this.result = options.result;

    this._rule = groupToMap(all, 'rule');
    this._input = groupToMap(all, 'input');
    this._output = groupToMap(options.executed, 'output');
    this._partials = createPartialsMap(this.outputs());
}

Trace.prototype.rules = function (filter) {
    filter = filter || {};

    if (filter.input !== undefined && filter.output !== undefined) {
        return _(this._output.get(filter.output) || [])
            .filter(function (e) {
                return e.input === filter.input;
            })
            .map('rule')
            .value();
    }
    if (filter.input !== undefined) {
        var chain = _(this._input.get(filter.input) || []);
        if (filter.hasOwnProperty('fired')) {
            chain = chain.filter(filter.fired ? withOutput : withoutOutput);
        }
        return chain.map('rule')
            .value();
    }
    if (filter.output !== undefined) {
        return _(this._output.get(filter.output) || [])
            .map('rule')
            .value();
    }
    return Array.from(this._rule.keys());
};

Trace.prototype.inputs = function (filter) {
    filter = filter || {};

    if (filter.rule !== undefined && filter.output !== undefined) {
        return _(this._output.get(filter.output) || [])
            .filter(function (e) {
                return e.rule === filter.rule;
            })
            .map('input')
            .value();
    }
    if (filter.rule !== undefined) {
        var chain = _(this._rule.get(filter.rule) || []);
        if (filter.hasOwnProperty('fired')) {
            chain = chain.filter(filter.fired ? withOutput : withoutOutput);
        }
        return chain.map('input')
            .value();
    }
    if (filter.output !== undefined) {
        return _(this._output.get(filter.output) || [])
            .map('input')
            .value();
    }
    return Array.from(this._input.keys());
};

Trace.prototype.outputs = function (filter) {
    filter = filter || {};

    if (filter.rule !== undefined && filter.input !== undefined) {
        return _(this._input.get(filter.input) || [])
            .filter(function (e) {
                return e.rule === filter.rule && e.hasOwnProperty('output');
            })
            .map('output')
            .value();
    }
    if (filter.rule !== undefined) {
        return _(this._rule.get(filter.rule) || [])
            .filter(function (e) {
                return e.hasOwnProperty('output');
            })
            .map('output')
            .value();
    }
    if (filter.input !== undefined) {
        return _(this._input.get(filter.input) || [])
            .filter(function (e) {
                return e.hasOwnProperty('output');
            })
            .map('output')
            .value();
    }
    return Array.from(this._output.keys());
};

Trace.prototype.partial = function (part) {
    return this._partials.get(part);
};

exports.Trace = Trace;
exports.createTrace = Trace;

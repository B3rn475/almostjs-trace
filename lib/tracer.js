// Copyright (c) 2017, the ALMOsT project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by a MIT-style license that can be found in the LICENSE file.
/*jslint node: true, nomen: true*/
"use strict";

var EventEmitter = require('events'),
    util = require('util'),
    createTrace = require('./trace').createTrace;

function Tracer(transformer) {
    if (!(this instanceof Tracer)) { return new Tracer(transformer); }
    EventEmitter.call(this);
    var self = this,
        current;

    transformer.on('begin', function (model) {
        current = {
            transformer: transformer,
            model: model,
            skipped: [],
            executed: []
        };
    });

    transformer.on('skip', function (rule, input) {
        if (!current) { return; }
        current.skipped.push({
            rule: rule,
            input: input
        });
    });

    transformer.on('execute', function (rule, input, output) {
        if (!current) { return; }
        current.executed.push({
            rule: rule,
            input: input,
            output: output
        });
    });

    transformer.on('end', function (result) {
        if (!current) { return; }
        current.result = result;
        self.emit('trace', createTrace(current));
        current = undefined;
    });
}
util.inherits(Tracer, EventEmitter);

exports.Tracer = Tracer;
exports.createTracer = Tracer;

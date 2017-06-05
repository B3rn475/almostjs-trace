// Copyright (c) 2017, the ALMOsT project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by a MIT-style license that can be found in the LICENSE file.
/*jslint node: true, nomen: true*/
"use strict";

var EventEmitter = require('events'),
    _ = require('lodash'),
    mapRules = require('./rule').mapRules,
    mapReduce = require('./reduce').mapReduce,
    createTransformer = require('almost').createTransformer,
    normalize = require('./traceable').normalize;

function mapTransformer(transformer, events) {
    function mapped(model) {
        events.emit('begin', model);
        var output = transformer(model);
        events.emit('end', output);
        return normalize(output);
    }
    mapped.events = events;
    mapped.on = mapped.events.on.bind(mapped.events);
    return mapped;
}

function createTracedTransformer(rules, reduce) {
    var events = new EventEmitter(),
        mappedRules = mapRules(rules, events),
        mappedReduce = mapReduce(reduce, events),
        transformer = createTransformer(mappedRules, mappedReduce),
        mappedTransformer = mapTransformer(transformer, events);
    mappedTransformer.rules = rules;
    mappedTransformer.reduce = reduce;
    return mappedTransformer;
}

exports.createTracedTransformer = createTracedTransformer;

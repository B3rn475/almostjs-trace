// Copyright (c) 2017, the ALMOsT project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by a MIT-style license that can be found in the LICENSE file.
/*jslint node: true, nomen: true*/
"use strict";

var _ = require('lodash');

var NumberConstructor = Number,
    StringConstructor = String,
    BooleanConstructor = Boolean;

function makeTraceable(element) {
    switch (typeof element) {
    case 'number':
        /*ignore:true */
        return new NumberConstructor(element);
        /*ignore:false */
    case 'string':
        return new StringConstructor(element);
    case 'boolean':
        return new BooleanConstructor(element);
    case 'object':
        if (element === null) {
            return element;
        }
        if (Array.isArray(element)) {
            return _.map(element, makeTraceable);
        }
        return _.mapValues(element, makeTraceable);
    default:
        return element;
    }
}

function normalize(element) {
    switch (typeof element) {
    case 'object':
        if (element === null) {
            return element;
        }
        if (element instanceof Number) {
            return Number(element);
        }
        if (element instanceof String) {
            return String(element);
        }
        if (element instanceof Boolean) {
            return Boolean(element);
        }
        if (Array.isArray(element)) {
            return _.map(element, normalize);
        }
        return _.mapValues(element, normalize);
    default:
        return element;
    }
}

exports.makeTraceable = makeTraceable;
exports.normalize = normalize;

// Copyright (c) 2017, the ALMOsT project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by a MIT-style license that can be found in the LICENSE file.
/*jslint node: true, nomen: true*/
"use strict";

var _ = require('lodash'),
    Map = require('es6-map');

function groupToMap(collection, key) {
    var lookup = new Map(),
        accessor;
    if (typeof key !== 'function') {
        accessor = function (object) {
            return object[key];
        };
    } else {
        accessor = key;
    }
    _.forEach(
        collection,
        function (e) {
            var k = accessor(e);
            if (!lookup.has(k)) {
                lookup.set(k, []);
            }
            lookup.get(k).push(e);
        }
    );
    return lookup;
}

module.exports = groupToMap;

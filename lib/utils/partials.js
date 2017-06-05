// Copyright (c) 2017, the ALMOsT project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by a MIT-style license that can be found in the LICENSE file.
/*jslint node: true, nomen: true*/
"use strict";

var _ = require('lodash'),
    Map = require('es6-map');

function createPartialsMap(objects) {
    var lookup = new Map();
    function step(obj) {
        function next(part) {
            if (typeof part === 'object') {
                lookup.set(part, obj);
                _.forEach(part, next);
            }
        }
        next(obj);
    }
    _.forEach(objects, step);
    return lookup;
}

module.exports = createPartialsMap;

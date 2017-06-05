// Copyright (c) 2017, the ALMOsT project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by a MIT-style license that can be found in the LICENSE file.
/*jslint node: true, nomen: true*/
"use strict";

var _ = require('lodash'),
    createRule = require('almost').createRule,
    makeTraceable = require('./traceable').makeTraceable;

function mapRules(rules, events) {
    function mapRule(rule) {
        return createRule(function (input) {
            var output = rule.check.apply(rule, arguments);
            if (!output) {
                events.emit('skip', rule, input);
            }
            return output;
        }, function (input) {
            var output = makeTraceable(rule.execute.apply(rule, arguments));
            events.emit('execute', rule, input, output);
            return output;
        });
    }
    return {
        model: _.map(rules.model || [], mapRule),
        element: _.map(rules.element || [], mapRule),
        relation: _.map(rules.relation || [], mapRule)
    };
}

exports.mapRules = mapRules;

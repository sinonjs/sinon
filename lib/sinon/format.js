/**
 * Format functions
 *
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2010-2014 Christian Johansen
 */
"use strict";
(function () {

    var formatio = require("formatio");

    function makeApi(sinon) {

        function getFormatioFormatter() {
            var formatter = formatio.configure({
                    quoteStrings: false,
                    limitChildrenCount: 250
                });

            function format() {
                return formatter.ascii.apply(formatter, arguments);
            }

            return format;
        }

        sinon.format = getFormatioFormatter();
        return sinon.format;
    }

    makeApi(require("./util/core"));

}());

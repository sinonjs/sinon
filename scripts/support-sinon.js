"use strict";
/* eslint-disable no-console */

var color = require("../lib/sinon/color");

var output =
    color.green(
        "Love sinon? You can now support the project via the open collective:"
    ) +
    color.white("\n > ") +
    color.cyan(color.bold("https://opencollective.com/sinon/donate\n"));
console.log(output);

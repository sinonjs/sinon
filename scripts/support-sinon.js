"use strict";
/* eslint-disable no-console */

var color = require("../lib/sinon/color");

var output =
    color.green(
        "Have some ❤️  for Sinon? You can support the project via Open Collective:"
    ) +
    color.white("\n > ") +
    color.cyan(color.bold("https://opencollective.com/sinon/donate\n"));
console.log(output);

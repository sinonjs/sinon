"use strict";

const nise = require("nise");
const createApi = require("./create-sinon-api");

module.exports = createApi({ sinonXhrLib: nise });

###
@author Christian Johansen (christian@cjohansen.no)
@license BSD

Copyright (c) 2010-2014 Christian Johansen
###
"use strict"
if typeof require is "function" and typeof module is "object"
  buster = require("../../runner")
  sinon = require("../../../lib/sinon")
buster.testCase "issues",
  setUp: ->
    @sandbox = sinon.sandbox.create()

  tearDown: ->
    @sandbox.restore()

  "#458":
    "on node":
      requiresSupportFor:
        process: typeof process isnt "undefined"

      "stub out fs.readFileSync": ->
        testCase = this
        fs = require("fs")
        stub = undefined
        refute.exception ->
          testCase.sandbox.stub fs, "readFileSync"


#!/usr/bin/env bash
set -eu

$(npm bin)/jscs .
npm test
test/phantom/run.sh

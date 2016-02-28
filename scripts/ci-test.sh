#!/bin/bash
set -eu

# Add our various executables to the path
PATH="$(npm bin):$PATH"

function finish {
    if [ -n "${TRAVIS+1}" ]; then
      echo "TRAVIS detected, skip killing child processes"
    else
      kill $(jobs -pr)
    fi
}

trap finish SIGINT SIGTERM EXIT

echo
echo starting buster-server
buster-server & # fork to a subshell
sleep 4 # takes a while for buster server to start

echo
echo starting phantomjs
phantomjs ./node_modules/buster/script/phantom.js &
sleep 1 # give phantomjs a second to warm up

echo
echo "starting buster-test (source)"
buster-test --config-group coverage

echo
echo "starting buster-test (packaged)"
mkdir -p tmp
./node_modules/.bin/browserify ./test/**/*-test.js ./test/test-helper.js --exclude buster -t browserify-shim -o tmp/testrunner-packaged.js
buster-test --config test/buster-packaged.js

echo
echo "starting buster-test (webworker)"
./build
buster-test --config test/buster-webworker.js

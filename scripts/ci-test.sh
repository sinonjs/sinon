#!/bin/bash
set -eu

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
./node_modules/buster/bin/buster-server & # fork to a subshell
sleep 4 # takes a while for buster server to start

echo
echo starting phantomjs
phantomjs ./node_modules/buster/script/phantom.js &
sleep 1 # give phantomjs a second to warm up

echo
echo "creating test bundle"
mkdir -p tmp
$(npm bin)/browserify $(find ./test -name "*-test.js") > tmp/test-bundle.js

echo
echo "starting buster-test"
./node_modules/buster/bin/buster-test

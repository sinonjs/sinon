#!/usr/bin/env bash
set -eu

function finish {
    if [ -n "${TRAVIS+1}" ]; then
      echo "TRAVIS detected, skip killing child processes"
    else
      kill $(jobs -pr)
    fi
}

trap finish SIGINT SIGTERM EXIT

echo 'Building Sinon'
./build

echo 'Starting buster-server on port 1111'
buster-server --capture-headless  & # this leaks a phantomjs process, need to report this and have buster fix it

sleep 2 #give buster-server 2 seconds to start phantom, or things will not work

echo 'Running unit tests in PhantomJS'
buster-test --config test-buster/buster.js

#!/usr/bin/env bash
set -eu
source ./script/add-node-modules-bin.sh
source ./script/kill-subprocesses.sh

echo 'Starting buster-server on port 1111'
buster-server --capture-headless  & # this leaks a phantomjs process, need to report this and have buster fix it

sleep 2 #give buster-server 2 seconds to start phantom, or things will not work

echo 'Running unit tests in PhantomJS'
buster-test --config test-buster/buster.js

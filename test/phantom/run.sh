#!/usr/bin/env bash
set -eu

source ./script/kill-subprocesses.sh

echo 'Starting webserver on port 8666'
python -m SimpleHTTPServer 8666 &

echo 'Running unit tests in PhantomJS'
phantomjs test/phantom/run-tests-in-phantom.js http://localhost:8666/test/sinon.html

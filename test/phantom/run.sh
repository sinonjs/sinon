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

echo 'Starting webserver on port 8666'
python -m SimpleHTTPServer 8666 &

echo 'Running unit tests in PhantomJS'
phantomjs test/phantom/run-tests-in-phantom.js http://localhost:8666/test/sinon.html

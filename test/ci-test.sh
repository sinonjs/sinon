#!/usr/bin/env bash
set -eu

NODE_VERSSION_INSTALLED=$(node --version | grep 0.*)

echo "NODE_VERSSION_INSTALLED: $NODE_VERSSION_INSTALLED"

if [[ $NODE_VERSSION_INSTALLED == v0.6.* ]] ; then
    echo Skipping JSCS on node 0.6.x
else
    $(npm bin)/jscs .
fi

npm test
test/phantom/run.sh

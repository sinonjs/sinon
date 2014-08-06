#!/usr/bin/env bash
set -eu

npm config set strict-ssl false

# use a more modern npm than ships with 0.8 and 0.6
# in order to avoid problems with old npm not understanding
# version strings like minimatch@^1.0.0
NODE_VERSSION_INSTALLED=$(node --version | grep 0.*)

echo "NODE_VERSSION_INSTALLED: $NODE_VERSSION_INSTALLED"

if [[ $NODE_VERSSION_INSTALLED == v0.6.* ]] ; then
    echo "Updating npm to a newer, 0.6 compatible version"
    npm install -g npm@1.3
elif [[ $NODE_VERSSION_INSTALLED == v0.8.* ]] ; then
    echo "Updating npm to a newer, 0.8 compatible version"
    npm install -g npm@1.4
fi

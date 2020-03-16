#!/bin/bash

# Link 'sinon' to local development dir
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR/.."
npm link

# Install examples project and link to local sinon folder
cd "$SCRIPT_DIR"
npm install
npm link sinon

# Make sure all examples are still runnable
for f in *.stub; do
    node $f
done

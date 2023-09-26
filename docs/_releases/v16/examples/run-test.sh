#!/bin/bash
# Link 'sinon' to local development dir
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
SINON_ROOT="$SCRIPT_DIR/../../../.."

cd "$SINON_ROOT"
npm link

# Install examples project and link to local sinon folder
cd "$SCRIPT_DIR"
rm -r node_modules 2>/dev/null
npm install --ignore-scripts
npm link sinon

# Lint
$(npm bin)/eslint .

# Make sure all examples are still runnable
set -e
for f in *.test.js; do
    node $f
done
set +e

# clean up to avoid circular links confusing watchers
npm unlink sinon
git checkout -- package.json
npm install --ignore-scripts
cd "$SCRIPT_DIR/.."
npm unlink .

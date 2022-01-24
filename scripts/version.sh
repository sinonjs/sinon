#!/bin/bash
set -e

echo 'update CHANGES.md'
changes --commits --footer

# Tidy CHANGES.md after any manual hand-editing
prettier --write CHANGES.md

echo 'set new current/next release id in documentation'
node ./scripts/set-release-id-in-config-yml.cjs

echo 'update changelog'
./scripts/update-changelog-page.sh

# Add our updates
git add docs/changelog.md
git add docs/_config.yml
git add CHANGES.md

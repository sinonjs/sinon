#!/bin/bash
PACKAGE_VERSION=$(node -p -e "require('./package.json').version")

echo 'postversion tasks'
./scripts/copy-documentation-for-new-release.sh $PACKAGE_VERSION

echo 'set new current/next release id in documentation'
node ./scripts/set-release-id-in-config-yml.js

git add docs/_config.yml
git commit -m "Update docs/_config.yml with new release id: $PACKAGE_VERSION"

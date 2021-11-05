#!/bin/bash
set -e
PACKAGE_VERSION=$(node -p -e "require('./package.json').version")

echo 'postversion tasks'
prettier --write CHANGES.md # after manually hand-editing this might need fixes
./scripts/copy-documentation-for-new-release.sh $PACKAGE_VERSION

echo 'set new current/next release id in documentation'
node ./scripts/set-release-id-in-config-yml.cjs

echo 'update changelog'
./scripts/update-changelog-page.sh

echo 'build new package'
node ./build.cjs

echo 'copy new version'
cp "./pkg/sinon.js" "./docs/releases/sinon-$PACKAGE_VERSION.js"

git add "docs/releases/sinon-$PACKAGE_VERSION.js"
git add docs/changelog.md
git add docs/_config.yml
git commit -n -m "Update docs/changelog.md and set new release id in docs/_config.yml"

git push --follow-tags && npm publish

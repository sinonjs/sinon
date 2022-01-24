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

echo 'commit changelog updates'
git add docs/changelog.md
git add docs/_config.yml
git commit -n -m "Update docs/changelog.md and set new release id in docs/_config.yml"

echo 'build new package'
node ./build.cjs

echo 'publish to npm'
git push --follow-tags && npm publish

# Now update the releases branch and archive the new release
git checkout releases
git merge master

./scripts/copy-documentation-for-new-release.sh $PACKAGE_VERSION

echo 'copying new version to webpage assets'
cp "./pkg/sinon.js" "./docs/assets/js/"

echo 'copy new version to release archive'
cp "./pkg/sinon.js" "./docs/releases/sinon-$PACKAGE_VERSION.js"

git add "docs/releases/sinon-$PACKAGE_VERSION.js"
git commit -n -m "Add version $PACKAGE_VERSION to releases"

git push && git checkout master

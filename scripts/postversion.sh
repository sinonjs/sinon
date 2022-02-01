#!/bin/bash
set -e
PACKAGE_VERSION=$(node -p -e "require('./package.json').version")
ARCHIVE_BRANCH=${ARCHIVE_BRANCH:-releases}
SOURCE_BRANCH=$(git rev-parse --abbrev-ref HEAD)

echo 'postversion tasks'

# npm publish will generate the pkg/sinon.js that we use below
echo 'publish to npm'
if [ -n "$DRY_RUN" ]; then
    npm publish --dry-run
else
    git push --follow-tags
    npm publish
fi

# Now update the releases branch and archive the new release
echo "archiving release from $SOURCE_BRANCH to $ARCHIVE_BRANCH"
git checkout $ARCHIVE_BRANCH
git merge --no-edit -m "Merge version $PACKAGE_VERSION" $SOURCE_BRANCH

./scripts/copy-documentation-for-new-release.sh $PACKAGE_VERSION

echo 'copying new version to webpage assets'
cp "pkg/sinon.js" "./docs/assets/js/"
git add "docs/assets/js/"

echo 'copy new version to release archive'
cp "pkg/sinon.js" "./docs/releases/sinon-$PACKAGE_VERSION.js"

git add "docs/releases/sinon-$PACKAGE_VERSION.js"
git commit -n -m "Add version $PACKAGE_VERSION to releases"

[ -n "$DRY_RUN" ] || git push
git checkout $SOURCE_BRANCH

#!/bin/bash

if [[ $# != 1 ]]; then
    echo "Usage: $0 <commitish>"
    exit 1
fi

RELEASE_VERSION="v$1"
DIRECTORY_PATH="docs/_releases/$RELEASE_VERSION"
FILE_PATH="$DIRECTORY_PATH.md"
SOURCE_PATH='docs/release-source/'

if [ -e "$DIRECTORY_PATH" ]
    then
        echo "$DIRECTORY_PATH already exists, cannot continue"
        exit 1
fi

if [ -e "$FILE_PATH" ]
    then
        echo "$FILE_PATH already exists, cannot continue"
        exit 1
fi

echo "Copy docs/release-source to docs/_releases/$RELEASE_VERSION"

mkdir $DIRECTORY_PATH
cp -r docs/release-source/release/* $DIRECTORY_PATH
cp docs/release-source/release.md $FILE_PATH

# replace `release_id: master` with `release_id: $RELEASE_VERSION` in
# $FILE_PATH
sed -i.bak "s/release_id: master/release_id: $RELEASE_VERSION/g" $FILE_PATH
rm $FILE_PATH.bak

git add $DIRECTORY_PATH
git add $FILE_PATH
git commit -m "Add release documentation for $RELEASE_VERSION"

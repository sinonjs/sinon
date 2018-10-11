#!/bin/bash

if [[ $# != 1 ]]; then
    echo "Usage: $0 <commitish>"
    exit 1
fi

RELEASE_VERSION="v$1"
NEW_VERSION_PATH="docs/_releases/$RELEASE_VERSION"
LATEST_VERSION_PATH="docs/_releases/latest"
SOURCE_PATH='docs/release-source/'

if [ -e "$NEW_VERSION_PATH" ]
    then
        echo "$NEW_VERSION_PATH already exists, cannot continue"
        exit 1
fi

if [ -e "$FILE_PATH" ]
    then
        echo "$FILE_PATH already exists, cannot continue"
        exit 1
fi


function copy_source_to(){
    local DIR="$@"
    local FILE_PATH="${DIR}.md"

    echo "Copy $SOURCE_PATH to $DIR"

    mkdir $DIR
    cp -r "$SOURCE_PATH/release/"* "$DIR"
    cp "$SOURCE_PATH/release.md" "$FILE_PATH"

    # replace `release_id: master` with `release_id: $RELEASE_VERSION` in
    # $FILE_PATH
    sed -i.bak "s/release_id: master/release_id: $RELEASE_VERSION/g" "$FILE_PATH"
    rm "$FILE_PATH.bak"

    git add "$DIR"
    git add "$FILE_PATH"
}

copy_source_to "$NEW_VERSION_PATH"
rm -r "$LATEST_VERSION_PATH"
copy_source_to "$LATEST_VERSION_PATH"

git commit -m "Add release documentation for $RELEASE_VERSION"

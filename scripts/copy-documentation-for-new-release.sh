#!/bin/bash
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR/.."

if [[ $# != 1 ]]; then
    echo "Usage: $0 <commitish>"
    exit 1
fi

FULL_VERSION="v$1"
MAJOR_VERSION=v$(node -p "require('semver').major('$1')")
SOURCE_PATH='docs/release-source/'

function copy_source_to(){
    local VERSION="$1"
    local DIR="docs/_releases/$VERSION"
    local FILE_PATH="${DIR}.md"

    if [ -e "$DIR" ]; then
            echo "$DIR already exists, cannot continue"
            exit 1
    fi

    if [ -e "$FILE_PATH" ]
        then
            echo "$FILE_PATH already exists, cannot continue"
            exit 1
    fi

    echo "Copy $SOURCE_PATH to $DIR"

    mkdir $DIR
    cp -r "$SOURCE_PATH/release/"* "$DIR"
    cp "$SOURCE_PATH/release.md" "$FILE_PATH"

    # Remove .gitignore'd files from copies
    # Otherwise they will remain on the local filesytem
    rm -r "$DIR/examples/node_modules"
    rm "$DIR/examples/package-lock.json"

    # replace `release_id: master` with `release_id: $FULL_VERSION` in
    # $FILE_PATH
    sed -i.bak "s/release_id: master/release_id: $FULL_VERSION/g" "$FILE_PATH"
    sed -i.bak "s/sort_id: master/sort_id: $MAJOR_VERSION/g" "$FILE_PATH"
    rm "$FILE_PATH.bak"

    git add "$DIR"
    git add "$FILE_PATH"
}

copy_source_to "$MAJOR_VERSION"
rm -r "docs/_releases/latest" \
    "docs/_releases/latest.md" 2>/dev/null
copy_source_to "latest"

git commit -m "Add release documentation for $MAJOR_VERSION"

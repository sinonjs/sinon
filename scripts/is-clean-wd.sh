#!/bin/sh
OUTPUT=$(git status --porcelain)
if [[ "$OUTPUT" ]]; then
    echo "The index and/or working directory is unclean. Commit, delete or stash any uncommitted changes before continuing the release process."
    echo $OUTPUT
    exit 1
fi


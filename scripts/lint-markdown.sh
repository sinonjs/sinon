#!/bin/sh


# find has a `-prune` option to avoid descending directories
# but I was unable to get it to work, hence the filtering
find docs \
    -type f -name '*.md' ! -name 'changelog.md' \
    | grep -v 'release-source/release/examples' \
    | xargs markdownlint

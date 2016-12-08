#!/bin/bash
echo 'Updating Changelog.txt'
git changelog --no-merges
git add Changelog.txt

echo 'Updating AUTHORS'
git authors --list > AUTHORS
git add AUTHORS

git commit -m "Update Changelog.txt and AUTHORS for new release"

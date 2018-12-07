#!/bin/bash

for package in $(npm outdated --parseable nise lolex @sinonjs/formatio @sinonjs/samsam)
do
    wanted="$(cut -d: -f2 <<< "$package")"
    current="$(cut -d: -f3 <<< "$package")"
    if [ "$wanted" != "$current" ]
    then
        echo "WARNING: Building with outdated package ${current}, run 'npm update' to install ${wanted}"
        exit 1
    fi
done

npm run lint
npm test
npm run test-cloud

echo 'Updating CHANGELOG.md'
git changelog --no-merges
git add CHANGELOG.md

echo 'Updating AUTHORS'
git authors --list > AUTHORS
git add AUTHORS

git commit -m "Update CHANGELOG.md and AUTHORS for new release"

#!/bin/bash

for package in $(npm outdated --parseable @sinonjs/fake-timers @sinonjs/samsam)
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
npm run test-runnable-examples

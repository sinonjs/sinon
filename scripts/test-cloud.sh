#!/bin/sh

# exit on first error
set -e

for browser in MicrosoftEdge chrome firefox; do
    echo Running tests using $browser in the Sauce Labs cloud
    BROWSER_NAME=$browser mochify -C mochify.webdriver.cjs
done


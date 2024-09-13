#!/bin/sh

BROWSER_NAME=MicrosoftEdge mochify -C mochify.webdriver.cjs \
&& BROWSER_NAME=chrome mochify -C mochify.webdriver.cjs \
&& BROWSER_NAME=firefox mochify -C mochify.webdriver.cjs

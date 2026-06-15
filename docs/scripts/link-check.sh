#!/bin/bash
set -e

if ! command -v lychee >/dev/null 2>&1; then
    echo "Error: lychee is not installed."
    echo "Install it from https://lychee.cli.rs/installation/"
    exit 1
fi

echo "Running lychee link check on dist folder..."
lychee .vitepress/dist \
    --root-dir .vitepress/dist \
    --exclude "^file://" \
    --exclude "opencollective" \
    --exclude "llms" \
    --exclude "node-tap.org" \
    --accept '200..=299,403'

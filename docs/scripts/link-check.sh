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
    --include-mail=false \
    --exclude "^file://" \
    --exclude "opencollective" \
    --exclude "llms" \
    --accept '200..=299,403'

#!/bin/bash
set -e

echo 'update CHANGES.md'
changes --commits --footer

# Tidy CHANGES.md after any manual hand-editing
prettier --write CHANGES.md

git add CHANGES.md

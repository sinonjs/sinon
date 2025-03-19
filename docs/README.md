---
published: false
---

# Docs

This folder structure contains the markdown files that is the Sinon.JS documentation site published to GitHub Pages.

See [CONTRIBUTING.md](CONTRIBUTING.md) for details on contributing documentation to Sinon.JS. This file also lists how to run the site locally.

## Documentation release process

Whenever a new release is created using `npm version`, the tree from `release-source/release/` is copied into a folder under `releases/` with an appropriate name.
Likewise, the `_releases/release.md` file is copied into a file matching the release name.

Currently, we keep a single folder per major release.

See `scripts/postversion.sh` for details on the exact process, as it changes over time.

The release is packaged, tagged and pushed to GitHub. GitHub Pages will build a new site in a few minutes, and replace the old one.

## Verifying links

This has yet to be automated (requires some Rubys setup), but you can use the Makefile target `check-links` to verify internal
and external links, which were all verified per March 2025.

```bash
git checkout releases
make install
make build
make check-links
```

You might need to fiddle a bit around with locally merging in changes from whatever branch you are on to check those changes, but it's quite doable.

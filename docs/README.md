---
published: false
---

# Docs

This folder structure contains the markdown files that becomes the Sinon.JS documentation site published to GitHub Pages. Eventually this will replace the current site at https://sinonjs.org.

See [CONTRIBUTING.md](CONTRIBUTING.md) for details on contributing documentation to Sinon.JS.

## Documentation release process

Whenever a new release is created using `npm version`, the tree from `release-source/release/` is copied into its own folder under `releases/` with an appropriate name.

Likewise, the `_releases/release.md` file is copied into a file matching the release name.

### Example

Let's say that we're making a new `v2.0.3` release.

* `release-source/release/` is copied into a new folder `_releases/v2.0.3/`
* `release-source/release.md` is copied into a new file `_releases/v2.0.3.md`

The release is packaged, tagged and pushed to GitHub. GitHub Pages will build a new site in a few minutes, and replace the old one.


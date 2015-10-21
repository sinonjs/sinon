# Docs

This folder structure contains the markdown files that become the Sinon.JS documentation site available at http://sinonjs.org.


## Source files

There are two folder structures

<dl>
    <dt><code>current</code></dt>
    <dd>documentation for <code>master</code> branch</dd>

    <dt><code>releases</code></dt>
    <dd>each new release will have it's own folder</dd>
</dl>

## Release process

Whenever a new release is created, the tree from `current` (or an existing release) is copied into it's own folder with an appropriate name under the `releases` folder.

### Example - new release from `master`

Let's say that we're making a new `v2.0.3` release from `master`.

We copy `docs/current/` into a new folder `docs/releases/v2.0.3`.

The release is packaged, tagged and pushed to GitHub. The documentation build process will be notified and will compile a new version of the website and deploy it.

FIXME: We still need to build all this automation.


## Contribruting documentation

If you're contributing changes to the `master` branch, then documentation in `current` should be updated.

If you're contributing documentation to existing releases, then your documentation changes should go into the documentation for that release, and probably many of the following releases.

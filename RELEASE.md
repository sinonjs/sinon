# Rolling Sinon releases

You will need a working installation of [git-extras](https://github.com/tj/git-extras) for this.

The release process is mostly automated, here is a brief overview of the steps

1. `npm version [keyword]`
    - Updates `CHANGELOG.md` - you will need to edit this
    - Updates `AUTHORS`
    - Updates `package.json` with new version
    - Creates a new git tag
    - Copies new release documentation into place in `docs/_releases/`, using the new release id
2. `npm publish` publishes the new release to the npm registry
3. `git push origin --follow-tags` pushes the changes to GitHub

Each step is described in detail below.

## 1. Create a new version and compile the changelog

Prefer the builtin options over explicit version when you can:

```shell
npm version [<newversion> | major | minor | patch | premajor | preminor | prepatch | prerelease | from-git]
```

If you absolutely **have** to, then you can also specify a specific version:

```shell
npm version x.y.z
```

After this, your default editor will show the updated `CHANGELOG.md`. Please make edits to this to remove service commits (like updating `devDependencies`) and commits that only change documentation.

## 2. Publish to NPM

```shell
npm publish
```

## 3. Push new commits to GitHub

This adds both the tags and the documentation for the new release to GitHub, which will then build a new site for GitHub Pages.

```shell
git push origin --follow-tags
```

Assuming `origin` is pointing to the main GitHub repo.

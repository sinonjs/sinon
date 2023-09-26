# Contributing to documentation

## Documenting the next release

When you're contributing documentation changes for code in `main` branch, then documentation in `releases-source/` is where you should make changes. Changes made here will automatically be included in the next release.

## Improving documentation for existing releases

If you're contributing documentation for an existing release, then your documentation changes should go into the documentation for that release in `_releases/` folder, and possibly several of the following releases also.

### Where are all the _releases_?
All the files that used to be under `_releases` in the `main` can be found in the `releases` branch. The `main` branch now only keeps the latest version. That means, to fix the docs of published releases you need to checkout the _relases branch_ and supply a PR against that.

## Running the documentation site locally

For casual improvements to the documentation, this shouldn't really be necessary, as all the content documents are plain markdown files.

However, if you're going to contribute changes that alter the overall structure or design of the site, then this section is for you.

```shell
# navigate to docs/
cd docs

# ensure you have bundler
gem install bundler

# install all dependencies
bundle install --path vendor/bundle

# build the site
bundle exec jekyll serve
```

After that you can access the site at http://localhost:4000/

Unfortunately, you will not see the full `release-source` without a little
fiddling, as the site is excluded from Jekyll. So just supply a little symbolic
link like this from the `./docs` dir: `mkdir releases && ln -s $PWD/release-source releases/latest`

## Linting of Markdown

To help keep the documentation syntactically consistent and free of syntax violations, a pre-commit hook using [markdownlint](https://github.com/DavidAnson/markdownlint) verifies Markdown documents.

The CI server uses [markdownlint](https://github.com/DavidAnson/markdownlint) with the same configuration to verify the pull request.

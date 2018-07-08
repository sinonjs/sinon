# Contributing to documentation

## Documenting the next release

When you're contributing documentation changes for code in `master` branch, then documentation in `releases-source/` is where you should make changes. Changes made here will automatically be included in the next release.


## Improving documentation for existing releases

If you're contributing documentation for an existing release, then your documentation changes should go into the documentation for that release in `_releases/` folder, and possibly several of the following releases also.


### Example: documenting a fixed bug

Let us say that you are documenting a bug in `v1.17.1` that was fixed in `v1.17.4`.

Then we would need to change the documentation for `v1.17.1`, `v1.17.2` and `v1.17.3` to mention the bug and that it was fixed in `v1.17.4`.


## Running the documentation site locally

For casual improvements to the documentation, this shouldn't really be necessary, as all the content documents are just plain markdown files.

However, if you're going to contribute changes that alter the overall structure or design of the site, then this section is for you.

```shell
# navigate to docs/
cd docs

# ensure you have bundler
gem install bundler

# install all dependencies
bundle install

# build the site
bundle exec jekyll serve
```

After that you can access the site at http://localhost:4000/

## Linting of Markdown

To help keep the documentation syntactically consistent and free of syntax violations, a pre-commit hook using [markdownlint](https://github.com/DavidAnson/markdownlint) verifies Markdown documents.

The CI server uses [markdownlint](https://github.com/DavidAnson/markdownlint) with the same configuration to verify the pull request.

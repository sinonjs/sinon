# Rolling Sinon releases

You'll need a working installation of [git-extras](https://github.com/tj/git-extras) for this.

## Update Changelog.txt

Compile interesting highlights from [`git changelog`](https://github.com/tj/git-extras/blob/master/Commands.md#git-changelog) into Changelog.md

    git changelog --no-merges

## Update AUTHORS

    git authors --list > AUTHORS

## Create a new version

Update package.json and create a new tag.

```
$ npm version x.y.z
```

## Publish to NPM

```
$ npm publish
```

## Update static site

### Copy files into the static site

    cp Changelog.txt ../sinon-docs/resources/public/.
    cp pkg/* ../sinon-docs/resources/public/releases/.

### Publish the site

    cd ../sinon-docs && ./publish.sh

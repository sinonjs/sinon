# Rolling Sinon releases

* Compile interesting highlights from `git log vX.Y.Z..master` into Changelog.md
* Put new authors in AUTHORS
* Update version in package.json
* Commit and tag version
* `npm publish`
* Copy files into the static site:
    cp Changelog.txt ../sinon-docs/resources/public/.
    cp pkg/* ../sinon-docs/resources/public/releases/.
* Publish the site: `cd ../sinon-docs && ./publish.sh`

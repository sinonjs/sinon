git push
git push --tags
npm publish
rm -f pkg/*
ruby -rubygems build
cp pkg/* ../sinon-web/releases/.
cp Changelog.txt ../sinon-web/.
cd ../sinon-web
sed -i "s/2012\-[0-9][0-9]\-[0-9][0-9] \-/`date +%Y`-`date +%m`-`date +%d` -/" index.html
sed -i "s/2012\-[0-9][0-9]\-[0-9][0-9] \-/`date +%Y`-`date +%m`-`date +%d` -/" qunit/index.html
sed -i "s/$1/$2/g" index.html
sed -i "s/$1/$2/g" qunit/index.html
sed -i "s/$1/$2/g" docs/index.html

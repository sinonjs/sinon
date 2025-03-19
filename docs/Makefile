# Just check out https://makefile.site

# otherwise Make assumes that all install targets are files & folders
.PHONY: install deploy livereload build help list-targets

help:
	@make print S="These are the possible make targets you can invoke"
	@make list-targets

install:
	@command -v bundle > /dev/null || (make print S="Missing Bundler. Installing" && gem install bundler )
	bundle install
	@# this is just to get the output as the final line
	@make check-dependencies

copy-over-sinon-script:
	@[ -e assets/js/sinon.js ] || npm run build && cp ../pkg/sinon.js assets/js/

check-dependencies:
	@command -v git-lfs > /dev/null || (make print S="You need to install Git LFS before committing changes" && exit 1)

check-links: copy-over-sinon-script
	bundle exec htmlproofer --assume-extension='.html' \
        --ignore-status-codes="403" \
        --ignore-files=./_site/releases/changelog.html \
        --no-enforce-https ./_site/

deploy: check-dependencies
	git push

livereload:
	bundle exec jekyll serve --trace --livereload --host localhost  --incremental --safe

# only for checking out the final build and/or validating links (also works with livereload)
# # only for checking out the final build
build:
	bundle exec jekyll build

### UTILS ###

#https://stackoverflow.com/a/26339924/200987
list-targets:
	@LC_ALL=C $(MAKE) -pRrq -f $(firstword $(MAKEFILE_LIST)) : 2>/dev/null | awk -v RS= -F: '/(^|\n)# Files(\n|$$)/,/(^|\n)# Finished Make data base/ {if ($$1 !~ "^[#.]") {print $$1}}' | sort | grep -E -v -e '^[^[:alnum:]]' -e '^$@$$' | grep -v print

print:
	@printf "\033[01;35m%s\033[00m\n" "$(S)"


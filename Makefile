default: test lint
build: lib/sinon.js
	./build
test: lib/sinon.js
	jstestdriver --tests all --reset
clean:
	rm -fr pkg
lint: clean
	juicer verify {lib,test}/**/*.js
	jsl --conf jsl.conf lib/**/*.js test/**/*.js

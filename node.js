var sys = require("sys");

require.paths.unshift("./src");
var sinon = require("sinon");

sinon.spy(Object, "keys");

sys.puts(Object.keys({ hey: "there" }));

sys.puts(Object.keys.called())

sys.puts(typeof sinon);
sys.puts(typeof sinon.spy);
sys.puts(typeof sinon.stub);
sys.puts(typeof sinon.mock);

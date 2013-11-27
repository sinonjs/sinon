var http = require("http");
var static = require("node-static");
var browserify = require("browserify");

var fileServer = new static.Server(".", {
    cache: false
});

var server = http.createServer(function (req, res) {
    req.addListener("end", function () {
        if (req.url === "/test/sinon-bundle.js") {
            res.writeHead(200, {
                "content-type": "text/javascript"
            });
            browserify().add("./lib/sinon.js").bundle({
                standalone: "sinon",
                detectGlobals: false,
                debug: true
            }).pipe(res);
        } else {
            fileServer.serve(req, res);
        }
    }).resume();
});
server.listen(8080);

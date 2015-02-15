module.exports = function (grunt) {

    "use strict";

    grunt.initConfig({
        buster: {
            all : {
                test: {
                    config: "test/buster.js"
                },
                server: {
                    port: 1112
                }
            }
        }
    });

    grunt.loadNpmTasks("grunt-buster");

    grunt.registerTask("test", ["buster"]);
    grunt.registerTask("default", "test");
};

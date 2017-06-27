const ERROR = "error";
const WARN = "warn";
const OFF = "off";

module.exports = {
    "env": {
        "mocha": true
    },
    "plugins": [
        "mocha"
    ],
    "rules": {
        "max-nested-callbacks": OFF,
        "no-restricted-syntax": [ERROR, "TryStatement"],

        // Mocha Plugin - https://github.com/lo1tuma/eslint-plugin-mocha
        "mocha/handle-done-callback": ERROR,
        "mocha/no-exclusive-tests": ERROR,
        "mocha/no-global-tests": ERROR,
        "mocha/no-hooks-for-single-case": OFF,
        "mocha/no-identical-title": ERROR,
        "mocha/no-mocha-arrows": ERROR,
        "mocha/no-nested-tests": ERROR,
        "mocha/no-return-and-callback": ERROR,
        "mocha/no-sibling-hooks": ERROR,
        "mocha/no-skipped-tests": WARN,
        "mocha/no-top-level-hooks": ERROR
    }
}

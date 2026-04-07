import referee from "@sinonjs/referee";
import sinon from "../../src/sinon.js";
import spyFormatters from "../../src/sinon/spy-formatters.js";

const { D } = spyFormatters;
const { assert } = referee;

describe('formatter specifier "D"', function () {
    it("should not mutate matchers passed as arguments", function () {
        const matcher = sinon.match(function test() {
            return false;
        }, "something");
        assert.equals(matcher.message, "something");

        const stub = sinon.stub();

        stub(1, 2, 3);
        /* eslint-disable new-cap */
        D(stub, [matcher]);

        assert.equals(matcher.message, "something");
    });

    it("keeps multiline call output separated", function () {
        const spyInstance = {
            callCount: 2,
            getCall(index) {
                return index === 0
                    ? {
                          toString() {
                              return "first\nline";
                          },
                      }
                    : {
                          toString() {
                              return "second";
                          },
                      };
            },
        };

        assert.equals(
            spyFormatters.C(spyInstance),
            "\n    first\nline\n\n    second",
        );
    });
});

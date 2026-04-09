import commons from "@sinonjs/commons";
import getNextTick from "./get-next-tick.js";

const { global: globalObject } = commons;

/**
 * A platform-agnostic next-tick function.
 */
export default getNextTick(globalObject.process, globalObject.setImmediate);

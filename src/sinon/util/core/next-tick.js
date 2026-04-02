import { global as globalObject } from "@sinonjs/commons";
import getNextTick from "./get-next-tick.js";

/**
 * A platform-agnostic next-tick function.
 */
export default getNextTick(globalObject.process, globalObject.setImmediate);

import getPropertyDescriptor from "./get-property-descriptor.js";

/**
 * Checks if a property is configurable.
 *
 * @param {object} obj The object
 * @param {string} propName The property name
 * @returns {boolean} True if configurable
 */
export default function isPropertyConfigurable(obj, propName) {
    const propertyDescriptor = getPropertyDescriptor(obj, propName);

    return propertyDescriptor ? propertyDescriptor.configurable : true;
}

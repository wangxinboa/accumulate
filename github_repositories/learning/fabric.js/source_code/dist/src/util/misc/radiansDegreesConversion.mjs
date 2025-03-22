import { PiBy180 } from '../../constants.mjs';

/**
 * Transforms degrees to radians.
 * @param {TDegree} degrees value in degrees
 * @return {TRadian} value in radians
 */
const degreesToRadians = codeMarkFunction(degrees => degrees * PiBy180, 'degreesToRadians');

/**
 * Transforms radians to degrees.
 * @param {TRadian} radians value in radians
 * @return {TDegree} value in degrees
 */
const radiansToDegrees = codeMarkFunction(radians => radians / PiBy180, 'radiansToDegrees');

export { degreesToRadians, radiansToDegrees };
//# sourceMappingURL=radiansDegreesConversion.mjs.map

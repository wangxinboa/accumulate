import { halfPI, twoMathPi } from '../../constants.mjs';

/**
 * Easing functions
 * @see {@link http://gizma.com/easing/ Easing Equations by Robert Penner}
 */

const normalize = fabricJsFunctionMark((a, c, p, s) => {
  if (a < Math.abs(c)) {
    a = c;
    s = p / 4;
  } else {
    //handle the 0/0 case:
    if (c === 0 && a === 0) {
      s = p / twoMathPi * Math.asin(1);
    } else {
      s = p / twoMathPi * Math.asin(c / a);
    }
  }
  return {
    a,
    c,
    p,
    s
  };
}, 'normalize');
const elastic = fabricJsFunctionMark((a, s, p, t, d) => a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * twoMathPi / p), 'elastic');

/**
 * Default sinusoidal easing
 */
const defaultEasing = fabricJsFunctionMark((t, b, c, d) => -c * Math.cos(t / d * halfPI) + c + b, 'defaultEasing');

/**
 * Cubic easing in
 */
const easeInCubic = fabricJsFunctionMark((t, b, c, d) => c * (t / d) ** 3 + b, 'easeInCubic');

/**
 * Cubic easing out
 */
const easeOutCubic = fabricJsFunctionMark((t, b, c, d) => c * ((t / d - 1) ** 3 + 1) + b, 'easeOutCubic');

/**
 * Cubic easing in and out
 */
const easeInOutCubic = fabricJsFunctionMark((t, b, c, d) => {
  t /= d / 2;
  if (t < 1) {
    return c / 2 * t ** 3 + b;
  }
  return c / 2 * ((t - 2) ** 3 + 2) + b;
}, 'easeInOutCubic');

/**
 * Quartic easing in
 */
const easeInQuart = fabricJsFunctionMark((t, b, c, d) => c * (t /= d) * t ** 3 + b, 'easeInQuart');

/**
 * Quartic easing out
 */
const easeOutQuart = fabricJsFunctionMark((t, b, c, d) => -c * ((t = t / d - 1) * t ** 3 - 1) + b, 'easeOutQuart');

/**
 * Quartic easing in and out
 */
const easeInOutQuart = fabricJsFunctionMark((t, b, c, d) => {
  t /= d / 2;
  if (t < 1) {
    return c / 2 * t ** 4 + b;
  }
  return -c / 2 * ((t -= 2) * t ** 3 - 2) + b;
}, 'easeInOutQuart');

/**
 * Quintic easing in
 */
const easeInQuint = fabricJsFunctionMark((t, b, c, d) => c * (t / d) ** 5 + b, 'easeInQuint');

/**
 * Quintic easing out
 */
const easeOutQuint = fabricJsFunctionMark((t, b, c, d) => c * ((t / d - 1) ** 5 + 1) + b, 'easeOutQuint');

/**
 * Quintic easing in and out
 */
const easeInOutQuint = fabricJsFunctionMark((t, b, c, d) => {
  t /= d / 2;
  if (t < 1) {
    return c / 2 * t ** 5 + b;
  }
  return c / 2 * ((t - 2) ** 5 + 2) + b;
}, 'easeInOutQuint');

/**
 * Sinusoidal easing in
 */
const easeInSine = fabricJsFunctionMark((t, b, c, d) => -c * Math.cos(t / d * halfPI) + c + b, 'easeInSine');

/**
 * Sinusoidal easing out
 */
const easeOutSine = fabricJsFunctionMark((t, b, c, d) => c * Math.sin(t / d * halfPI) + b, 'easeOutSine');

/**
 * Sinusoidal easing in and out
 */
const easeInOutSine = fabricJsFunctionMark((t, b, c, d) => -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b, 'easeInOutSine');

/**
 * Exponential easing in
 */
const easeInExpo = fabricJsFunctionMark((t, b, c, d) => t === 0 ? b : c * 2 ** (10 * (t / d - 1)) + b, 'easeInExpo');

/**
 * Exponential easing out
 */
const easeOutExpo = fabricJsFunctionMark((t, b, c, d) => t === d ? b + c : c * -(2 ** (-10 * t / d) + 1) + b, 'easeOutExpo');

/**
 * Exponential easing in and out
 */
const easeInOutExpo = fabricJsFunctionMark((t, b, c, d) => {
  if (t === 0) {
    return b;
  }
  if (t === d) {
    return b + c;
  }
  t /= d / 2;
  if (t < 1) {
    return c / 2 * 2 ** (10 * (t - 1)) + b;
  }
  return c / 2 * -(2 ** (-10 * --t) + 2) + b;
}, 'easeInOutExpo');

/**
 * Circular easing in
 */
const easeInCirc = fabricJsFunctionMark((t, b, c, d) => -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b, 'easeInCirc');

/**
 * Circular easing out
 */
const easeOutCirc = fabricJsFunctionMark((t, b, c, d) => c * Math.sqrt(1 - (t = t / d - 1) * t) + b, 'easeOutCirc');

/**
 * Circular easing in and out
 */
const easeInOutCirc = fabricJsFunctionMark((t, b, c, d) => {
  t /= d / 2;
  if (t < 1) {
    return -c / 2 * (Math.sqrt(1 - t ** 2) - 1) + b;
  }
  return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
}, 'easeInOutCirc');

/**
 * Elastic easing in
 */
const easeInElastic = fabricJsFunctionMark((t, b, c, d) => {
  const s = 1.70158,
    a = c;
  let p = 0;
  if (t === 0) {
    return b;
  }
  t /= d;
  if (t === 1) {
    return b + c;
  }
  if (!p) {
    p = d * 0.3;
  }
  const {
    a: normA,
    s: normS,
    p: normP
  } = normalize(a, c, p, s);
  return -elastic(normA, normS, normP, t, d) + b;
}, 'easeInElastic');

/**
 * Elastic easing out
 */
const easeOutElastic = fabricJsFunctionMark((t, b, c, d) => {
  const s = 1.70158,
    a = c;
  let p = 0;
  if (t === 0) {
    return b;
  }
  t /= d;
  if (t === 1) {
    return b + c;
  }
  if (!p) {
    p = d * 0.3;
  }
  const {
    a: normA,
    s: normS,
    p: normP,
    c: normC
  } = normalize(a, c, p, s);
  return normA * 2 ** (-10 * t) * Math.sin((t * d - normS) * twoMathPi / normP) + normC + b;
}, 'easeOutElastic');

/**
 * Elastic easing in and out
 */
const easeInOutElastic = fabricJsFunctionMark((t, b, c, d) => {
  const s = 1.70158,
    a = c;
  let p = 0;
  if (t === 0) {
    return b;
  }
  t /= d / 2;
  if (t === 2) {
    return b + c;
  }
  if (!p) {
    p = d * (0.3 * 1.5);
  }
  const {
    a: normA,
    s: normS,
    p: normP,
    c: normC
  } = normalize(a, c, p, s);
  if (t < 1) {
    return -0.5 * elastic(normA, normS, normP, t, d) + b;
  }
  return normA * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - normS) * twoMathPi / normP) * 0.5 + normC + b;
}, 'easeInOutElastic');

/**
 * Backwards easing in
 */
const easeInBack = fabricJsFunctionMark(function (t, b, c, d) {
  let s = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1.70158;
  return c * (t /= d) * t * ((s + 1) * t - s) + b;
}, 'easeInBack');

/**
 * Backwards easing out
 */
const easeOutBack = fabricJsFunctionMark(function (t, b, c, d) {
  let s = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1.70158;
  return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
}, 'easeOutBack');

/**
 * Backwards easing in and out
 */
const easeInOutBack = fabricJsFunctionMark(function (t, b, c, d) {
  let s = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1.70158;
  t /= d / 2;
  if (t < 1) {
    return c / 2 * (t * t * (((s *= 1.525) + 1) * t - s)) + b;
  }
  return c / 2 * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2) + b;
}, 'easeInOutBack');

/**
 * Bouncing easing out
 */
const easeOutBounce = fabricJsFunctionMark((t, b, c, d) => {
  if ((t /= d) < 1 / 2.75) {
    return c * (7.5625 * t * t) + b;
  } else if (t < 2 / 2.75) {
    return c * (7.5625 * (t -= 1.5 / 2.75) * t + 0.75) + b;
  } else if (t < 2.5 / 2.75) {
    return c * (7.5625 * (t -= 2.25 / 2.75) * t + 0.9375) + b;
  } else {
    return c * (7.5625 * (t -= 2.625 / 2.75) * t + 0.984375) + b;
  }
}, 'easeOutBounce');

/**
 * Bouncing easing in
 */
const easeInBounce = fabricJsFunctionMark((t, b, c, d) => c - easeOutBounce(d - t, 0, c, d) + b, 'easeInBounce');

/**
 * Bouncing easing in and out
 */
const easeInOutBounce = fabricJsFunctionMark((t, b, c, d) => t < d / 2 ? easeInBounce(t * 2, 0, c, d) * 0.5 + b : easeOutBounce(t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b, 'easeInOutBounce');

/**
 * Quadratic easing in
 */
const easeInQuad = fabricJsFunctionMark((t, b, c, d) => c * (t /= d) * t + b, 'easeInQuad');

/**
 * Quadratic easing out
 */
const easeOutQuad = fabricJsFunctionMark((t, b, c, d) => -c * (t /= d) * (t - 2) + b, 'easeOutQuad');

/**
 * Quadratic easing in and out
 */
const easeInOutQuad = fabricJsFunctionMark((t, b, c, d) => {
  t /= d / 2;
  if (t < 1) {
    return c / 2 * t ** 2 + b;
  }
  return -c / 2 * (--t * (t - 2) - 1) + b;
}, 'easeInOutQuad');

export { defaultEasing, easeInBack, easeInBounce, easeInCirc, easeInCubic, easeInElastic, easeInExpo, easeInOutBack, easeInOutBounce, easeInOutCirc, easeInOutCubic, easeInOutElastic, easeInOutExpo, easeInOutQuad, easeInOutQuart, easeInOutQuint, easeInOutSine, easeInQuad, easeInQuart, easeInQuint, easeInSine, easeOutBack, easeOutBounce, easeOutCirc, easeOutCubic, easeOutElastic, easeOutExpo, easeOutQuad, easeOutQuart, easeOutQuint, easeOutSine };
//# sourceMappingURL=easing.mjs.map

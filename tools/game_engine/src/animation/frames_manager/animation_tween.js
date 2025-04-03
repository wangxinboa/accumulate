import Animation from './animation.js';


export default class AnimationTween extends Animation {
	_updateProperties(object, startTarget, endTarget, value) {
		let startVal, endVal;

		for (let key in endTarget) {
			startVal = startTarget[key];
			endVal = endTarget[key];

			object[key] = (endVal - startVal) * value + startVal;
		}

		startVal = endVal = null;
	}
}
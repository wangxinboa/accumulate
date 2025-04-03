import Animation from './animation.js';


export default class AnimationIndex extends Animation {
	_updateProperties(object, startTarget, endTarget, value) {
		for (let key in endTarget) {
			object[key] = value < 1 ? startTarget[key] : endTarget[key];
		}
	}
}
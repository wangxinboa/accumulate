import BaseObject from './base_object.js';


export default class RootObject extends BaseObject {
	constructor(option = {}) {
		super(option);

		this.isRoot = true;
	}
	destroy() {
		super.destroy();

		this.isRoot = null;

		delete this.isRoot;
	}
}
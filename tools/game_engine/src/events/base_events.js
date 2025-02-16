

export default class BaseEvent {
	constructor() {
		this.events = new Map();
	}

	on(eventType, fun) {
		if (this.events.has(eventType)) {
			this.events.get(eventType).push(fun);
		} else {
			this.events.set(eventType, [fun]);
		}

		return this;
	}

	emit(eventType, context, e, camera) {
		if (this.events.has(eventType)) {
			const funArray = this.events.get(eventType);
			for (let i = 0, len = funArray.length; i < len; i++) {
				funArray[i].call(context, e, camera);
			}
			return true;
		} else {
			return false;
		}
	}

	off(eventType, fun) {
		if (this.events.has(eventType)) {
			const funArray = this.events.get(eventType);
			if (fun) {
				const index = funArray.indexOf(fun);
				if (index !== -1) {
					funArray.splice(index, 1);
				}
				if (funArray.length === 0) {
					this.events.delete(eventType);
				}
			} else {
				while (funArray.length > 0) {
					funArray.pop();
				}
				this.events.delete(eventType);
			}
		}

		return this;
	}

	destroy() {
		this.events.clear();
		this.events = null;
	}
}
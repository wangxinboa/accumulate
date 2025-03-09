
function clearEvent(emitter, event) {
	if (--emitter._eventsCount === 0) emitter._events = {}
	else delete emitter._events[event];
}

export default class EventEmitter {
	constructor() {
		this._events = {};
		this._eventsCount = 0;
	}

	eventNames() {
		var names = [], events, name;

		if (this._eventsCount === 0) return names;

		for (name in (events = this._events)) {
			if (Object.prototype.hasOwnProperty.call(events, name)) names.push(name);
		}

		if (Object.getOwnPropertySymbols) {
			return names.concat(Object.getOwnPropertySymbols(events));
		}

		return names;
	}

	hasEvent(event) {
		return !!(this._events[event]);
	}

	listeners(event) {
		var handlers = this._events[event];

		if (!handlers) return [];
		if (Array.isArray(handlers)) {
			for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++) {
				ee[i] = handlers[i];
			}
			return ee;
		} else {
			return [handlers];
		}
	}

	listenerCount(event) {
		var listeners = this._events[event];

		if (!listeners) return 0;
		if (Array.isArray(listeners)) {
			return listeners.length;
		} else {
			return 1;
		}
	}

	emit(event, a1, a2, a3, a4, a5) {
		if (!this._events[event]) return false;

		var listeners = this._events[event], len = arguments.length, args, i;

		if (Array.isArray(listeners)) {
			var length = listeners.length, j;

			for (i = 0; i < length; i++) {
				switch (len) {
					case 1: listeners[i].call(this); break;
					case 2: listeners[i].call(this, a1); break;
					case 3: listeners[i].call(this, a1, a2); break;
					case 4: listeners[i].call(this, a1, a2, a3); break;
					default:
						if (!args) for (j = 1, args = new Array(len - 1); j < len; j++) {
							args[j - 1] = arguments[j];
						}

						listeners[i].apply(this, args);
				}
			}
		} else {
			switch (len) {
				case 1: return listeners.call(this), true;
				case 2: return listeners.call(this, a1), true;
				case 3: return listeners.call(this, a1, a2), true;
				case 4: return listeners.call(this, a1, a2, a3), true;
				case 5: return listeners.call(this, a1, a2, a3, a4), true;
				case 6: return listeners.call(this, a1, a2, a3, a4, a5), true;
			}

			for (i = 1, args = new Array(len - 1); i < len; i++) {
				args[i - 1] = arguments[i];
			}

			listeners.apply(this, args);
		}

		return true;
	}

	on(event, fn) {
		if (typeof fn !== 'function') {
			throw new TypeError('The listener must be a function');
		}

		if (!this._events[event]) {
			this._events[event] = fn, this._eventsCount++;
		} else if (Array.isArray(this._events[event])) {
			this._events[event].push(fn);
		} else {
			this._events[event] = [this._events[event], fn];
		}

		return this;
	}

	off(event, fn) {
		if (!this._events[event]) return this;
		if (!fn) {
			clearEvent(this, event);
			return this;
		}

		var listeners = this._events[event];

		if (Array.isArray(this._events)) {
			for (var i = 0, events = [], length = listeners.length; i < length; i++) {
				if (listeners[i] !== fn) {
					events.push(listeners[i]);
				}
			}

			//
			// Reset the array, or remove it completely if we have no more listeners.
			//
			if (events.length) this._events[event] = events.length === 1 ? events[0] : events;
			else clearEvent(this, event);
		} else {
			clearEvent(this, event);
		}

		return this;
	}

	removeAllListeners(event) {
		if (event) {
			if (this._events[event]) clearEvent(this, event);
		} else {
			this._events = {}
			this._eventsCount = 0;
		}

		return this;
	}

	destroy() {
		this.removeAllListeners();

		this._events = null;
		this._eventsCount = null;
	}
}
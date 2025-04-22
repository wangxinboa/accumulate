// 改自 eventemitter3
function addListener(emitter, event, fn, context, once) {
	if (typeof fn !== 'function') {
		throw new TypeError('The listener must be a function');
	}

	var listener = {
		fn,
		context: context || emitter,
		once: once || false,
	};

	if (!emitter._events[event]) emitter._events[event] = listener, emitter._eventsCount++;
	else if (!emitter._events[event].fn) emitter._events[event].push(listener);
	else emitter._events[event] = [emitter._events[event], listener];

	return emitter;
}

function clearEvent(emitter, event) {
	if (--emitter._eventsCount === 0) emitter._events = {};
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

	/**
	 * @param {(String|Symbol)}
	 * @returns {Boolean}
	 * @public
	 */
	hasEvent(eventName) {
		return !!(this._events[eventName]);
	}

	listeners(event) {
		var handlers = this._events[event];

		if (!handlers) return [];
		if (handlers.fn) return [handlers.fn];

		for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++) {
			ee[i] = handlers[i].fn;
		}

		return ee;
	}

	/**
	 * Return the number of listeners listening to a given event.
	 *
	 * @param {(String|Symbol)} event The event name.
	 * @returns {Number} The number of listeners.
	 * @public
	 */
	listenerCount(event) {
		var listeners = this._events[event];

		if (!listeners) return 0;
		if (listeners.fn) return 1;
		return listeners.length;
	}

	/**
	 * Calls each of the listeners registered for a given event.
	 *
	 * @param {(String|Symbol)} event The event name.
	 * @returns {Boolean} `true` if the event had listeners, else `false`.
	 * @public
	 */
	emit(event, a1, a2, a3, a4, a5) {
		if (!this._events[event]) return false;

		var listeners = this._events[event], len = arguments.length, args, i;

		if (listeners.fn) {
			if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);

			switch (len) {
				case 1: return listeners.fn.call(listeners.context), true;
				case 2: return listeners.fn.call(listeners.context, a1), true;
				case 3: return listeners.fn.call(listeners.context, a1, a2), true;
				case 4: return listeners.fn.call(listeners.context, a1, a2, a3), true;
				case 5: return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
				case 6: return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
			}

			for (i = 1, args = new Array(len - 1); i < len; i++) {
				args[i - 1] = arguments[i];
			}

			listeners.fn.apply(listeners.context, args);
		} else {
			var length = listeners.length, j;

			for (i = 0; i < length; i++) {
				if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);

				switch (len) {
					case 1: listeners[i].fn.call(listeners[i].context); break;
					case 2: listeners[i].fn.call(listeners[i].context, a1); break;
					case 3: listeners[i].fn.call(listeners[i].context, a1, a2); break;
					case 4: listeners[i].fn.call(listeners[i].context, a1, a2, a3); break;
					default:
						if (!args) for (j = 1, args = new Array(len - 1); j < len; j++) {
							args[j - 1] = arguments[j];
						}

						listeners[i].fn.apply(listeners[i].context, args);
				}
			}
		}

		return true;
	}
	/**
	 * Add a listener for a given event.
	 *
	 * @param {(String|Symbol)} event The event name.
	 * @param {Function} fn The listener function.
	 * @param {*} [context=this] The context to invoke the listener with.
	 * @returns {EventEmitter} `this`.
	 * @public
	 */
	on(event, fn, context) {
		return addListener(this, event, fn, context, false);
	}
	/**
	 * Add a one-time listener for a given event.
	 *
	 * @param {(String|Symbol)} event The event name.
	 * @param {Function} fn The listener function.
	 * @param {*} [context=this] The context to invoke the listener with.
	 * @returns {EventEmitter} `this`.
	 * @public
	 */
	once(event, fn, context) {
		return addListener(this, event, fn, context, true);
	}
	/**
	 * Remove the listeners of a given event.
	 *
	 * @param {(String|Symbol)} event The event name.
	 * @param {Function} fn Only remove the listeners that match this function.
	 * @param {*} context Only remove the listeners that have this context.
	 * @param {Boolean} once Only remove one-time listeners.
	 * @returns {EventEmitter} `this`.
	 * @public
	 */
	removeListener(event, fn, context, once) {
		if (!this._events[event]) return this;
		if (!fn) {
			clearEvent(this, event);
			return this;
		}

		var listeners = this._events[event];

		if (listeners.fn) {
			if (listeners.fn === fn &&
				(!once || listeners.once) &&
				(!context || listeners.context === context)) {
				clearEvent(this, event);
			}
		} else {
			for (var i = 0, events = [], length = listeners.length; i < length; i++) {
				if (listeners[i].fn !== fn ||
					(once && !listeners[i].once) ||
					(context && listeners[i].context !== context)) {
					events.push(listeners[i]);
				}
			}

			//
			// Reset the array, or remove it completely if we have no more listeners.
			//
			if (events.length) this._events[event] = events.length === 1 ? events[0] : events;
			else clearEvent(this, event);
		}

		return this;
	}
	/**
	 * Remove all listeners, or those of the specified event.
	 *
	 * @param {(String|Symbol)} [event] The event name.
	 * @returns {EventEmitter} `this`.
	 * @public
	 */
	removeAllListeners(event) {
		if (event) {
			if (this._events[event]) clearEvent(this, event);
		} else {
			this._events = {};
			this._eventsCount = 0;
		}

		return this;
	}

	destroy() {
		this.removeAllListeners();

		this._events =
			this._eventsCount = null;

		delete this._events;
		delete this._eventsCount;
	}
}

EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
EventEmitter.prototype.addListener = EventEmitter.prototype.on;
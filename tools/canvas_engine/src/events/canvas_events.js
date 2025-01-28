

export default class CanvasEvents {
	constructor(el) {
		this.el = el;

		this.event = this.event.bind(this);

		this.el.addEventListener('mousedown', this.event);
		this.el.addEventListener('mousemove', this.event);
		this.el.addEventListener('mouseup', this.event);
		this.el.addEventListener('mouseleave', this.event);
		this.el.addEventListener('wheel', this.event, { passive: true });

		this.events = new Map();
	}

	addEvents(evnetKey, events) {
		if (this.events.has(evnetKey)) {
			throw new Error(`CanvasEvents 已存在 ${evnetKey} 的事件集`);
		} else {
			this.events.set(evnetKey, events);
		}
		return this;
	}

	event(e) {
		const { type = '' } = e;
		this.events.forEach((value) => {
			if (value[type]) {
				value[type].call(value, e);
			}
		});
	}

	destroy() {
		this.el.removeEventListener('mousedown', this.event);
		this.el.removeEventListener('mousemove', this.event);
		this.el.removeEventListener('mouseup', this.event);
		this.el.removeEventListener('mouseleave', this.event);
		this.el.removeEventListener('wheel', this.event);

		this.el = null;
		this.event = null;

		this.events.forEach((value) => {
			if (value[type]) {
				value[type].destroy();
			}
		})
		this.events.clear();
		this.events = null;
	}
}
import CanvasEventType from './canvas_event_type.js';
import KeyboardManager from '../keyboard/keyboard_manager.js';
import MouseManager from '../mouse/mouse_manager.js';
import Vector2 from '../../math/vector2.js';

const _point_ = new Vector2();

let
	_scene_ = null,
	_visibleObject_ = null,
	_drapObject_ = null,

	_hitTestCounter = 0,

	_dragNowX_ = 0,
	_dragNowY_ = 0;


export default class CanvasEvent {
	constructor(el, option = {}) {
		this.el = el;

		this.hitTestLimit = option.hitTestLimit !== void 0 ? option.hitTestLimit : 1;

		this.dragLock = option.dragLock !== void 0 ? option.dragLock : true;

		this.scene = null;

		this.mouseManager = new MouseManager(this);
		if ('ontouchstart' in document.documentElement || (navigator.maxTouchPoints && navigator.maxTouchPoints >= 1)) {
			this.touchManager = new TouchManager(this);
		}
		this.keyboardManager = new KeyboardManager(this);

		this._tempMoveEnter = null;

		this._preMoveEnter = [];
		this._nowMoveEnter = [];

		this._drag = [];
	}

	bindScene(scene) {
		this.scene = scene;
	}

	update() {
		this.keyboardManager.update();
	}

	processDownEvents(e) {
		_scene_ = this.scene;
		_point_.set(e.offsetX, e.offsetY).applyMatrix3(_scene_.camera.matrixWorldInvert);

		for (let i = _scene_.visibleObjectCount - 1; i >= 0; i--) {
			_visibleObject_ = _scene_.visibleObjects[i];

			if (_visibleObject_.hitTest(_point_.x, _point_.y)) {
				if (_visibleObject_.hitTestCountable) {
					_hitTestCounter++;
				}

				if (_visibleObject_.hasEvent(CanvasEventType.pointerdown)) {
					_visibleObject_.emit(CanvasEventType.pointerdown, _point_.x, _point_.y);
				}
				if (_visibleObject_.hasEvent(CanvasEventType.dragstart)) {
					_visibleObject_.emit(CanvasEventType.dragstart, _point_.x, _point_.y);
				}
				if (_visibleObject_.hasEvent(CanvasEventType.drag)) {
					_visibleObject_._dragStartObjectX_ = _visibleObject_.x;
					_visibleObject_._dragStartObjectY_ = _visibleObject_.y;

					_visibleObject_._dragStartEventX_ = _point_.x;
					_visibleObject_._dragStartEventY_ = _point_.y;

					this._drag.push(_visibleObject_);
				}
			}

			if (this.hitTestLimit <= _hitTestCounter) {
				break;
			}
		}

		if (_hitTestCounter > 0) {
			_scene_.emit(CanvasEventType.pointerdown, _point_.x, _point_.y);
		}
		_scene_.directEvent.emit(CanvasEventType.pointerdown, _point_.x, _point_.y);

		_scene_ =
			_visibleObject_ = null;
		_hitTestCounter = 0;
	}
	processMoveEvents(e) {
		_scene_ = this.scene;
		_point_.set(e.offsetX, e.offsetY).applyMatrix3(_scene_.camera.matrixWorldInvert);

		if (this._drag.length > 0) {
			for (let i = 0, len = this._drag.length; i < len; i++) {
				_drapObject_ = this._drag[i];
				_dragNowX_ = _drapObject_._dragStartObjectX_ + _point_.x - _drapObject_._dragStartEventX_;
				_dragNowY_ = _drapObject_._dragStartObjectY_ + _point_.y - _drapObject_._dragStartEventY_;

				_drapObject_.emit(CanvasEventType.drag, _dragNowX_, _dragNowY_, _point_.x, _point_.y);
			}

			_drapObject_ = null;
		}

		if (this._drag.length === 0 || !this.dragLock) {
			for (let i = _scene_.visibleObjectCount - 1; i >= 0; i--) {
				_visibleObject_ = _scene_.visibleObjects[i];

				if (_visibleObject_.hitTest(_point_.x, _point_.y)) {
					if (_visibleObject_.hitTestCountable) {
						_hitTestCounter++;
					}

					this._nowMoveEnter.push(_visibleObject_);

					if (_visibleObject_.hasEvent(CanvasEventType.pointermove)) {
						_visibleObject_.emit(CanvasEventType.pointermove, _point_.x, _point_.y);
					}
					if (
						_visibleObject_.hasEvent(CanvasEventType.pointerenter) &&
						!this._preMoveEnter.includes(_visibleObject_)
					) {
						_visibleObject_.emit(CanvasEventType.pointerenter, _point_.x, _point_.y);
					}
				}

				if (this.hitTestLimit <= _hitTestCounter) {
					break;
				}
			}

			for (let i = this._preMoveEnter.length - 1; i >= 0; i--) {
				_visibleObject_ = this._preMoveEnter[i];
				if (
					_visibleObject_.hasEvent(CanvasEventType.pointerleave) &&
					!this._nowMoveEnter.includes(_visibleObject_)
				) {
					_visibleObject_.emit(CanvasEventType.pointerleave, _point_.x, _point_.y);
				}
			}

			this._tempMoveEnter = this._preMoveEnter;
			this._preMoveEnter = this._nowMoveEnter;
			this._nowMoveEnter = this._tempMoveEnter;
			if (this._nowMoveEnter.length !== 0) {
				this._nowMoveEnter.length = 0;
			}

			if (_hitTestCounter > 0) {
				_scene_.emit(CanvasEventType.pointermove, _point_.x, _point_.y);
			}

			this._tempMoveEnter =
				_visibleObject_ = null;

			_hitTestCounter = 0;
		}

		_scene_.directEvent.emit(CanvasEventType.pointermove, _point_.x, _point_.y);
		_scene_ = null;
	}
	processUpEvents(e) {
		_scene_ = this.scene;
		_point_.set(e.offsetX, e.offsetY).applyMatrix3(_scene_.camera.matrixWorldInvert);

		if (this._drag.length > 0) {
			for (let i = 0, len = this._drag.length; i < len; i++) {
				_drapObject_ = this._drag[i];
				if (_drapObject_.hasEvent(CanvasEventType.dragend)) {
					_drapObject_.emit(CanvasEventType.dragend, _point_.x, _point_.y);
				}
			}

			this._drag.length = 0;
			_drapObject_ = null;
		}

		if (this._drag.length === 0 || !this.dragLock) {
			for (let i = _scene_.visibleObjectCount - 1; i >= 0; i--) {
				_visibleObject_ = _scene_.visibleObjects[i];

				if (_visibleObject_.hitTest(_point_.x, _point_.y)) {
					if (_visibleObject_.hitTestCountable) {
						_hitTestCounter++;
					}

					if (_visibleObject_.hasEvent(CanvasEventType.pointerup)) {
						_visibleObject_.emit(CanvasEventType.pointerup, _point_.x, _point_.y);
					}
				}

				if (this.hitTestLimit <= _hitTestCounter) {
					break;
				}
			}

			if (_hitTestCounter > 0) {
				_scene_.emit(CanvasEventType.pointerup, _point_.x, _point_.y);
			}
			_scene_.directEvent.emit(CanvasEventType.pointerup, _point_.x, _point_.y);

			_scene_ =
				_visibleObject_ = null;
			_hitTestCounter = 0;
		}
	}
	processWheelEvents(e) {
		_point_.set(e.offsetX, e.offsetY).applyMatrix3(this.scene.camera.matrixWorldInvert);

		this.scene.emit(e.type, e.deltaX, e.deltaY, e.deltaZ, _point_.x, _point_.y);
	}

	destroy() {
		if (this.keyboardManager !== null) {
			this.keyboardManager.destroy();
		}

		if (this.mouseManager !== null) {
			this.mouseManager.destroy();
		}

		if (this.touchManager !== null) {
			this.touchManager.destroy();
		}

		this.el =
			this.topOnly =
			this.scene =

			this.mouseManager =
			this.touchManager =
			this.keyboardManager = null;
	}
}
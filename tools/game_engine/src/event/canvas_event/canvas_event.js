import CanvasEventType from './canvas_event_type.js';
import KeyboardManager from '../keyboard/keyboard_manager.js';
import MouseManager from '../mouse/mouse_manager.js';
import Vector2 from '../../math/vector2.js';


const _hitPointInCamera_ = new Vector2();
const _hitPointInScene_ = new Vector2();

let
	_scene_ = null,
	_visibleObject_ = null,
	_drapObject_ = null,

	_hitTestCounter_ = 0,

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

	_beforeProcess(e) {
		_scene_ = this.scene;
		_hitPointInCamera_.set(e.offsetX, e.offsetY).applyMatrix3(_scene_.camera.matrixWorldInvert);
		_hitPointInScene_.set(e.offsetX, e.offsetY);
	}

	_hitTest() {
		return _visibleObject_.applyCameraTransform ?
			_visibleObject_.hitTest(_hitPointInCamera_.x, _hitPointInCamera_.y) :
			_visibleObject_.hitTest(_hitPointInScene_.x, _hitPointInScene_.y);
	}

	processDownEvents(e) {
		this._beforeProcess(e);

		for (let i = _scene_.visibleObjectCount - 1; i >= 0; i--) {
			_visibleObject_ = _scene_.visibleObjects[i];
			if (_visibleObject_.hitTestDisabled) {
				continue;
			}

			if (this._hitTest()) {
				if (_visibleObject_.hitTestCountable) {
					_hitTestCounter_++;
				}

				if (_visibleObject_.hasEvent(CanvasEventType.pointerdown)) {
					_visibleObject_.emit(CanvasEventType.pointerdown, _hitPointInCamera_.x, _hitPointInCamera_.y);
				}
				if (_visibleObject_.hasEvent(CanvasEventType.dragstart)) {
					_visibleObject_.emit(CanvasEventType.dragstart, _hitPointInCamera_.x, _hitPointInCamera_.y);
				}
				if (_visibleObject_.hasEvent(CanvasEventType.drag)) {
					_visibleObject_._dragStartObjectX_ = _visibleObject_.x;
					_visibleObject_._dragStartObjectY_ = _visibleObject_.y;

					_visibleObject_._dragStartEventX_ = _hitPointInCamera_.x;
					_visibleObject_._dragStartEventY_ = _hitPointInCamera_.y;

					this._drag.push(_visibleObject_);
				}
			}

			if (this.hitTestLimit <= _hitTestCounter_) {
				break;
			}
		}

		if (_hitTestCounter_ > 0) {
			_scene_.emit(CanvasEventType.pointerdown, _hitPointInCamera_.x, _hitPointInCamera_.y);
		}
		_scene_.directEvent.emit(CanvasEventType.pointerdown, _hitPointInCamera_.x, _hitPointInCamera_.y);

		_scene_ =
			_visibleObject_ = null;
		_hitTestCounter_ = 0;
	}
	processMoveEvents(e) {
		this._beforeProcess(e);

		if (this._drag.length > 0) {
			for (let i = 0, len = this._drag.length; i < len; i++) {
				_drapObject_ = this._drag[i];
				_dragNowX_ = _drapObject_._dragStartObjectX_ + _hitPointInCamera_.x - _drapObject_._dragStartEventX_;
				_dragNowY_ = _drapObject_._dragStartObjectY_ + _hitPointInCamera_.y - _drapObject_._dragStartEventY_;

				_drapObject_.emit(CanvasEventType.drag, _dragNowX_, _dragNowY_, _hitPointInCamera_.x, _hitPointInCamera_.y);
			}

			_drapObject_ = null;
		}

		if (this._drag.length === 0 || !this.dragLock) {
			for (let i = _scene_.visibleObjectCount - 1; i >= 0; i--) {
				_visibleObject_ = _scene_.visibleObjects[i];
				if (_visibleObject_.hitTestDisabled) {
					continue;
				}

				if (this._hitTest()) {
					if (_visibleObject_.hitTestCountable) {
						_hitTestCounter_++;
					}

					this._nowMoveEnter.push(_visibleObject_);

					if (_visibleObject_.hasEvent(CanvasEventType.pointermove)) {
						_visibleObject_.emit(CanvasEventType.pointermove, _hitPointInCamera_.x, _hitPointInCamera_.y);
					}
					if (
						_visibleObject_.hasEvent(CanvasEventType.pointerenter) &&
						!this._preMoveEnter.includes(_visibleObject_)
					) {
						_visibleObject_.emit(CanvasEventType.pointerenter, _hitPointInCamera_.x, _hitPointInCamera_.y);
					}
				}

				if (this.hitTestLimit <= _hitTestCounter_) {
					break;
				}
			}

			for (let i = this._preMoveEnter.length - 1; i >= 0; i--) {
				_visibleObject_ = this._preMoveEnter[i];
				if (
					_visibleObject_.hasEvent(CanvasEventType.pointerleave) &&
					!this._nowMoveEnter.includes(_visibleObject_)
				) {
					_visibleObject_.emit(CanvasEventType.pointerleave, _hitPointInCamera_.x, _hitPointInCamera_.y);
				}
			}

			this._tempMoveEnter = this._preMoveEnter;
			this._preMoveEnter = this._nowMoveEnter;
			this._nowMoveEnter = this._tempMoveEnter;
			if (this._nowMoveEnter.length !== 0) {
				this._nowMoveEnter.length = 0;
			}

			if (_hitTestCounter_ > 0) {
				_scene_.emit(CanvasEventType.pointermove, _hitPointInCamera_.x, _hitPointInCamera_.y);
			}

			this._tempMoveEnter =
				_visibleObject_ = null;

			_hitTestCounter_ = 0;
		}

		_scene_.directEvent.emit(CanvasEventType.pointermove, _hitPointInCamera_.x, _hitPointInCamera_.y);
		_scene_ = null;
	}
	processUpEvents(e) {
		this._beforeProcess(e);

		if (this._drag.length > 0) {
			for (let i = 0, len = this._drag.length; i < len; i++) {
				_drapObject_ = this._drag[i];
				if (_drapObject_.hasEvent(CanvasEventType.dragend)) {
					_drapObject_.emit(CanvasEventType.dragend, _hitPointInCamera_.x, _hitPointInCamera_.y);
				}
			}

			this._drag.length = 0;
			_drapObject_ = null;
		}

		if (this._drag.length === 0 || !this.dragLock) {
			for (let i = _scene_.visibleObjectCount - 1; i >= 0; i--) {
				_visibleObject_ = _scene_.visibleObjects[i];
				if (_visibleObject_.hitTestDisabled) {
					continue;
				}

				if (this._hitTest()) {
					if (_visibleObject_.hitTestCountable) {
						_hitTestCounter_++;
					}

					if (_visibleObject_.hasEvent(CanvasEventType.pointerup)) {
						_visibleObject_.emit(CanvasEventType.pointerup, _hitPointInCamera_.x, _hitPointInCamera_.y);
					}
				}

				if (this.hitTestLimit <= _hitTestCounter_) {
					break;
				}
			}

			if (_hitTestCounter_ > 0) {
				_scene_.emit(CanvasEventType.pointerup, _hitPointInCamera_.x, _hitPointInCamera_.y);
			}
			_scene_.directEvent.emit(CanvasEventType.pointerup, _hitPointInCamera_.x, _hitPointInCamera_.y);

			_scene_ =
				_visibleObject_ = null;
			_hitTestCounter_ = 0;
		}
	}
	processWheelEvents(e) {
		this._beforeProcess(e);

		_scene_.emit(e.type, e.deltaX, e.deltaY, e.deltaZ, _hitPointInCamera_.x, _hitPointInCamera_.y);
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

			this.hitTestLimit =
			this.dragLock =

			this.scene =

			this.mouseManager =
			this.touchManager =
			this.keyboardManager =

			this._tempMoveEnter =
			this._preMoveEnter =
			this._nowMoveEnter =

			this._drag = null;

		delete this.el;
		delete this.hitTestLimit;
		delete this.dragLock;
		delete this.scene;
		delete this.mouseManager;
		delete this.touchManager;
		delete this.keyboardManager;
		delete this._tempMoveEnter;
		delete this._preMoveEnter;
		delete this._nowMoveEnter;
		delete this._drag;
	}
}
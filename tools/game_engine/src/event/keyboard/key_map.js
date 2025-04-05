import KeyCodes from './key_codes.js';

const KeyMap = {};
const KeyDownMap = {};
const KeyUpMap = {};
const KeyPressMap = {};

for (let key in KeyCodes) {
	KeyMap[KeyCodes[key]] = key;
	KeyDownMap[KeyCodes[key]] = `keydown-${key}`;
	KeyUpMap[KeyCodes[key]] = `keyup-${key}`;
	KeyPressMap[KeyCodes[key]] = `keypress-${key}`;
}

export {
	KeyMap,
	KeyDownMap,
	KeyUpMap,
	KeyPressMap,
};
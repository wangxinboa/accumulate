import KeyCodes from './key_codes.js';

const KeyFlags = {};
const KeyDownFlags = {};
const KeyUpFlags = {};
const KeyPressFlags = {};

for (let key in KeyCodes) {
	KeyFlags[KeyCodes[key]] = key;
	KeyDownFlags[KeyCodes[key]] = `keydown-${key}`;
	KeyUpFlags[KeyCodes[key]] = `keyup-${key}`;
	KeyPressFlags[KeyCodes[key]] = `keypress-${key}`;
}

export {
	KeyFlags,
	KeyDownFlags,
	KeyUpFlags,
	KeyPressFlags,
};

const toHex = (n) => {
	return n.toString(16).padStart(2, '0');
};

export default class Color {
	r = 0;
	g = 0;
	b = 0;
	_r = 0;
	_g = 0;
	_b = 0;
	_a = 1;

	hex = '#000000';
	hexNumber = 0x000000;

	constructor(value = 0x000000) {
		if (typeof value === 'string') {
			this.setHex(value);
		} else if (typeof value === 'number') {
			this.setHexNumber(value);
		}
	}

	setR(r) {
		this._r = r;
		this.r = r / 255;

		this._updateHexByRGB();
		this._updateHexNumberByRGB();
	}

	setG(g) {
		this._g = g;
		this.g = g / 255;

		this._updateHexByRGB();
		this._updateHexNumberByRGB();
	}

	setB(b) {
		this._b = b;
		this.b = b / 255;

		this._updateHexByRGB();
		this._updateHexNumberByRGB();
	}

	setA(a) {
		this._a = a;
	}

	setRGB(r, g, b, a) {
		this._r = r;
		this._g = g;
		this._b = b;
		this._a = a;

		this.r = r / 255;
		this.g = g / 255;
		this.b = b / 255;

		this._updateHexByRGB();
		this._updateHexNumberByRGB();

		return this;
	}

	_updateHexByRGB() {
		this.hex = `#${toHex(this._r)}${toHex(this._g)}${toHex(this._b)}`.toUpperCase();
	}

	_updateHexNumberByRGB() {
		this.hexNumber = (this._r << 16) | (this._g << 8) | this._b;
	}

	setHex(value) {
		const hex = value.replace(/^#/, '');
		let parsed;

		if (hex.length === 3 || hex.length === 6) {
			parsed = hex.length === 3
				? hex.replace(/./g, '$&$&')
				: hex;
		} else {
			throw new Error('Invalid hex format');
		}

		const num = parseInt(parsed, 16);
		if (isNaN(num)) {
			throw new Error('Invalid hex value');
		}

		this._r = (num >> 16) & 0xff;
		this._g = (num >> 8) & 0xff;
		this._b = num & 0xff;

		this.r = this._r / 255;
		this.g = this._g / 255;
		this.b = this._b / 255;

		this.hex = value;
		this.hexNumber = num;

		return this;
	}

	setHexNumber(value) {
		const num = Number(value);
		if (isNaN(num)) {
			throw new Error('Invalid number');
		}

		this._r = (num >> 16) & 0xff;
		this._g = (num >> 8) & 0xff;
		this._b = num & 0xff;

		this.r = this._r / 255;
		this.g = this._g / 255;
		this.b = this._b / 255;

		this._updateHexByRGB();
		this.hexNumber = num;

		return this;
	}

	destroy() {
		this._r =
			this._g =
			this._b =
			this._a =

			this.r =
			this.g =
			this.b =

			this.hex = null;

		delete this._r;
		delete this._g;
		delete this._b;

		delete this.r;
		delete this.g;
		delete this.b;

		delete this._a;

		delete this.hex;
	}
}
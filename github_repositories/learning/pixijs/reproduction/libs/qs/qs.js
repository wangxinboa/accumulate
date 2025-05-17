var Utils = {
	arrayToObject(source) {

		var obj = {};
		for (var i = 0, il = source.length; i < il; ++i) {
			if (typeof source[i] !== 'undefined') {

				obj[i] = source[i];
			}
		}

		return obj;
	},
	clone(source) {

		if (typeof source !== 'object' ||
			source === null) {

			return source;
		}

		if (Buffer.isBuffer(source)) {
			return source.toString();
		}

		var obj = Array.isArray(source) ? [] : {};
		for (var i in source) {
			if (source.hasOwnProperty(i)) {
				obj[i] = clone(source[i]);
			}
		}

		return obj;
	},
	merge(target, source) {

		if (!source) {
			return target;
		}

		var obj = clone(target);

		if (Array.isArray(source)) {
			for (var i = 0, il = source.length; i < il; ++i) {
				if (typeof source[i] !== 'undefined') {
					if (typeof obj[i] === 'object') {
						obj[i] = merge(obj[i], source[i]);
					}
					else {
						obj[i] = source[i];
					}
				}
			}

			return obj;
		}

		if (Array.isArray(obj)) {
			obj = arrayToObject(obj);
		}

		var keys = Object.keys(source);
		for (var k = 0, kl = keys.length; k < kl; ++k) {
			var key = keys[k];
			var value = source[key];

			if (value &&
				typeof value === 'object') {

				if (!obj[key]) {
					obj[key] = clone(value);
				}
				else {
					obj[key] = merge(obj[key], value);
				}
			}
			else {
				obj[key] = value;
			}
		}

		return obj;
	},
	decode(str) {

		try {
			return decodeURIComponent(str.replace(/\+/g, ' '));
		} catch (e) {
			return str;
		}
	},
	compact(obj) {

		if (typeof obj !== 'object' || obj === null) {
			return obj;
		}

		var compacted = {};

		for (var key in obj) {
			if (obj.hasOwnProperty(key)) {
				if (Array.isArray(obj[key])) {
					compacted[key] = [];

					for (var i = 0, l = obj[key].length; i < l; i++) {
						if (typeof obj[key][i] !== 'undefined') {
							compacted[key].push(obj[key][i]);
						}
					}
				}
				else {
					compacted[key] = compact(obj[key]);
				}
			}
		}

		return compacted;
	}
};

var internals = {
	delimiter: '&',
	depth: 5,
	arrayLimit: 20,
	parametersLimit: 1000
};

internals.parseValues = function (str, delimiter) {

	delimiter = typeof delimiter === 'string' ? delimiter : internals.delimiter;

	var obj = {};
	var parts = str.split(delimiter, internals.parametersLimit);

	for (var i = 0, il = parts.length; i < il; ++i) {
		var part = parts[i];
		var pos = part.indexOf(']=') === -1 ? part.indexOf('=') : part.indexOf(']=') + 1;

		if (pos === -1) {
			obj[Utils.decode(part)] = '';
		}
		else {
			var key = Utils.decode(part.slice(0, pos));
			var val = Utils.decode(part.slice(pos + 1));

			if (!obj[key]) {
				obj[key] = val;
			}
			else {
				obj[key] = [].concat(obj[key]).concat(val);
			}
		}
	}

	return obj;
};

internals.parseObject = function (chain, val) {

	if (!chain.length) {
		return val;
	}

	var root = chain.shift();

	var obj = {};
	if (root === '[]') {
		obj = [];
		obj = obj.concat(internals.parseObject(chain, val));
	}
	else {
		var cleanRoot = root[0] === '[' && root[root.length - 1] === ']' ? root.slice(1, root.length - 1) : root;
		var index = parseInt(cleanRoot, 10);
		if (!isNaN(index) &&
			root !== cleanRoot &&
			index <= internals.arrayLimit) {

			obj = [];
			obj[index] = internals.parseObject(chain, val);
		}
		else {
			obj[cleanRoot] = internals.parseObject(chain, val);
		}
	}

	return obj;
};

internals.parseKeys = function (key, val, depth) {

	if (!key) {
		return;
	}

	// The regex chunks

	var parent = /^([^\[\]]*)/;
	var child = /(\[[^\[\]]*\])/g;

	// Get the parent

	var segment = parent.exec(key);

	// Don't allow them to overwrite object prototype properties

	if (Object.prototype.hasOwnProperty(segment[1])) {
		return;
	}

	// Stash the parent if it exists

	var keys = [];
	if (segment[1]) {
		keys.push(segment[1]);
	}

	// Loop through children appending to the array until we hit depth

	var i = 0;
	while ((segment = child.exec(key)) !== null && i < depth) {

		++i;
		if (!Object.prototype.hasOwnProperty(segment[1].replace(/\[|\]/g, ''))) {
			keys.push(segment[1]);
		}
	}

	// If there's a remainder, just add whatever is left

	if (segment) {
		keys.push('[' + key.slice(segment.index) + ']');
	}

	return internals.parseObject(keys, val);
};

internals.stringify = function (obj, prefix) {

	if (Buffer.isBuffer(obj)) {
		obj = obj.toString();
	}
	else if (obj instanceof Date) {
		obj = obj.toISOString();
	}
	else if (obj === null) {
		obj = '';
	}

	if (typeof obj === 'string' ||
		typeof obj === 'number' ||
		typeof obj === 'boolean') {

		return [encodeURIComponent(prefix) + '=' + encodeURIComponent(obj)];
	}

	var values = [];

	for (var key in obj) {
		if (obj.hasOwnProperty(key)) {
			values = values.concat(internals.stringify(obj[key], prefix + '[' + key + ']'));
		}
	}

	return values;
};

var querystring = {
	stringify(obj, delimiter) {

		delimiter = typeof delimiter === 'undefined' ? internals.delimiter : delimiter;

		var keys = [];

		for (var key in obj) {
			if (obj.hasOwnProperty(key)) {
				keys = keys.concat(internals.stringify(obj[key], key));
			}
		}

		return keys.join(delimiter);
	},
	parse(str, depth, delimiter) {

		if (str === '' ||
			str === null ||
			typeof str === 'undefined') {

			return {};
		}

		if (typeof depth !== 'number') {
			delimiter = depth;
			depth = internals.depth;
		}

		var tempObj = typeof str === 'string' ? internals.parseValues(str, delimiter) : Utils.clone(str);
		var obj = {};

		// Iterate over the keys and setup the new object
		//
		for (var key in tempObj) {
			if (tempObj.hasOwnProperty(key)) {
				var newObj = internals.parseKeys(key, tempObj[key], depth);
				obj = Utils.merge(obj, newObj);
			}
		}

		return Utils.compact(obj);
	}
};

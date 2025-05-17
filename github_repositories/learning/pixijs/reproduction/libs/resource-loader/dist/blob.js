'use strict';

var Resource = Loader.Resource;
var b64 = {
	// private property
	_keyStr: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',

	encodeBinary: function (input) {
		var output = '';
		var bytebuffer;
		var encodedCharIndexes = new Array(4);
		var inx = 0;
		var jnx = 0;
		var paddingBytes = 0;

		while (inx < input.length) {
			// Fill byte buffer array
			bytebuffer = new Array(3);

			for (jnx = 0; jnx < bytebuffer.length; jnx++) {
				if (inx < input.length) {
					// throw away high-order byte, as documented at:
					// https://developer.mozilla.org/En/Using_XMLHttpRequest#Handling_binary_data
					bytebuffer[jnx] = input.charCodeAt(inx++) & 0xff;
				}
				else {
					bytebuffer[jnx] = 0;
				}
			}

			// Get each encoded character, 6 bits at a time
			// index 1: first 6 bits
			encodedCharIndexes[0] = bytebuffer[0] >> 2;
			// index 2: second 6 bits (2 least significant bits from input byte 1 + 4 most significant bits from byte 2)
			encodedCharIndexes[1] = ((bytebuffer[0] & 0x3) << 4) | (bytebuffer[1] >> 4);
			// index 3: third 6 bits (4 least significant bits from input byte 2 + 2 most significant bits from byte 3)
			encodedCharIndexes[2] = ((bytebuffer[1] & 0x0f) << 2) | (bytebuffer[2] >> 6);
			// index 3: forth 6 bits (6 least significant bits from input byte 3)
			encodedCharIndexes[3] = bytebuffer[2] & 0x3f;

			// Determine whether padding happened, and adjust accordingly
			paddingBytes = inx - (input.length - 1);
			switch (paddingBytes) {
				case 2:
					// Set last 2 characters to padding char
					encodedCharIndexes[3] = 64;
					encodedCharIndexes[2] = 64;
					break;

				case 1:
					// Set last character to padding char
					encodedCharIndexes[3] = 64;
					break;

				default:
					break; // No padding - proceed
			}

			// Now we will grab each appropriate character out of our keystring
			// based on our index array and append it to the output string
			for (jnx = 0; jnx < encodedCharIndexes.length; jnx++) {
				output += this._keyStr.charAt(encodedCharIndexes[jnx]);
			}
		}

		return output;
	}
};

var Url = window.URL || window.webkitURL;

// a middleware for transforming XHR loaded Blobs into more useful objects

function blobMiddlewareFactory() {
	return function (resource, next) {
		if (!resource.data) {
			next();

			return;
		}

		// if this was an XHR load of a blob
		if (resource.xhr && resource.xhrType === Resource.XHR_RESPONSE_TYPE.BLOB) {
			// if there is no blob support we probably got a binary string back
			if (!window.Blob || typeof resource.data === 'string') {
				var type = resource.xhr.getResponseHeader('content-type');

				// this is an image, convert the binary string into a data url
				if (type && type.indexOf('image') === 0) {
					resource.data = new Image();
					resource.data.src = 'data:' + type + ';base64,' + b64.encodeBinary(resource.xhr.responseText);

					resource.isImage = true;

					// wait until the image loads and then callback
					resource.data.onload = function () {
						resource.data.onload = null;

						next();
					};

					// next will be called on load
					return;
				}
			}
			// if content type says this is an image, then we should transform the blob into an Image object
			else if (resource.data.type.indexOf('image') === 0) {
				var src = Url.createObjectURL(resource.data);

				resource.blob = resource.data;
				resource.data = new Image();
				resource.data.src = src;

				resource.isImage = true;

				// cleanup the no longer used blob after the image loads
				resource.data.onload = function () {
					Url.revokeObjectURL(src);
					resource.data.onload = null;

					next();
				};

				// next will be called on load.
				return;
			}
		}

		next();
	};
};

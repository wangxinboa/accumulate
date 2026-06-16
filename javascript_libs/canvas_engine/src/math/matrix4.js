import { Vector3 } from "./vector3.js";

export class Matrix4 {
	/**
	 * Constructs a new 4x4 matrix. The arguments are supposed to be
	 * in row-major order. If no arguments are provided, the constructor
	 * initializes the matrix as an identity matrix.
	 *
	 * @param {number} [n11] - 1-1 matrix element.
	 * @param {number} [n12] - 1-2 matrix element.
	 * @param {number} [n13] - 1-3 matrix element.
	 * @param {number} [n14] - 1-4 matrix element.
	 * @param {number} [n21] - 2-1 matrix element.
	 * @param {number} [n22] - 2-2 matrix element.
	 * @param {number} [n23] - 2-3 matrix element.
	 * @param {number} [n24] - 2-4 matrix element.
	 * @param {number} [n31] - 3-1 matrix element.
	 * @param {number} [n32] - 3-2 matrix element.
	 * @param {number} [n33] - 3-3 matrix element.
	 * @param {number} [n34] - 3-4 matrix element.
	 * @param {number} [n41] - 4-1 matrix element.
	 * @param {number} [n42] - 4-2 matrix element.
	 * @param {number} [n43] - 4-3 matrix element.
	 * @param {number} [n44] - 4-4 matrix element.
	 */
	constructor(n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44) {
		/**
		 * A column-major list of matrix values.
		 *
		 * @type {Array<number>}
		 */
		this.elements = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];

		if (n11 !== undefined) {
			this.set(
				n11,
				/** @type {number} */ (n12),
				/** @type {number} */ (n13),
				/** @type {number} */ (n14),
				/** @type {number} */ (n21),
				/** @type {number} */ (n22),
				/** @type {number} */ (n23),
				/** @type {number} */ (n24),
				/** @type {number} */ (n31),
				/** @type {number} */ (n32),
				/** @type {number} */ (n33),
				/** @type {number} */ (n34),
				/** @type {number} */ (n41),
				/** @type {number} */ (n42),
				/** @type {number} */ (n43),
				/** @type {number} */ (n44),
			);
		}
	}

	/**
	 * Sets the elements of the matrix.The arguments are supposed to be
	 * in row-major order.
	 *
	 * @param {number} n11 - 1-1 matrix element.
	 * @param {number} n12 - 1-2 matrix element.
	 * @param {number} n13 - 1-3 matrix element.
	 * @param {number} n14 - 1-4 matrix element.
	 * @param {number} n21 - 2-1 matrix element.
	 * @param {number} n22 - 2-2 matrix element.
	 * @param {number} n23 - 2-3 matrix element.
	 * @param {number} n24 - 2-4 matrix element.
	 * @param {number} n31 - 3-1 matrix element.
	 * @param {number} n32 - 3-2 matrix element.
	 * @param {number} n33 - 3-3 matrix element.
	 * @param {number} n34 - 3-4 matrix element.
	 * @param {number} n41 - 4-1 matrix element.
	 * @param {number} n42 - 4-2 matrix element.
	 * @param {number} n43 - 4-3 matrix element.
	 * @param {number} n44 - 4-4 matrix element.
	 * @return {Matrix4} A reference to this matrix.
	 */
	set(n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44) {
		const te = this.elements;

		te[0] = n11;
		te[4] = n12;
		te[8] = n13;
		te[12] = n14;
		te[1] = n21;
		te[5] = n22;
		te[9] = n23;
		te[13] = n24;
		te[2] = n31;
		te[6] = n32;
		te[10] = n33;
		te[14] = n34;
		te[3] = n41;
		te[7] = n42;
		te[11] = n43;
		te[15] = n44;

		return this;
	}

	/**
	 * Sets this matrix to the 4x4 identity matrix.
	 *
	 * @return {Matrix4} A reference to this matrix.
	 */
	identity() {
		this.set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);

		return this;
	}

	/**
	 * Returns a matrix with copied values from this instance.
	 *
	 * @return {Matrix4} A clone of this instance.
	 */
	clone() {
		return new Matrix4().fromArray(this.elements);
	}

	/**
	 * Copies the values of the given matrix to this instance.
	 *
	 * @param {Matrix4} m - The matrix to copy.
	 * @return {Matrix4} A reference to this matrix.
	 */
	copy(m) {
		const te = this.elements;
		const me = m.elements;

		te[0] = me[0];
		te[1] = me[1];
		te[2] = me[2];
		te[3] = me[3];
		te[4] = me[4];
		te[5] = me[5];
		te[6] = me[6];
		te[7] = me[7];
		te[8] = me[8];
		te[9] = me[9];
		te[10] = me[10];
		te[11] = me[11];
		te[12] = me[12];
		te[13] = me[13];
		te[14] = me[14];
		te[15] = me[15];

		return this;
	}

	/**
	 * Copies the translation component of the given matrix
	 * into this matrix's translation component.
	 *
	 * @param {Matrix4} m - The matrix to copy the translation component.
	 * @return {Matrix4} A reference to this matrix.
	 */
	copyPosition(m) {
		const te = this.elements,
			me = m.elements;

		te[12] = me[12];
		te[13] = me[13];
		te[14] = me[14];

		return this;
	}

	/**
	 * Set the upper 3x3 elements of this matrix to the values of given 3x3 matrix.
	 *
	 * @param {CanvasEngineType.Matrix3} m - The 3x3 matrix.
	 * @return {CanvasEngineType.Matrix4} A reference to this matrix.
	 */
	setFromMatrix3(m) {
		const me = m.elements;

		this.set(me[0], me[3], me[6], 0, me[1], me[4], me[7], 0, me[2], me[5], me[8], 0, 0, 0, 0, 1);

		return this;
	}

	/**
	 * Post-multiplies this matrix by the given 4x4 matrix.
	 *
	 * @param {Matrix4} m - The matrix to multiply with.
	 * @return {Matrix4} A reference to this matrix.
	 */
	multiply(m) {
		return this.multiplyMatrices(this, m);
	}

	/**
	 * Pre-multiplies this matrix by the given 4x4 matrix.
	 *
	 * @param {Matrix4} m - The matrix to multiply with.
	 * @return {Matrix4} A reference to this matrix.
	 */
	premultiply(m) {
		return this.multiplyMatrices(m, this);
	}

	/**
	 * Multiples the given 4x4 matrices and stores the result
	 * in this matrix.
	 *
	 * @param {Matrix4} a - The first matrix.
	 * @param {Matrix4} b - The second matrix.
	 * @return {Matrix4} A reference to this matrix.
	 */
	multiplyMatrices(a, b) {
		const ae = a.elements;
		const be = b.elements;
		const te = this.elements;

		const a11 = ae[0],
			a12 = ae[4],
			a13 = ae[8],
			a14 = ae[12];
		const a21 = ae[1],
			a22 = ae[5],
			a23 = ae[9],
			a24 = ae[13];
		const a31 = ae[2],
			a32 = ae[6],
			a33 = ae[10],
			a34 = ae[14];
		const a41 = ae[3],
			a42 = ae[7],
			a43 = ae[11],
			a44 = ae[15];

		const b11 = be[0],
			b12 = be[4],
			b13 = be[8],
			b14 = be[12];
		const b21 = be[1],
			b22 = be[5],
			b23 = be[9],
			b24 = be[13];
		const b31 = be[2],
			b32 = be[6],
			b33 = be[10],
			b34 = be[14];
		const b41 = be[3],
			b42 = be[7],
			b43 = be[11],
			b44 = be[15];

		te[0] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
		te[4] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
		te[8] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
		te[12] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;

		te[1] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
		te[5] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
		te[9] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
		te[13] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;

		te[2] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
		te[6] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
		te[10] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
		te[14] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;

		te[3] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
		te[7] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
		te[11] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
		te[15] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;

		return this;
	}

	/**
	 * Multiplies every component of the matrix by the given scalar.
	 *
	 * @param {number} s - The scalar.
	 * @return {Matrix4} A reference to this matrix.
	 */
	multiplyScalar(s) {
		const te = this.elements;

		te[0] *= s;
		te[4] *= s;
		te[8] *= s;
		te[12] *= s;
		te[1] *= s;
		te[5] *= s;
		te[9] *= s;
		te[13] *= s;
		te[2] *= s;
		te[6] *= s;
		te[10] *= s;
		te[14] *= s;
		te[3] *= s;
		te[7] *= s;
		te[11] *= s;
		te[15] *= s;

		return this;
	}

	/**
	 * Computes and returns the determinant of this matrix.
	 *
	 * Based on the method outlined [here](http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.html).
	 *
	 * @return {number} The determinant.
	 */
	determinant() {
		const te = this.elements;

		const n11 = te[0],
			n12 = te[4],
			n13 = te[8],
			n14 = te[12];
		const n21 = te[1],
			n22 = te[5],
			n23 = te[9],
			n24 = te[13];
		const n31 = te[2],
			n32 = te[6],
			n33 = te[10],
			n34 = te[14];
		const n41 = te[3],
			n42 = te[7],
			n43 = te[11],
			n44 = te[15];

		const t11 = n23 * n34 - n24 * n33;
		const t12 = n22 * n34 - n24 * n32;
		const t13 = n22 * n33 - n23 * n32;

		const t21 = n21 * n34 - n24 * n31;
		const t22 = n21 * n33 - n23 * n31;
		const t23 = n21 * n32 - n22 * n31;

		return (
			n11 * (n42 * t11 - n43 * t12 + n44 * t13) -
			n12 * (n41 * t11 - n43 * t21 + n44 * t22) +
			n13 * (n41 * t12 - n42 * t21 + n44 * t23) -
			n14 * (n41 * t13 - n42 * t22 + n43 * t23)
		);
	}

	/**
	 * Transposes this matrix in place.
	 *
	 * @return {Matrix4} A reference to this matrix.
	 */
	transpose() {
		const te = this.elements;
		let tmp;

		tmp = te[1];
		te[1] = te[4];
		te[4] = tmp;
		tmp = te[2];
		te[2] = te[8];
		te[8] = tmp;
		tmp = te[6];
		te[6] = te[9];
		te[9] = tmp;

		tmp = te[3];
		te[3] = te[12];
		te[12] = tmp;
		tmp = te[7];
		te[7] = te[13];
		te[13] = tmp;
		tmp = te[11];
		te[11] = te[14];
		te[14] = tmp;

		return this;
	}

	/**
	 * Sets the position component for this matrix from the given vector,
	 * without affecting the rest of the matrix.
	 *
	 * @param {number|Vector3} x - The x component of the vector or alternatively the vector object.
	 * @param {number} y - The y component of the vector.
	 * @param {number} z - The z component of the vector.
	 * @return {Matrix4} A reference to this matrix.
	 */
	setPosition(x, y, z) {
		const te = this.elements;

		if (x instanceof Vector3) {
			te[12] = x.x;
			te[13] = x.y;
			te[14] = x.z;
		} else {
			te[12] = x;
			te[13] = y;
			te[14] = z;
		}

		return this;
	}

	/**
	 * Inverts this matrix, using the [analytic method](https://en.wikipedia.org/wiki/Invertible_matrix#Analytic_solution).
	 * You can not invert with a determinant of zero. If you attempt this, the method produces
	 * a zero matrix instead.
	 *
	 * @return {Matrix4} A reference to this matrix.
	 */
	invert() {
		// based on https://github.com/toji/gl-matrix
		const te = this.elements,
			n11 = te[0],
			n21 = te[1],
			n31 = te[2],
			n41 = te[3],
			n12 = te[4],
			n22 = te[5],
			n32 = te[6],
			n42 = te[7],
			n13 = te[8],
			n23 = te[9],
			n33 = te[10],
			n43 = te[11],
			n14 = te[12],
			n24 = te[13],
			n34 = te[14],
			n44 = te[15],
			t1 = n11 * n22 - n21 * n12,
			t2 = n11 * n32 - n31 * n12,
			t3 = n11 * n42 - n41 * n12,
			t4 = n21 * n32 - n31 * n22,
			t5 = n21 * n42 - n41 * n22,
			t6 = n31 * n42 - n41 * n32,
			t7 = n13 * n24 - n23 * n14,
			t8 = n13 * n34 - n33 * n14,
			t9 = n13 * n44 - n43 * n14,
			t10 = n23 * n34 - n33 * n24,
			t11 = n23 * n44 - n43 * n24,
			t12 = n33 * n44 - n43 * n34;

		const det = t1 * t12 - t2 * t11 + t3 * t10 + t4 * t9 - t5 * t8 + t6 * t7;

		if (det === 0) return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);

		const detInv = 1 / det;

		te[0] = (n22 * t12 - n32 * t11 + n42 * t10) * detInv;
		te[1] = (n31 * t11 - n21 * t12 - n41 * t10) * detInv;
		te[2] = (n24 * t6 - n34 * t5 + n44 * t4) * detInv;
		te[3] = (n33 * t5 - n23 * t6 - n43 * t4) * detInv;

		te[4] = (n32 * t9 - n12 * t12 - n42 * t8) * detInv;
		te[5] = (n11 * t12 - n31 * t9 + n41 * t8) * detInv;
		te[6] = (n34 * t3 - n14 * t6 - n44 * t2) * detInv;
		te[7] = (n13 * t6 - n33 * t3 + n43 * t2) * detInv;

		te[8] = (n12 * t11 - n22 * t9 + n42 * t7) * detInv;
		te[9] = (n21 * t9 - n11 * t11 - n41 * t7) * detInv;
		te[10] = (n14 * t5 - n24 * t3 + n44 * t1) * detInv;
		te[11] = (n23 * t3 - n13 * t5 - n43 * t1) * detInv;

		te[12] = (n22 * t8 - n12 * t10 - n32 * t7) * detInv;
		te[13] = (n11 * t10 - n21 * t8 + n31 * t7) * detInv;
		te[14] = (n24 * t2 - n14 * t4 - n34 * t1) * detInv;
		te[15] = (n13 * t4 - n23 * t2 + n33 * t1) * detInv;

		return this;
	}

	/**
	 * Multiplies the columns of this matrix by the given vector.
	 *
	 * @param {Vector3} v - The scale vector.
	 * @return {Matrix4} A reference to this matrix.
	 */
	scale(v) {
		const te = this.elements;
		const x = v.x,
			y = v.y,
			z = v.z;

		te[0] *= x;
		te[4] *= y;
		te[8] *= z;
		te[1] *= x;
		te[5] *= y;
		te[9] *= z;
		te[2] *= x;
		te[6] *= y;
		te[10] *= z;
		te[3] *= x;
		te[7] *= y;
		te[11] *= z;

		return this;
	}

	/**
	 * Gets the maximum scale value of the three axes.
	 *
	 * @return {number} The maximum scale.
	 */
	getMaxScaleOnAxis() {
		const te = this.elements;

		const scaleXSq = te[0] * te[0] + te[1] * te[1] + te[2] * te[2];
		const scaleYSq = te[4] * te[4] + te[5] * te[5] + te[6] * te[6];
		const scaleZSq = te[8] * te[8] + te[9] * te[9] + te[10] * te[10];

		return Math.sqrt(Math.max(scaleXSq, scaleYSq, scaleZSq));
	}

	/**
	 * Sets this matrix as a translation transform from the given vector.
	 *
	 * @param {number|Vector3} x - The amount to translate in the X axis or alternatively a translation vector.
	 * @param {number} y - The amount to translate in the Y axis.
	 * @param {number} z - The amount to translate in the z axis.
	 * @return {Matrix4} A reference to this matrix.
	 */
	makeTranslation(x, y, z) {
		if (x instanceof Vector3) {
			this.set(1, 0, 0, x.x, 0, 1, 0, x.y, 0, 0, 1, x.z, 0, 0, 0, 1);
		} else {
			this.set(1, 0, 0, x, 0, 1, 0, y, 0, 0, 1, z, 0, 0, 0, 1);
		}

		return this;
	}

	/**
	 * Sets this matrix as a rotational transformation around the X axis by
	 * the given angle.
	 *
	 * @param {number} theta - The rotation in radians.
	 * @return {Matrix4} A reference to this matrix.
	 */
	makeRotationX(theta) {
		const c = Math.cos(theta),
			s = Math.sin(theta);

		this.set(1, 0, 0, 0, 0, c, -s, 0, 0, s, c, 0, 0, 0, 0, 1);

		return this;
	}

	/**
	 * Sets this matrix as a rotational transformation around the Y axis by
	 * the given angle.
	 *
	 * @param {number} theta - The rotation in radians.
	 * @return {Matrix4} A reference to this matrix.
	 */
	makeRotationY(theta) {
		const c = Math.cos(theta),
			s = Math.sin(theta);

		this.set(c, 0, s, 0, 0, 1, 0, 0, -s, 0, c, 0, 0, 0, 0, 1);

		return this;
	}

	/**
	 * Sets this matrix as a rotational transformation around the Z axis by
	 * the given angle.
	 *
	 * @param {number} theta - The rotation in radians.
	 * @return {Matrix4} A reference to this matrix.
	 */
	makeRotationZ(theta) {
		const c = Math.cos(theta),
			s = Math.sin(theta);

		this.set(c, -s, 0, 0, s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);

		return this;
	}

	/**
	 * Sets this matrix as a rotational transformation around the given axis by
	 * the given angle.
	 *
	 * This is a somewhat controversial but mathematically sound alternative to
	 * rotating via Quaternions. See the discussion [here](https://www.gamedev.net/articles/programming/math-and-physics/do-we-really-need-quaternions-r1199).
	 *
	 * @param {Vector3} axis - The normalized rotation axis.
	 * @param {number} angle - The rotation in radians.
	 * @return {Matrix4} A reference to this matrix.
	 */
	makeRotationAxis(axis, angle) {
		// Based on http://www.gamedev.net/reference/articles/article1199.asp

		const c = Math.cos(angle);
		const s = Math.sin(angle);
		const t = 1 - c;
		const x = axis.x,
			y = axis.y,
			z = axis.z;
		const tx = t * x,
			ty = t * y;

		this.set(
			tx * x + c,
			tx * y - s * z,
			tx * z + s * y,
			0,
			tx * y + s * z,
			ty * y + c,
			ty * z - s * x,
			0,
			tx * z - s * y,
			ty * z + s * x,
			t * z * z + c,
			0,
			0,
			0,
			0,
			1,
		);

		return this;
	}

	/**
	 * Sets this matrix as a scale transformation.
	 *
	 * @param {number} x - The amount to scale in the X axis.
	 * @param {number} y - The amount to scale in the Y axis.
	 * @param {number} z - The amount to scale in the Z axis.
	 * @return {Matrix4} A reference to this matrix.
	 */
	makeScale(x, y, z) {
		this.set(x, 0, 0, 0, 0, y, 0, 0, 0, 0, z, 0, 0, 0, 0, 1);

		return this;
	}

	/**
	 * Sets this matrix as a shear transformation.
	 *
	 * @param {number} xy - The amount to shear X by Y.
	 * @param {number} xz - The amount to shear X by Z.
	 * @param {number} yx - The amount to shear Y by X.
	 * @param {number} yz - The amount to shear Y by Z.
	 * @param {number} zx - The amount to shear Z by X.
	 * @param {number} zy - The amount to shear Z by Y.
	 * @return {Matrix4} A reference to this matrix.
	 */
	makeShear(xy, xz, yx, yz, zx, zy) {
		this.set(1, yx, zx, 0, xy, 1, zy, 0, xz, yz, 1, 0, 0, 0, 0, 1);

		return this;
	}

	/**
	 * Returns `true` if this matrix is equal with the given one.
	 *
	 * @param {Matrix4} matrix - The matrix to test for equality.
	 * @return {boolean} Whether this matrix is equal with the given one.
	 */
	equals(matrix) {
		const te = this.elements;
		const me = matrix.elements;

		for (let i = 0; i < 16; i++) {
			if (te[i] !== me[i]) return false;
		}

		return true;
	}

	/**
	 * Sets the elements of the matrix from the given array.
	 *
	 * @param {Array<number>} array - The matrix elements in column-major order.
	 * @param {number} [offset=0] - Index of the first element in the array.
	 * @return {Matrix4} A reference to this matrix.
	 */
	fromArray(array, offset = 0) {
		for (let i = 0; i < 16; i++) {
			this.elements[i] = array[i + offset];
		}

		return this;
	}

	/**
	 * Writes the elements of this matrix to the given array. If no array is provided,
	 * the method returns a new instance.
	 *
	 * @param {Array<number>} [array=[]] - The target array holding the matrix elements in column-major order.
	 * @param {number} [offset=0] - Index of the first element in the array.
	 * @return {Array<number>} The matrix elements in column-major order.
	 */
	toArray(array = [], offset = 0) {
		const te = this.elements;

		array[offset] = te[0];
		array[offset + 1] = te[1];
		array[offset + 2] = te[2];
		array[offset + 3] = te[3];

		array[offset + 4] = te[4];
		array[offset + 5] = te[5];
		array[offset + 6] = te[6];
		array[offset + 7] = te[7];

		array[offset + 8] = te[8];
		array[offset + 9] = te[9];
		array[offset + 10] = te[10];
		array[offset + 11] = te[11];

		array[offset + 12] = te[12];
		array[offset + 13] = te[13];
		array[offset + 14] = te[14];
		array[offset + 15] = te[15];

		return array;
	}
}

export const initializeMatrix4 = new Matrix4();

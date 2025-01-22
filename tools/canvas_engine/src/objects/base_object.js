
export default function createObjectClass(ObjectClass) {
	return class BaseObject extends ObjectClass {
		constructor(scene, option) {
			super(option);
			this.isObject = true;

			this.visible = true;

			this.scene = scene;
			this.scene.addObject(this);

			this.parent = null;
			this.children = [];
		}

		add(object) {
			const index = this.children.indexOf(object);
			if (index === - 1) {
				if (object.parent !== null) {
					object.parent.remove(object);
				}
				object.parent = this;
				this.children.push(object);
				this.scene.addObject(object);

				// 根据全局矩阵
				this.updateMatrixWorld();
			}
			return this;
		}
		remove(object) {
			const index = this.children.indexOf(object);
			if (index !== - 1) {

				object.parent = null;
				this.children.splice(index, 1);
				this.scene.removeObject(object);
			}
			return this;
		}

		eachAfter(callback, that) {
			var node = this, nodes = [node], next = [], children, i, n, index = -1;
			while (node = nodes.pop()) {
				next.push(node);
				if (children = node.children) {
					for (i = 0, n = children.length; i < n; ++i) {
						nodes.push(children[i]);
					}
				}
			}
			while (node = next.pop()) {
				callback.call(that, node, ++index, this);
			}
			return this;
		}
		eachBefore(callback, that) {
			var node = this, nodes = [node], children, i, index = -1;
			while (node = nodes.pop()) {
				callback.call(that, node, ++index, this);
				if (children = node.children) {
					for (i = children.length - 1; i >= 0; --i) {
						nodes.push(children[i]);
					}
				}
			}
			return this;
		}
	}
}

import { VertexBuffer } from "../../Buffers/buffer.js";

import { EffectWrapper } from "../../Materials/effectRenderer.js";
import { FluidRenderingObject } from "./fluidRenderingObject.js";
/**
 * Defines a rendering object based on a list of custom buffers
 * The list must contain at least a "position" buffer!
 */
export class FluidRenderingObjectCustomParticles extends FluidRenderingObject {
    /**
     * @returns the name of the class
     */
    getClassName() {
        return "FluidRenderingObjectCustomParticles";
    }
    /**
     * Gets the vertex buffers
     */
    get vertexBuffers() {
        return this._vertexBuffers;
    }
    /**
     * Creates a new instance of the class
     * @param scene The scene the particles should be rendered into
     * @param buffers The list of buffers (must contain at least one "position" buffer!). Note that you don't have to pass all (or any!) buffers at once in the constructor, you can use the addBuffers method to add more later.
     * @param numParticles Number of vertices to take into account from the buffers
     */
    constructor(scene, buffers, numParticles) {
        super(scene);
        this._numParticles = numParticles;
        this._diffuseEffectWrapper = null;
        this._vertexBuffers = {};
        this.addBuffers(buffers);
    }
    /**
     * Add some new buffers
     * @param buffers List of buffers
     */
    addBuffers(buffers) {
        for (const name in buffers) {
            let stride;
            let instanced = true;
            switch (name) {
                case "velocity":
                    stride = 3;
                    break;
                case "offset":
                    instanced = false;
                    break;
            }
            this._vertexBuffers[name] = new VertexBuffer(this._engine, buffers[name], name, true, false, stride, instanced);
        }
    }
    _createEffects() {
        super._createEffects();
        const uniformNames = ["view", "projection", "size"];
        const attributeNames = ["position", "offset", "color"];
        this._diffuseEffectWrapper = new EffectWrapper({
            engine: this._engine,
            useShaderStore: true,
            vertexShader: "fluidRenderingParticleDiffuse",
            fragmentShader: "fluidRenderingParticleDiffuse",
            attributeNames,
            uniformNames,
            samplerNames: [],
        });
    }
    /**
     * Indicates if the object is ready to be rendered
     * @returns True if everything is ready for the object to be rendered, otherwise false
     */
    isReady() {
        if (!this._vertexBuffers["offset"]) {
            this._vertexBuffers["offset"] = new VertexBuffer(this._engine, [0, 0, 1, 0, 0, 1, 1, 1], "offset", false, false, 2);
        }
        return super.isReady() && (this._diffuseEffectWrapper?.effect.isReady() ?? false);
    }
    /**
     * Gets the number of particles in this object
     * @returns The number of particles
     */
    get numParticles() {
        return this._numParticles;
    }
    /**
     * Sets the number of particles in this object
     * @param num The number of particles to take into account
     */
    setNumParticles(num) {
        this._numParticles = num;
    }
    /**
     * Render the diffuse texture for this object
     */
    renderDiffuseTexture() {
        const numParticles = this.numParticles;
        if (!this._diffuseEffectWrapper || numParticles === 0) {
            return;
        }
        const diffuseDrawWrapper = this._diffuseEffectWrapper._drawWrapper;
        const diffuseEffect = diffuseDrawWrapper.effect;
        this._engine.enableEffect(diffuseDrawWrapper);
        this._engine.bindBuffers(this.vertexBuffers, this.indexBuffer, diffuseEffect);
        diffuseEffect.setMatrix("view", this._scene.getViewMatrix());
        diffuseEffect.setMatrix("projection", this._scene.getProjectionMatrix());
        if (this._particleSize !== null) {
            diffuseEffect.setFloat2("size", this._particleSize, this._particleSize);
        }
        if (this.useInstancing) {
            this._engine.drawArraysType(7, 0, 4, numParticles);
        }
        else {
            this._engine.drawElementsType(0, 0, numParticles);
        }
    }
    /**
     * Releases the ressources used by the class
     */
    dispose() {
        super.dispose();
        this._diffuseEffectWrapper?.dispose();
        for (const name in this._vertexBuffers) {
            this._vertexBuffers[name].dispose();
        }
        this._vertexBuffers = {};
    }
}
//# sourceMappingURL=fluidRenderingObjectCustomParticles.js.map
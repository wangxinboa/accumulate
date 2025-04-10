import { __decorate } from "../tslib.es6.js";
import { serialize, serializeAsColor4, serializeAsCameraReference } from "../Misc/decorators.js";
import { Tools } from "../Misc/tools.js";
import { Observable } from "../Misc/observable.js";
import { Color4 } from "../Maths/math.color.js";
import { EngineStore } from "../Engines/engineStore.js";
import { VertexBuffer } from "../Buffers/buffer.js";
import { Texture } from "../Materials/Textures/texture.js";
import { RenderTargetTexture } from "../Materials/Textures/renderTargetTexture.js";
import { Material } from "../Materials/material.js";

import "../Shaders/glowMapGeneration.fragment.js";
import "../Shaders/glowMapGeneration.vertex.js";
import { _WarnImport } from "../Misc/devTools.js";
import { EffectFallbacks } from "../Materials/effectFallbacks.js";
import { DrawWrapper } from "../Materials/drawWrapper.js";
import { addClipPlaneUniforms, bindClipPlane, prepareStringDefinesForClipPlanes } from "../Materials/clipPlaneMaterialHelper.js";
import { BindMorphTargetParameters, PrepareAttributesForMorphTargetsInfluencers, PushAttributesForInstances } from "../Materials/materialHelper.functions.js";
import { GetExponentOfTwo } from "../Misc/tools.functions.js";
/**
 * The effect layer Helps adding post process effect blended with the main pass.
 *
 * This can be for instance use to generate glow or highlight effects on the scene.
 *
 * The effect layer class can not be used directly and is intented to inherited from to be
 * customized per effects.
 */
export class EffectLayer {
    /**
     * Gets the camera attached to the layer.
     */
    get camera() {
        return this._effectLayerOptions.camera;
    }
    /**
     * Gets the rendering group id the layer should render in.
     */
    get renderingGroupId() {
        return this._effectLayerOptions.renderingGroupId;
    }
    set renderingGroupId(renderingGroupId) {
        this._effectLayerOptions.renderingGroupId = renderingGroupId;
    }
    /**
     * Gets the main texture where the effect is rendered
     */
    get mainTexture() {
        return this._mainTexture;
    }
    /**
     * Sets a specific material to be used to render a mesh/a list of meshes in the layer
     * @param mesh mesh or array of meshes
     * @param material material to use by the layer when rendering the mesh(es). If undefined is passed, the specific material created by the layer will be used.
     */
    setMaterialForRendering(mesh, material) {
        this._mainTexture.setMaterialForRendering(mesh, material);
        if (Array.isArray(mesh)) {
            for (let i = 0; i < mesh.length; ++i) {
                const currentMesh = mesh[i];
                if (!material) {
                    delete this._materialForRendering[currentMesh.uniqueId];
                }
                else {
                    this._materialForRendering[currentMesh.uniqueId] = [currentMesh, material];
                }
            }
        }
        else {
            if (!material) {
                delete this._materialForRendering[mesh.uniqueId];
            }
            else {
                this._materialForRendering[mesh.uniqueId] = [mesh, material];
            }
        }
    }
    /**
     * Gets the intensity of the effect for a specific mesh.
     * @param mesh The mesh to get the effect intensity for
     * @returns The intensity of the effect for the mesh
     */
    getEffectIntensity(mesh) {
        return this._effectIntensity[mesh.uniqueId] ?? 1;
    }
    /**
     * Sets the intensity of the effect for a specific mesh.
     * @param mesh The mesh to set the effect intensity for
     * @param intensity The intensity of the effect for the mesh
     */
    setEffectIntensity(mesh, intensity) {
        this._effectIntensity[mesh.uniqueId] = intensity;
    }
    /**
     * Instantiates a new effect Layer and references it in the scene.
     * @param name The name of the layer
     * @param scene The scene to use the layer in
     */
    constructor(
    /** The Friendly of the effect in the scene */
    name, scene) {
        this._vertexBuffers = {};
        this._maxSize = 0;
        this._mainTextureDesiredSize = { width: 0, height: 0 };
        this._shouldRender = true;
        this._postProcesses = [];
        this._textures = [];
        this._emissiveTextureAndColor = { texture: null, color: new Color4() };
        this._effectIntensity = {};
        /**
         * The clear color of the texture used to generate the glow map.
         */
        this.neutralColor = new Color4();
        /**
         * Specifies whether the highlight layer is enabled or not.
         */
        this.isEnabled = true;
        /**
         * Specifies if the bounding boxes should be rendered normally or if they should undergo the effect of the layer
         */
        this.disableBoundingBoxesFromEffectLayer = false;
        /**
         * An event triggered when the effect layer has been disposed.
         */
        this.onDisposeObservable = new Observable();
        /**
         * An event triggered when the effect layer is about rendering the main texture with the glowy parts.
         */
        this.onBeforeRenderMainTextureObservable = new Observable();
        /**
         * An event triggered when the generated texture is being merged in the scene.
         */
        this.onBeforeComposeObservable = new Observable();
        /**
         * An event triggered when the mesh is rendered into the effect render target.
         */
        this.onBeforeRenderMeshToEffect = new Observable();
        /**
         * An event triggered after the mesh has been rendered into the effect render target.
         */
        this.onAfterRenderMeshToEffect = new Observable();
        /**
         * An event triggered when the generated texture has been merged in the scene.
         */
        this.onAfterComposeObservable = new Observable();
        /**
         * An event triggered when the effect layer changes its size.
         */
        this.onSizeChangedObservable = new Observable();
        this._materialForRendering = {};
        this.name = name;
        this._scene = scene || EngineStore.LastCreatedScene;
        EffectLayer._SceneComponentInitialization(this._scene);
        this._engine = this._scene.getEngine();
        this._maxSize = this._engine.getCaps().maxTextureSize;
        this._scene.effectLayers.push(this);
        this._mergeDrawWrapper = [];
        // Generate Buffers
        this._generateIndexBuffer();
        this._generateVertexBuffer();
    }
    /**
     * Number of times _internalRender will be called. Some effect layers need to render the mesh several times, so they should override this method with the number of times the mesh should be rendered
     * @returns Number of times a mesh must be rendered in the layer
     */
    _numInternalDraws() {
        return 1;
    }
    /**
     * Initializes the effect layer with the required options.
     * @param options Sets of none mandatory options to use with the layer (see IEffectLayerOptions for more information)
     */
    _init(options) {
        // Adapt options
        this._effectLayerOptions = {
            mainTextureRatio: 0.5,
            alphaBlendingMode: 2,
            camera: null,
            renderingGroupId: -1,
            mainTextureType: 0,
            generateStencilBuffer: false,
            ...options,
        };
        this._setMainTextureSize();
        this._createMainTexture();
        this._createTextureAndPostProcesses();
    }
    /**
     * Generates the index buffer of the full screen quad blending to the main canvas.
     */
    _generateIndexBuffer() {
        // Indices
        const indices = [];
        indices.push(0);
        indices.push(1);
        indices.push(2);
        indices.push(0);
        indices.push(2);
        indices.push(3);
        this._indexBuffer = this._engine.createIndexBuffer(indices);
    }
    /**
     * Generates the vertex buffer of the full screen quad blending to the main canvas.
     */
    _generateVertexBuffer() {
        // VBO
        const vertices = [];
        vertices.push(1, 1);
        vertices.push(-1, 1);
        vertices.push(-1, -1);
        vertices.push(1, -1);
        const vertexBuffer = new VertexBuffer(this._engine, vertices, VertexBuffer.PositionKind, false, false, 2);
        this._vertexBuffers[VertexBuffer.PositionKind] = vertexBuffer;
    }
    /**
     * Sets the main texture desired size which is the closest power of two
     * of the engine canvas size.
     */
    _setMainTextureSize() {
        if (this._effectLayerOptions.mainTextureFixedSize) {
            this._mainTextureDesiredSize.width = this._effectLayerOptions.mainTextureFixedSize;
            this._mainTextureDesiredSize.height = this._effectLayerOptions.mainTextureFixedSize;
        }
        else {
            this._mainTextureDesiredSize.width = this._engine.getRenderWidth() * this._effectLayerOptions.mainTextureRatio;
            this._mainTextureDesiredSize.height = this._engine.getRenderHeight() * this._effectLayerOptions.mainTextureRatio;
            this._mainTextureDesiredSize.width = this._engine.needPOTTextures
                ? GetExponentOfTwo(this._mainTextureDesiredSize.width, this._maxSize)
                : this._mainTextureDesiredSize.width;
            this._mainTextureDesiredSize.height = this._engine.needPOTTextures
                ? GetExponentOfTwo(this._mainTextureDesiredSize.height, this._maxSize)
                : this._mainTextureDesiredSize.height;
        }
        this._mainTextureDesiredSize.width = Math.floor(this._mainTextureDesiredSize.width);
        this._mainTextureDesiredSize.height = Math.floor(this._mainTextureDesiredSize.height);
    }
    /**
     * Creates the main texture for the effect layer.
     */
    _createMainTexture() {
        this._mainTexture = new RenderTargetTexture("EffectLayerMainRTT", {
            width: this._mainTextureDesiredSize.width,
            height: this._mainTextureDesiredSize.height,
        }, this._scene, false, true, this._effectLayerOptions.mainTextureType, false, Texture.TRILINEAR_SAMPLINGMODE, true, this._effectLayerOptions.generateStencilBuffer);
        this._mainTexture.activeCamera = this._effectLayerOptions.camera;
        this._mainTexture.wrapU = Texture.CLAMP_ADDRESSMODE;
        this._mainTexture.wrapV = Texture.CLAMP_ADDRESSMODE;
        this._mainTexture.anisotropicFilteringLevel = 1;
        this._mainTexture.updateSamplingMode(Texture.BILINEAR_SAMPLINGMODE);
        this._mainTexture.renderParticles = false;
        this._mainTexture.renderList = null;
        this._mainTexture.ignoreCameraViewport = true;
        for (const id in this._materialForRendering) {
            const [mesh, material] = this._materialForRendering[id];
            this._mainTexture.setMaterialForRendering(mesh, material);
        }
        this._mainTexture.customIsReadyFunction = (mesh, refreshRate, preWarm) => {
            if ((preWarm || refreshRate === 0) && mesh.subMeshes) {
                for (let i = 0; i < mesh.subMeshes.length; ++i) {
                    const subMesh = mesh.subMeshes[i];
                    const material = subMesh.getMaterial();
                    const renderingMesh = subMesh.getRenderingMesh();
                    if (!material) {
                        continue;
                    }
                    const batch = renderingMesh._getInstancesRenderList(subMesh._id, !!subMesh.getReplacementMesh());
                    const hardwareInstancedRendering = batch.hardwareInstancedRendering[subMesh._id] || renderingMesh.hasThinInstances;
                    this._setEmissiveTextureAndColor(renderingMesh, subMesh, material);
                    if (!this._isReady(subMesh, hardwareInstancedRendering, this._emissiveTextureAndColor.texture)) {
                        return false;
                    }
                }
            }
            return true;
        };
        // Custom render function
        this._mainTexture.customRenderFunction = (opaqueSubMeshes, alphaTestSubMeshes, transparentSubMeshes, depthOnlySubMeshes) => {
            this.onBeforeRenderMainTextureObservable.notifyObservers(this);
            let index;
            const engine = this._scene.getEngine();
            if (depthOnlySubMeshes.length) {
                engine.setColorWrite(false);
                for (index = 0; index < depthOnlySubMeshes.length; index++) {
                    this._renderSubMesh(depthOnlySubMeshes.data[index]);
                }
                engine.setColorWrite(true);
            }
            for (index = 0; index < opaqueSubMeshes.length; index++) {
                this._renderSubMesh(opaqueSubMeshes.data[index]);
            }
            for (index = 0; index < alphaTestSubMeshes.length; index++) {
                this._renderSubMesh(alphaTestSubMeshes.data[index]);
            }
            const previousAlphaMode = engine.getAlphaMode();
            for (index = 0; index < transparentSubMeshes.length; index++) {
                this._renderSubMesh(transparentSubMeshes.data[index], true);
            }
            engine.setAlphaMode(previousAlphaMode);
        };
        this._mainTexture.onClearObservable.add((engine) => {
            engine.clear(this.neutralColor, true, true, true);
        });
        // Prevent package size in es6 (getBoundingBoxRenderer might not be present)
        if (this._scene.getBoundingBoxRenderer) {
            const boundingBoxRendererEnabled = this._scene.getBoundingBoxRenderer().enabled;
            this._mainTexture.onBeforeBindObservable.add(() => {
                this._scene.getBoundingBoxRenderer().enabled = !this.disableBoundingBoxesFromEffectLayer && boundingBoxRendererEnabled;
            });
            this._mainTexture.onAfterUnbindObservable.add(() => {
                this._scene.getBoundingBoxRenderer().enabled = boundingBoxRendererEnabled;
            });
        }
    }
    /**
     * Adds specific effects defines.
     * @param defines The defines to add specifics to.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _addCustomEffectDefines(defines) {
        // Nothing to add by default.
    }
    /**
     * Checks for the readiness of the element composing the layer.
     * @param subMesh the mesh to check for
     * @param useInstances specify whether or not to use instances to render the mesh
     * @param emissiveTexture the associated emissive texture used to generate the glow
     * @returns true if ready otherwise, false
     */
    _isReady(subMesh, useInstances, emissiveTexture) {
        const engine = this._scene.getEngine();
        const mesh = subMesh.getMesh();
        const renderingMaterial = mesh._internalAbstractMeshDataInfo._materialForRenderPass?.[engine.currentRenderPassId];
        if (renderingMaterial) {
            return renderingMaterial.isReadyForSubMesh(mesh, subMesh, useInstances);
        }
        const material = subMesh.getMaterial();
        if (!material) {
            return false;
        }
        if (this._useMeshMaterial(subMesh.getRenderingMesh())) {
            return material.isReadyForSubMesh(subMesh.getMesh(), subMesh, useInstances);
        }
        const defines = [];
        const attribs = [VertexBuffer.PositionKind];
        let uv1 = false;
        let uv2 = false;
        // Diffuse
        if (material) {
            const needAlphaTest = material.needAlphaTesting();
            const diffuseTexture = material.getAlphaTestTexture();
            const needAlphaBlendFromDiffuse = diffuseTexture && diffuseTexture.hasAlpha && (material.useAlphaFromDiffuseTexture || material._useAlphaFromAlbedoTexture);
            if (diffuseTexture && (needAlphaTest || needAlphaBlendFromDiffuse)) {
                defines.push("#define DIFFUSE");
                if (mesh.isVerticesDataPresent(VertexBuffer.UV2Kind) && diffuseTexture.coordinatesIndex === 1) {
                    defines.push("#define DIFFUSEUV2");
                    uv2 = true;
                }
                else if (mesh.isVerticesDataPresent(VertexBuffer.UVKind)) {
                    defines.push("#define DIFFUSEUV1");
                    uv1 = true;
                }
                if (needAlphaTest) {
                    defines.push("#define ALPHATEST");
                    defines.push("#define ALPHATESTVALUE 0.4");
                }
                if (!diffuseTexture.gammaSpace) {
                    defines.push("#define DIFFUSE_ISLINEAR");
                }
            }
            const opacityTexture = material.opacityTexture;
            if (opacityTexture) {
                defines.push("#define OPACITY");
                if (mesh.isVerticesDataPresent(VertexBuffer.UV2Kind) && opacityTexture.coordinatesIndex === 1) {
                    defines.push("#define OPACITYUV2");
                    uv2 = true;
                }
                else if (mesh.isVerticesDataPresent(VertexBuffer.UVKind)) {
                    defines.push("#define OPACITYUV1");
                    uv1 = true;
                }
            }
        }
        // Emissive
        if (emissiveTexture) {
            defines.push("#define EMISSIVE");
            if (mesh.isVerticesDataPresent(VertexBuffer.UV2Kind) && emissiveTexture.coordinatesIndex === 1) {
                defines.push("#define EMISSIVEUV2");
                uv2 = true;
            }
            else if (mesh.isVerticesDataPresent(VertexBuffer.UVKind)) {
                defines.push("#define EMISSIVEUV1");
                uv1 = true;
            }
            if (!emissiveTexture.gammaSpace) {
                defines.push("#define EMISSIVE_ISLINEAR");
            }
        }
        // Vertex
        if (mesh.useVertexColors && mesh.isVerticesDataPresent(VertexBuffer.ColorKind) && mesh.hasVertexAlpha && material.transparencyMode !== Material.MATERIAL_OPAQUE) {
            attribs.push(VertexBuffer.ColorKind);
            defines.push("#define VERTEXALPHA");
        }
        if (uv1) {
            attribs.push(VertexBuffer.UVKind);
            defines.push("#define UV1");
        }
        if (uv2) {
            attribs.push(VertexBuffer.UV2Kind);
            defines.push("#define UV2");
        }
        // Bones
        const fallbacks = new EffectFallbacks();
        if (mesh.useBones && mesh.computeBonesUsingShaders) {
            attribs.push(VertexBuffer.MatricesIndicesKind);
            attribs.push(VertexBuffer.MatricesWeightsKind);
            if (mesh.numBoneInfluencers > 4) {
                attribs.push(VertexBuffer.MatricesIndicesExtraKind);
                attribs.push(VertexBuffer.MatricesWeightsExtraKind);
            }
            defines.push("#define NUM_BONE_INFLUENCERS " + mesh.numBoneInfluencers);
            const skeleton = mesh.skeleton;
            if (skeleton && skeleton.isUsingTextureForMatrices) {
                defines.push("#define BONETEXTURE");
            }
            else {
                defines.push("#define BonesPerMesh " + (skeleton ? skeleton.bones.length + 1 : 0));
            }
            if (mesh.numBoneInfluencers > 0) {
                fallbacks.addCPUSkinningFallback(0, mesh);
            }
        }
        else {
            defines.push("#define NUM_BONE_INFLUENCERS 0");
        }
        // Morph targets
        const manager = mesh.morphTargetManager;
        let morphInfluencers = 0;
        if (manager) {
            morphInfluencers = manager.numMaxInfluencers || manager.numInfluencers;
            if (morphInfluencers > 0) {
                defines.push("#define MORPHTARGETS");
                defines.push("#define NUM_MORPH_INFLUENCERS " + morphInfluencers);
                if (manager.isUsingTextureForTargets) {
                    defines.push("#define MORPHTARGETS_TEXTURE");
                }
                PrepareAttributesForMorphTargetsInfluencers(attribs, mesh, morphInfluencers);
            }
        }
        // Instances
        if (useInstances) {
            defines.push("#define INSTANCES");
            PushAttributesForInstances(attribs);
            if (subMesh.getRenderingMesh().hasThinInstances) {
                defines.push("#define THIN_INSTANCES");
            }
        }
        // ClipPlanes
        prepareStringDefinesForClipPlanes(material, this._scene, defines);
        this._addCustomEffectDefines(defines);
        // Get correct effect
        const drawWrapper = subMesh._getDrawWrapper(undefined, true);
        const cachedDefines = drawWrapper.defines;
        const join = defines.join("\n");
        if (cachedDefines !== join) {
            const uniforms = [
                "world",
                "mBones",
                "viewProjection",
                "glowColor",
                "morphTargetInfluences",
                "morphTargetCount",
                "boneTextureWidth",
                "diffuseMatrix",
                "emissiveMatrix",
                "opacityMatrix",
                "opacityIntensity",
                "morphTargetTextureInfo",
                "morphTargetTextureIndices",
                "glowIntensity",
            ];
            addClipPlaneUniforms(uniforms);
            drawWrapper.setEffect(this._engine.createEffect("glowMapGeneration", attribs, uniforms, ["diffuseSampler", "emissiveSampler", "opacitySampler", "boneSampler", "morphTargets"], join, fallbacks, undefined, undefined, { maxSimultaneousMorphTargets: morphInfluencers }), join);
        }
        return drawWrapper.effect.isReady();
    }
    /**
     * Renders the glowing part of the scene by blending the blurred glowing meshes on top of the rendered scene.
     */
    render() {
        for (let i = 0; i < this._postProcesses.length; i++) {
            if (!this._postProcesses[i].isReady()) {
                return;
            }
        }
        const engine = this._scene.getEngine();
        const numDraws = this._numInternalDraws();
        // Check
        let isReady = true;
        for (let i = 0; i < numDraws; ++i) {
            let currentEffect = this._mergeDrawWrapper[i];
            if (!currentEffect) {
                currentEffect = this._mergeDrawWrapper[i] = new DrawWrapper(this._engine);
                currentEffect.setEffect(this._createMergeEffect());
            }
            isReady = isReady && currentEffect.effect.isReady();
        }
        if (!isReady) {
            return;
        }
        this.onBeforeComposeObservable.notifyObservers(this);
        const previousAlphaMode = engine.getAlphaMode();
        for (let i = 0; i < numDraws; ++i) {
            const currentEffect = this._mergeDrawWrapper[i];
            // Render
            engine.enableEffect(currentEffect);
            engine.setState(false);
            // VBOs
            engine.bindBuffers(this._vertexBuffers, this._indexBuffer, currentEffect.effect);
            // Go Blend.
            engine.setAlphaMode(this._effectLayerOptions.alphaBlendingMode);
            // Blends the map on the main canvas.
            this._internalRender(currentEffect.effect, i);
        }
        // Restore Alpha
        engine.setAlphaMode(previousAlphaMode);
        this.onAfterComposeObservable.notifyObservers(this);
        // Handle size changes.
        const size = this._mainTexture.getSize();
        this._setMainTextureSize();
        if ((size.width !== this._mainTextureDesiredSize.width || size.height !== this._mainTextureDesiredSize.height) &&
            this._mainTextureDesiredSize.width !== 0 &&
            this._mainTextureDesiredSize.height !== 0) {
            // Recreate RTT and post processes on size change.
            this.onSizeChangedObservable.notifyObservers(this);
            this._disposeTextureAndPostProcesses();
            this._createMainTexture();
            this._createTextureAndPostProcesses();
        }
    }
    /**
     * Determine if a given mesh will be used in the current effect.
     * @param mesh mesh to test
     * @returns true if the mesh will be used
     */
    hasMesh(mesh) {
        if (this.renderingGroupId === -1 || mesh.renderingGroupId === this.renderingGroupId) {
            return true;
        }
        return false;
    }
    /**
     * Returns true if the layer contains information to display, otherwise false.
     * @returns true if the glow layer should be rendered
     */
    shouldRender() {
        return this.isEnabled && this._shouldRender;
    }
    /**
     * Returns true if the mesh should render, otherwise false.
     * @param mesh The mesh to render
     * @returns true if it should render otherwise false
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _shouldRenderMesh(mesh) {
        return true;
    }
    /**
     * Returns true if the mesh can be rendered, otherwise false.
     * @param mesh The mesh to render
     * @param material The material used on the mesh
     * @returns true if it can be rendered otherwise false
     */
    _canRenderMesh(mesh, material) {
        return !material.needAlphaBlendingForMesh(mesh);
    }
    /**
     * Returns true if the mesh should render, otherwise false.
     * @returns true if it should render otherwise false
     */
    _shouldRenderEmissiveTextureForMesh() {
        return true;
    }
    /**
     * Renders the submesh passed in parameter to the generation map.
     * @param subMesh
     * @param enableAlphaMode
     */
    _renderSubMesh(subMesh, enableAlphaMode = false) {
        if (!this.shouldRender()) {
            return;
        }
        const material = subMesh.getMaterial();
        const ownerMesh = subMesh.getMesh();
        const replacementMesh = subMesh.getReplacementMesh();
        const renderingMesh = subMesh.getRenderingMesh();
        const effectiveMesh = subMesh.getEffectiveMesh();
        const scene = this._scene;
        const engine = scene.getEngine();
        effectiveMesh._internalAbstractMeshDataInfo._isActiveIntermediate = false;
        if (!material) {
            return;
        }
        // Do not block in blend mode.
        if (!this._canRenderMesh(renderingMesh, material)) {
            return;
        }
        // Culling
        let sideOrientation = material._getEffectiveOrientation(renderingMesh);
        const mainDeterminant = effectiveMesh._getWorldMatrixDeterminant();
        if (mainDeterminant < 0) {
            sideOrientation = sideOrientation === Material.ClockWiseSideOrientation ? Material.CounterClockWiseSideOrientation : Material.ClockWiseSideOrientation;
        }
        const reverse = sideOrientation === Material.ClockWiseSideOrientation;
        engine.setState(material.backFaceCulling, material.zOffset, undefined, reverse, material.cullBackFaces, undefined, material.zOffsetUnits);
        // Managing instances
        const batch = renderingMesh._getInstancesRenderList(subMesh._id, !!replacementMesh);
        if (batch.mustReturn) {
            return;
        }
        // Early Exit per mesh
        if (!this._shouldRenderMesh(renderingMesh)) {
            return;
        }
        const hardwareInstancedRendering = batch.hardwareInstancedRendering[subMesh._id] || renderingMesh.hasThinInstances;
        this._setEmissiveTextureAndColor(renderingMesh, subMesh, material);
        this.onBeforeRenderMeshToEffect.notifyObservers(ownerMesh);
        if (this._useMeshMaterial(renderingMesh)) {
            renderingMesh.render(subMesh, enableAlphaMode, replacementMesh || undefined);
        }
        else if (this._isReady(subMesh, hardwareInstancedRendering, this._emissiveTextureAndColor.texture)) {
            const renderingMaterial = effectiveMesh._internalAbstractMeshDataInfo._materialForRenderPass?.[engine.currentRenderPassId];
            let drawWrapper = subMesh._getDrawWrapper();
            if (!drawWrapper && renderingMaterial) {
                drawWrapper = renderingMaterial._getDrawWrapper();
            }
            if (!drawWrapper) {
                return;
            }
            const effect = drawWrapper.effect;
            engine.enableEffect(drawWrapper);
            if (!hardwareInstancedRendering) {
                renderingMesh._bind(subMesh, effect, material.fillMode);
            }
            if (!renderingMaterial) {
                effect.setMatrix("viewProjection", scene.getTransformMatrix());
                effect.setMatrix("world", effectiveMesh.getWorldMatrix());
                effect.setFloat4("glowColor", this._emissiveTextureAndColor.color.r, this._emissiveTextureAndColor.color.g, this._emissiveTextureAndColor.color.b, this._emissiveTextureAndColor.color.a);
            }
            else {
                renderingMaterial.bindForSubMesh(effectiveMesh.getWorldMatrix(), effectiveMesh, subMesh);
            }
            if (!renderingMaterial) {
                const needAlphaTest = material.needAlphaTesting();
                const diffuseTexture = material.getAlphaTestTexture();
                const needAlphaBlendFromDiffuse = diffuseTexture && diffuseTexture.hasAlpha && (material.useAlphaFromDiffuseTexture || material._useAlphaFromAlbedoTexture);
                if (diffuseTexture && (needAlphaTest || needAlphaBlendFromDiffuse)) {
                    effect.setTexture("diffuseSampler", diffuseTexture);
                    const textureMatrix = diffuseTexture.getTextureMatrix();
                    if (textureMatrix) {
                        effect.setMatrix("diffuseMatrix", textureMatrix);
                    }
                }
                const opacityTexture = material.opacityTexture;
                if (opacityTexture) {
                    effect.setTexture("opacitySampler", opacityTexture);
                    effect.setFloat("opacityIntensity", opacityTexture.level);
                    const textureMatrix = opacityTexture.getTextureMatrix();
                    if (textureMatrix) {
                        effect.setMatrix("opacityMatrix", textureMatrix);
                    }
                }
                // Glow emissive only
                if (this._emissiveTextureAndColor.texture) {
                    effect.setTexture("emissiveSampler", this._emissiveTextureAndColor.texture);
                    effect.setMatrix("emissiveMatrix", this._emissiveTextureAndColor.texture.getTextureMatrix());
                }
                // Bones
                if (renderingMesh.useBones && renderingMesh.computeBonesUsingShaders && renderingMesh.skeleton) {
                    const skeleton = renderingMesh.skeleton;
                    if (skeleton.isUsingTextureForMatrices) {
                        const boneTexture = skeleton.getTransformMatrixTexture(renderingMesh);
                        if (!boneTexture) {
                            return;
                        }
                        effect.setTexture("boneSampler", boneTexture);
                        effect.setFloat("boneTextureWidth", 4.0 * (skeleton.bones.length + 1));
                    }
                    else {
                        effect.setMatrices("mBones", skeleton.getTransformMatrices(renderingMesh));
                    }
                }
                // Morph targets
                BindMorphTargetParameters(renderingMesh, effect);
                if (renderingMesh.morphTargetManager && renderingMesh.morphTargetManager.isUsingTextureForTargets) {
                    renderingMesh.morphTargetManager._bind(effect);
                }
                // Alpha mode
                if (enableAlphaMode) {
                    engine.setAlphaMode(material.alphaMode);
                }
                // Intensity of effect
                effect.setFloat("glowIntensity", this.getEffectIntensity(renderingMesh));
                // Clip planes
                bindClipPlane(effect, material, scene);
            }
            // Draw
            renderingMesh._processRendering(effectiveMesh, subMesh, effect, material.fillMode, batch, hardwareInstancedRendering, (isInstance, world) => effect.setMatrix("world", world));
        }
        else {
            // Need to reset refresh rate of the main map
            this._mainTexture.resetRefreshCounter();
        }
        this.onAfterRenderMeshToEffect.notifyObservers(ownerMesh);
    }
    /**
     * Defines whether the current material of the mesh should be use to render the effect.
     * @param mesh defines the current mesh to render
     * @returns true if the mesh material should be use
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _useMeshMaterial(mesh) {
        return false;
    }
    /**
     * Rebuild the required buffers.
     * @internal Internal use only.
     */
    _rebuild() {
        const vb = this._vertexBuffers[VertexBuffer.PositionKind];
        if (vb) {
            vb._rebuild();
        }
        this._generateIndexBuffer();
    }
    /**
     * Dispose only the render target textures and post process.
     */
    _disposeTextureAndPostProcesses() {
        this._mainTexture.dispose();
        for (let i = 0; i < this._postProcesses.length; i++) {
            if (this._postProcesses[i]) {
                this._postProcesses[i].dispose();
            }
        }
        this._postProcesses = [];
        for (let i = 0; i < this._textures.length; i++) {
            if (this._textures[i]) {
                this._textures[i].dispose();
            }
        }
        this._textures = [];
    }
    /**
     * Dispose the highlight layer and free resources.
     */
    dispose() {
        const vertexBuffer = this._vertexBuffers[VertexBuffer.PositionKind];
        if (vertexBuffer) {
            vertexBuffer.dispose();
            this._vertexBuffers[VertexBuffer.PositionKind] = null;
        }
        if (this._indexBuffer) {
            this._scene.getEngine()._releaseBuffer(this._indexBuffer);
            this._indexBuffer = null;
        }
        for (const drawWrapper of this._mergeDrawWrapper) {
            drawWrapper.dispose();
        }
        this._mergeDrawWrapper = [];
        // Clean textures and post processes
        this._disposeTextureAndPostProcesses();
        // Remove from scene
        const index = this._scene.effectLayers.indexOf(this, 0);
        if (index > -1) {
            this._scene.effectLayers.splice(index, 1);
        }
        // Callback
        this.onDisposeObservable.notifyObservers(this);
        this.onDisposeObservable.clear();
        this.onBeforeRenderMainTextureObservable.clear();
        this.onBeforeComposeObservable.clear();
        this.onBeforeRenderMeshToEffect.clear();
        this.onAfterRenderMeshToEffect.clear();
        this.onAfterComposeObservable.clear();
        this.onSizeChangedObservable.clear();
    }
    /**
     * Gets the class name of the effect layer
     * @returns the string with the class name of the effect layer
     */
    getClassName() {
        return "EffectLayer";
    }
    /**
     * Creates an effect layer from parsed effect layer data
     * @param parsedEffectLayer defines effect layer data
     * @param scene defines the current scene
     * @param rootUrl defines the root URL containing the effect layer information
     * @returns a parsed effect Layer
     */
    static Parse(parsedEffectLayer, scene, rootUrl) {
        const effectLayerType = Tools.Instantiate(parsedEffectLayer.customType);
        return effectLayerType.Parse(parsedEffectLayer, scene, rootUrl);
    }
}
/**
 * @internal
 */
EffectLayer._SceneComponentInitialization = (_) => {
    throw _WarnImport("EffectLayerSceneComponent");
};
__decorate([
    serialize()
], EffectLayer.prototype, "name", void 0);
__decorate([
    serializeAsColor4()
], EffectLayer.prototype, "neutralColor", void 0);
__decorate([
    serialize()
], EffectLayer.prototype, "isEnabled", void 0);
__decorate([
    serializeAsCameraReference()
], EffectLayer.prototype, "camera", null);
__decorate([
    serialize()
], EffectLayer.prototype, "renderingGroupId", null);
__decorate([
    serialize()
], EffectLayer.prototype, "disableBoundingBoxesFromEffectLayer", void 0);
//# sourceMappingURL=effectLayer.js.map
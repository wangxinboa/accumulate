import { __decorate } from "../../../../tslib.es6.js";
import { NodeMaterialBlock } from "../../nodeMaterialBlock.js";
import { NodeMaterialBlockConnectionPointTypes } from "../../Enums/nodeMaterialBlockConnectionPointTypes.js";
import { NodeMaterialConnectionPointDirection } from "../../nodeMaterialBlockConnectionPoint.js";
import { NodeMaterialBlockTargets } from "../../Enums/nodeMaterialBlockTargets.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
import { InputBlock } from "../Input/inputBlock.js";
import { NodeMaterialConnectionPointCustomObject } from "../../nodeMaterialConnectionPointCustomObject.js";
import { PBRClearCoatConfiguration } from "../../../PBR/pbrClearCoatConfiguration.js";
import { editableInPropertyPage, PropertyTypeForEdition } from "../../../../Decorators/nodeDecorator.js";
import { TBNBlock } from "../Fragment/TBNBlock.js";
/**
 * Block used to implement the clear coat module of the PBR material
 */
export class ClearCoatBlock extends NodeMaterialBlock {
    /**
     * Create a new ClearCoatBlock
     * @param name defines the block name
     */
    constructor(name) {
        super(name, NodeMaterialBlockTargets.Fragment);
        this._tangentCorrectionFactorName = "";
        /**
         * Defines if the F0 value should be remapped to account for the interface change in the material.
         */
        this.remapF0OnInterfaceChange = true;
        this._isUnique = true;
        this.registerInput("intensity", NodeMaterialBlockConnectionPointTypes.Float, false, NodeMaterialBlockTargets.Fragment);
        this.registerInput("roughness", NodeMaterialBlockConnectionPointTypes.Float, true, NodeMaterialBlockTargets.Fragment);
        this.registerInput("indexOfRefraction", NodeMaterialBlockConnectionPointTypes.Float, true, NodeMaterialBlockTargets.Fragment);
        this.registerInput("normalMapColor", NodeMaterialBlockConnectionPointTypes.Color3, true, NodeMaterialBlockTargets.Fragment);
        this.registerInput("uv", NodeMaterialBlockConnectionPointTypes.Vector2, true, NodeMaterialBlockTargets.Fragment);
        this.registerInput("tintColor", NodeMaterialBlockConnectionPointTypes.Color3, true, NodeMaterialBlockTargets.Fragment);
        this.registerInput("tintAtDistance", NodeMaterialBlockConnectionPointTypes.Float, true, NodeMaterialBlockTargets.Fragment);
        this.registerInput("tintThickness", NodeMaterialBlockConnectionPointTypes.Float, true, NodeMaterialBlockTargets.Fragment);
        this.registerInput("worldTangent", NodeMaterialBlockConnectionPointTypes.Vector4, true);
        this.registerInput("worldNormal", NodeMaterialBlockConnectionPointTypes.AutoDetect, true);
        this.worldNormal.addExcludedConnectionPointFromAllowedTypes(NodeMaterialBlockConnectionPointTypes.Color4 | NodeMaterialBlockConnectionPointTypes.Vector4 | NodeMaterialBlockConnectionPointTypes.Vector3);
        this.registerInput("TBN", NodeMaterialBlockConnectionPointTypes.Object, true, NodeMaterialBlockTargets.VertexAndFragment, new NodeMaterialConnectionPointCustomObject("TBN", this, NodeMaterialConnectionPointDirection.Input, TBNBlock, "TBNBlock"));
        this.registerOutput("clearcoat", NodeMaterialBlockConnectionPointTypes.Object, NodeMaterialBlockTargets.Fragment, new NodeMaterialConnectionPointCustomObject("clearcoat", this, NodeMaterialConnectionPointDirection.Output, ClearCoatBlock, "ClearCoatBlock"));
    }
    /**
     * Initialize the block and prepare the context for build
     * @param state defines the state that will be used for the build
     */
    initialize(state) {
        state._excludeVariableName("clearcoatOut");
        state._excludeVariableName("vClearCoatParams");
        state._excludeVariableName("vClearCoatTintParams");
        state._excludeVariableName("vClearCoatRefractionParams");
        state._excludeVariableName("vClearCoatTangentSpaceParams");
        state._excludeVariableName("vGeometricNormaClearCoatW");
    }
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName() {
        return "ClearCoatBlock";
    }
    /**
     * Gets the intensity input component
     */
    get intensity() {
        return this._inputs[0];
    }
    /**
     * Gets the roughness input component
     */
    get roughness() {
        return this._inputs[1];
    }
    /**
     * Gets the ior input component
     */
    get indexOfRefraction() {
        return this._inputs[2];
    }
    /**
     * Gets the bump texture input component
     */
    get normalMapColor() {
        return this._inputs[3];
    }
    /**
     * Gets the uv input component
     */
    get uv() {
        return this._inputs[4];
    }
    /**
     * Gets the tint color input component
     */
    get tintColor() {
        return this._inputs[5];
    }
    /**
     * Gets the tint "at distance" input component
     */
    get tintAtDistance() {
        return this._inputs[6];
    }
    /**
     * Gets the tint thickness input component
     */
    get tintThickness() {
        return this._inputs[7];
    }
    /**
     * Gets the world tangent input component
     */
    get worldTangent() {
        return this._inputs[8];
    }
    /**
     * Gets the world normal input component
     */
    get worldNormal() {
        return this._inputs[9];
    }
    /**
     * Gets the TBN input component
     */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    get TBN() {
        return this._inputs[10];
    }
    /**
     * Gets the clear coat object output component
     */
    get clearcoat() {
        return this._outputs[0];
    }
    autoConfigure() {
        if (!this.intensity.isConnected) {
            const intensityInput = new InputBlock("ClearCoat intensity", NodeMaterialBlockTargets.Fragment, NodeMaterialBlockConnectionPointTypes.Float);
            intensityInput.value = 1;
            intensityInput.output.connectTo(this.intensity);
        }
    }
    prepareDefines(mesh, nodeMaterial, defines) {
        super.prepareDefines(mesh, nodeMaterial, defines);
        defines.setValue("CLEARCOAT", true);
        defines.setValue("CLEARCOAT_TEXTURE", false, true);
        defines.setValue("CLEARCOAT_USE_ROUGHNESS_FROM_MAINTEXTURE", true, true);
        defines.setValue("CLEARCOAT_TINT", this.tintColor.isConnected || this.tintThickness.isConnected || this.tintAtDistance.isConnected, true);
        defines.setValue("CLEARCOAT_BUMP", this.normalMapColor.isConnected, true);
        defines.setValue("CLEARCOAT_DEFAULTIOR", this.indexOfRefraction.isConnected ? this.indexOfRefraction.connectInputBlock.value === PBRClearCoatConfiguration._DefaultIndexOfRefraction : true, true);
        defines.setValue("CLEARCOAT_REMAP_F0", this.remapF0OnInterfaceChange, true);
    }
    bind(effect, nodeMaterial, mesh) {
        super.bind(effect, nodeMaterial, mesh);
        // Clear Coat Refraction params
        const indexOfRefraction = this.indexOfRefraction.connectInputBlock?.value ?? PBRClearCoatConfiguration._DefaultIndexOfRefraction;
        const a = 1 - indexOfRefraction;
        const b = 1 + indexOfRefraction;
        const f0 = Math.pow(-a / b, 2); // Schlicks approx: (ior1 - ior2) / (ior1 + ior2) where ior2 for air is close to vacuum = 1.
        const eta = 1 / indexOfRefraction;
        effect.setFloat4("vClearCoatRefractionParams", f0, eta, a, b);
        // Clear Coat tangent space params
        const mainPBRBlock = this.clearcoat.hasEndpoints ? this.clearcoat.endpoints[0].ownerBlock : null;
        const perturbedNormalBlock = mainPBRBlock?.perturbedNormal.isConnected ? mainPBRBlock.perturbedNormal.connectedPoint.ownerBlock : null;
        if (this._scene._mirroredCameraPosition) {
            effect.setFloat2("vClearCoatTangentSpaceParams", perturbedNormalBlock?.invertX ? 1.0 : -1.0, perturbedNormalBlock?.invertY ? 1.0 : -1.0);
        }
        else {
            effect.setFloat2("vClearCoatTangentSpaceParams", perturbedNormalBlock?.invertX ? -1.0 : 1.0, perturbedNormalBlock?.invertY ? -1.0 : 1.0);
        }
        if (mesh) {
            effect.setFloat(this._tangentCorrectionFactorName, mesh.getWorldMatrix().determinant() < 0 ? -1 : 1);
        }
    }
    _generateTBNSpace(state, worldPositionVarName, worldNormalVarName) {
        let code = "";
        const comments = `//${this.name}`;
        const worldTangent = this.worldTangent;
        state._emitExtension("derivatives", "#extension GL_OES_standard_derivatives : enable");
        const tangentReplaceString = { search: /defined\(TANGENT\)/g, replace: worldTangent.isConnected ? "defined(TANGENT)" : "defined(IGNORE)" };
        const TBN = this.TBN;
        if (TBN.isConnected) {
            state.compilationString += `
            #ifdef TBNBLOCK
            mat3 vTBN = ${TBN.associatedVariableName};
            #endif
            `;
        }
        else if (worldTangent.isConnected) {
            code += `vec3 tbnNormal = normalize(${worldNormalVarName}.xyz);\n`;
            code += `vec3 tbnTangent = normalize(${worldTangent.associatedVariableName}.xyz);\n`;
            code += `vec3 tbnBitangent = cross(tbnNormal, tbnTangent) * ${this._tangentCorrectionFactorName};\n`;
            code += `mat3 vTBN = mat3(tbnTangent, tbnBitangent, tbnNormal);\n`;
        }
        state._emitFunctionFromInclude("bumpFragmentMainFunctions", comments, {
            replaceStrings: [tangentReplaceString],
        });
        return code;
    }
    /**
     * Gets the main code of the block (fragment side)
     * @param state current state of the node material building
     * @param ccBlock instance of a ClearCoatBlock or null if the code must be generated without an active clear coat module
     * @param reflectionBlock instance of a ReflectionBlock null if the code must be generated without an active reflection module
     * @param worldPosVarName name of the variable holding the world position
     * @param generateTBNSpace if true, the code needed to create the TBN coordinate space is generated
     * @param vTBNAvailable indicate that the vTBN variable is already existing because it has already been generated by another block (PerturbNormal or Anisotropy)
     * @param worldNormalVarName name of the variable holding the world normal
     * @returns the shader code
     */
    static GetCode(state, ccBlock, reflectionBlock, worldPosVarName, generateTBNSpace, vTBNAvailable, worldNormalVarName) {
        let code = "";
        const intensity = ccBlock?.intensity.isConnected ? ccBlock.intensity.associatedVariableName : "1.";
        const roughness = ccBlock?.roughness.isConnected ? ccBlock.roughness.associatedVariableName : "0.";
        const normalMapColor = ccBlock?.normalMapColor.isConnected ? ccBlock.normalMapColor.associatedVariableName : "vec3(0.)";
        const uv = ccBlock?.uv.isConnected ? ccBlock.uv.associatedVariableName : "vec2(0.)";
        const tintColor = ccBlock?.tintColor.isConnected ? ccBlock.tintColor.associatedVariableName : "vec3(1.)";
        const tintThickness = ccBlock?.tintThickness.isConnected ? ccBlock.tintThickness.associatedVariableName : "1.";
        const tintAtDistance = ccBlock?.tintAtDistance.isConnected ? ccBlock.tintAtDistance.associatedVariableName : "1.";
        const tintTexture = "vec4(0.)";
        if (ccBlock) {
            state._emitUniformFromString("vClearCoatRefractionParams", NodeMaterialBlockConnectionPointTypes.Vector4);
            state._emitUniformFromString("vClearCoatTangentSpaceParams", NodeMaterialBlockConnectionPointTypes.Vector2);
            const normalShading = ccBlock.worldNormal;
            code += `vec3 vGeometricNormaClearCoatW = ${normalShading.isConnected ? "normalize(" + normalShading.associatedVariableName + ".xyz)" : "geometricNormalW"};\n`;
        }
        else {
            code += `vec3 vGeometricNormaClearCoatW = geometricNormalW;\n`;
        }
        if (generateTBNSpace && ccBlock) {
            code += ccBlock._generateTBNSpace(state, worldPosVarName, worldNormalVarName);
            vTBNAvailable = ccBlock.worldTangent.isConnected;
        }
        code += `clearcoatOutParams clearcoatOut;

        #ifdef CLEARCOAT
            vec2 vClearCoatParams = vec2(${intensity}, ${roughness});
            vec4 vClearCoatTintParams = vec4(${tintColor}, ${tintThickness});

            clearcoatBlock(
                ${worldPosVarName}.xyz,
                vGeometricNormaClearCoatW,
                viewDirectionW,
                vClearCoatParams,
                specularEnvironmentR0,
            #ifdef CLEARCOAT_TEXTURE
                vec2(0.),
            #endif
            #ifdef CLEARCOAT_TINT
                vClearCoatTintParams,
                ${tintAtDistance},
                vClearCoatRefractionParams,
                #ifdef CLEARCOAT_TINT_TEXTURE
                    ${tintTexture},
                #endif
            #endif
            #ifdef CLEARCOAT_BUMP
                vec2(0., 1.),
                vec4(${normalMapColor}, 0.),
                ${uv},
                #if defined(${vTBNAvailable ? "TANGENT" : "IGNORE"}) && defined(NORMAL)
                    vTBN,
                #else
                    vClearCoatTangentSpaceParams,
                #endif
                #ifdef OBJECTSPACE_NORMALMAP
                    normalMatrix,
                #endif
            #endif
            #if defined(FORCENORMALFORWARD) && defined(NORMAL)
                faceNormal,
            #endif
            #ifdef REFLECTION
                ${reflectionBlock?._vReflectionMicrosurfaceInfosName},
                ${reflectionBlock?._vReflectionInfosName},
                ${reflectionBlock?.reflectionColor},
                vLightingIntensity,
                #ifdef ${reflectionBlock?._define3DName}
                    ${reflectionBlock?._cubeSamplerName},
                #else
                    ${reflectionBlock?._2DSamplerName},
                #endif
                #ifndef LODBASEDMICROSFURACE
                    #ifdef ${reflectionBlock?._define3DName}
                        ${reflectionBlock?._cubeSamplerName},
                        ${reflectionBlock?._cubeSamplerName},
                    #else
                        ${reflectionBlock?._2DSamplerName},
                        ${reflectionBlock?._2DSamplerName},
                    #endif
                #endif
            #endif
            #if defined(ENVIRONMENTBRDF) && !defined(${reflectionBlock?._defineSkyboxName})
                #ifdef RADIANCEOCCLUSION
                    ambientMonochrome,
                #endif
            #endif
            #if defined(CLEARCOAT_BUMP) || defined(TWOSIDEDLIGHTING)
                (gl_FrontFacing ? 1. : -1.),
            #endif
                clearcoatOut
            );
        #else
            clearcoatOut.specularEnvironmentR0 = specularEnvironmentR0;
        #endif\n`;
        return code;
    }
    _buildBlock(state) {
        this._scene = state.sharedData.scene;
        if (state.target === NodeMaterialBlockTargets.Fragment) {
            state.sharedData.bindableBlocks.push(this);
            state.sharedData.blocksWithDefines.push(this);
            this._tangentCorrectionFactorName = state._getFreeDefineName("tangentCorrectionFactor");
            state._emitUniformFromString(this._tangentCorrectionFactorName, NodeMaterialBlockConnectionPointTypes.Float);
        }
        return this;
    }
    _dumpPropertiesCode() {
        let codeString = super._dumpPropertiesCode();
        codeString += `${this._codeVariableName}.remapF0OnInterfaceChange = ${this.remapF0OnInterfaceChange};\n`;
        return codeString;
    }
    serialize() {
        const serializationObject = super.serialize();
        serializationObject.remapF0OnInterfaceChange = this.remapF0OnInterfaceChange;
        return serializationObject;
    }
    _deserialize(serializationObject, scene, rootUrl) {
        super._deserialize(serializationObject, scene, rootUrl);
        this.remapF0OnInterfaceChange = serializationObject.remapF0OnInterfaceChange ?? true;
    }
}
__decorate([
    editableInPropertyPage("Remap F0 on interface change", PropertyTypeForEdition.Boolean, "ADVANCED")
], ClearCoatBlock.prototype, "remapF0OnInterfaceChange", void 0);
RegisterClass("BABYLON.ClearCoatBlock", ClearCoatBlock);
//# sourceMappingURL=clearCoatBlock.js.map
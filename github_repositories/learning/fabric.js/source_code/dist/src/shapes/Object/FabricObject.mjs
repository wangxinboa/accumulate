import { FabricObjectSVGExportMixin } from './FabricObjectSVGExportMixin.mjs';
import { InteractiveFabricObject } from './InteractiveObject.mjs';
import { applyMixins } from '../../util/applyMixins.mjs';
import { classRegistry } from '../../ClassRegistry.mjs';

// TODO somehow we have to make a tree-shakeable import

// eslint-disable-next-line @typescript-eslint/no-empty-object-type

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
const FabricObject = codeMarkClass(class FabricObject extends InteractiveFabricObject { }, 'src/shapes/Object/FabricObject.mjs FabricObject')
applyMixins(FabricObject, [FabricObjectSVGExportMixin]);
classRegistry.setClass(FabricObject);
classRegistry.setClass(FabricObject, 'object');

export { FabricObject };
//# sourceMappingURL=FabricObject.mjs.map

import { reNum } from '../../parser/constants.mjs';

const regex = new RegExp("(".concat(reNum, ")"), 'gi');
const cleanupSvgAttribute = fabricJsFunctionMark(attributeValue => attributeValue.replace(regex, ' $1 ')
// replace annoying commas and arbitrary whitespace with single spaces
.replace(/,/gi, ' ').replace(/\s+/gi, ' '), 'cleanupSvgAttribute');

export { cleanupSvgAttribute };
//# sourceMappingURL=cleanupSvgAttribute.mjs.map

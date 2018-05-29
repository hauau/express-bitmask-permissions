"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
;
/** Runtime options checks */
const validatePBMOptions = function (options) {
    const isNonemptyObject = (obj) => typeof (obj) === 'object' &&
        Object.keys(obj).length >= 1;
    if (!isNonemptyObject(options))
        throw Error('express-bitmask-permissions requires "sections" and "descriptorBody" options');
    if (!isNonemptyObject(options.sections))
        throw Error('express-bitmask-permissions requires "sections" option');
    if (!isNonemptyObject(options.descriptorBody))
        throw Error('express-bitmask-permissions requires "descriptorBody" option');
    if (options.masksField && (typeof (options.masksField) !== 'string'))
        throw Error('express-bitmask-permissions requires "masks" to be a string');
};
exports.validatePBMOptions = validatePBMOptions;
/** Drop common prefix from url path */
const dropPrefix = function (path, prefix) {
    if (!prefix) {
        return path;
    }
    const prefixIndex = path.indexOf(prefix);
    return prefixIndex !== -1
        ? path.slice(prefixIndex + prefix.length, path.length)
        : path;
};
exports.dropPrefix = dropPrefix;
/** Extract section matching string from url path */
const sectionFromPath = function (path, options) {
    const match = dropPrefix(path, options.urlPrefix).match(options.baseRegexp);
    return match ? match[0] : '';
};
exports.sectionFromPath = sectionFromPath;
//# sourceMappingURL=utils.js.map
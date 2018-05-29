"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generic_bitmask_1 = require("generic-bitmask");
const utils_1 = require("./lib/utils");
const PBM = function (options) {
    /** Runtime options checks */
    utils_1.validatePBMOptions(options);
    /** Building common defnitions beforehand */
    const sections = options.sections;
    const descriptor = new generic_bitmask_1.Descriptor(options.descriptorBody);
    /** Setting default values */
    options.masksField = options.masksField || 'masks';
    options.baseRegexp = options.baseRegexp || '/^(\/[^\/]+)/';
    /* Returning middleware itself */
    return function (req, res, next) {
        /** If permissions can't be extracted
         * return no permissions for user
         */
        if (typeof (req.user) === 'undefined' ||
            typeof (req.user[options.masksField]) !== 'object') {
            req.permissions = [];
            return next();
        }
        /**
         * Section is chosen on base url element match
         * against sections definition
         *
         * e.g. `'/things/45'` has a base element `'/things'`
         * and will match a definition `{ '/things': 5 }`
         * and resulting section will be `5`
         */
        const path = utils_1.sectionFromPath(req.path, options);
        const section = sections[path];
        /** Section is *required* to perform access control */
        if (typeof (section) === 'undefined') {
            const err = new Error(`Route ${path} isn't mapped to any section`);
            return next(err);
        }
        const mask = req.user.masks[section];
        req.permissions = mask
            ? descriptor.extract(mask)
            : [];
        next();
    };
};
exports.default = PBM;
//# sourceMappingURL=index.js.map
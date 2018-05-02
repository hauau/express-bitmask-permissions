"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generic_bitmask_1 = require("generic-bitmask");
;
const PBM = function (options) {
    /** Building common defnitions beforehand */
    const sections = options.sections;
    const descriptor = new generic_bitmask_1.Descriptor(options.descriptorBody);
    const masksField = options.masksField || 'masks';
    /* Returning middleware itself */
    return function (req, res, next) {
        /** If permissions can't be extracted
         * return no permissions for user
         */
        if (typeof (req.user) === 'undefined' ||
            typeof (req.user[masksField]) !== 'object') {
            return req.permissions = [];
        }
        /**
         * Section is chosen on base url element match
         * against sections definition
         *
         * e.g. `'/things/45'` has a base element `'/things'`
         * and will match a definition `{ '/things': 5 }`
         * and resulting section will be `5`
         */
        const section = sections[req.baseUrl];
        /** Section is *required* to perform access control */
        if (typeof (section) === 'undefined') {
            return next(new Error(`Route ${req.originalUrl} isn't mapped to any section`));
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
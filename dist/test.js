"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generic_bitmask_1 = require("generic-bitmask");
const testMaskDef = {
    "read": 1,
    "write": 2,
    "update": 3
};
const testDescr = new generic_bitmask_1.Descriptor(testMaskDef);
const routesDef = {
    '/ok': 0,
    '/norm': 1,
    '/meme': 2
};
var err = new generic_bitmask_1.Descriptor(undefined);
//# sourceMappingURL=test.js.map
interface PBMConfig {
    /**
     * `generic-bitmask` descriptor definition
     *
     * Consists of keys for unique permission name and values for bit number
    */
    descriptorBody: {
        [permission: string]: number;
    };
    /**
     * Sections definition obj
     *
     * Consist of keys for routes and values for sections
    */
    sections: {
        [route: string]: number;
    };
    /** Field in jwt to store masks array */
    masksField?: string;
    /** url prefix to ignore */
    urlPrefix?: string;
    /**
     * RegExp string to get base url
     * First group would be used to match against section definition
     */
    baseRegexp: '/^(\/[^\/]+)/';
}
/** Runtime options checks */
declare const validatePBMOptions: (options: PBMConfig) => void;
/** Drop common prefix from url path */
declare const dropPrefix: (path: string, prefix?: string | undefined) => string;
/** Extract section matching string from url path */
declare const sectionFromPath: (path: string, options: PBMConfig) => string;
export { dropPrefix, sectionFromPath, validatePBMOptions, PBMConfig };

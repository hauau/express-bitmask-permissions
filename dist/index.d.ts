export interface IPBM {
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
}
declare const PBM: (options: IPBM) => (req: any, res: any, next: Function) => any;
export default PBM;

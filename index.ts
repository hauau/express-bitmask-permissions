import { Mask, Descriptor } from 'generic-bitmask'

export interface IPBM {
  /**
   * `generic-bitmask` descriptor definition 
   * 
   * Consists of keys for unique permission name and values for bit number
  */
  descriptorBody: {
    [permission: string]: number
  },
  /** 
   * Sections definition obj
   * 
   * Consist of keys for routes and values for sections
  */
  sections: {
    [route: string]: number
  },
  /** Field in jwt to store masks array */
  masksField?: string,
};

/** Runtime options checks */
const validatePBMOptions = function (options: IPBM) {
  
  const isNonemptyObject = (obj: any) => 
    typeof (obj) === 'object' &&
    Object.keys(obj).length >= 1

  if (!isNonemptyObject(options)) 
    throw Error('express-bitmask-permissions requires "sections" and "descriptorBody" options')

  if (!isNonemptyObject(options.sections)) 
    throw Error('express-bitmask-permissions requires "sections" option')

  if (!isNonemptyObject(options.descriptorBody))
    throw Error('express-bitmask-permissions requires "descriptorBody" option')

  if (options.masksField && (typeof (options.masksField) !== 'string')) 
    throw Error('express-bitmask-permissions requires "masks" to be a string')
}

const PBM = function (options: IPBM) {

  /** Runtime options checks */
  validatePBMOptions(options)

  /** Building common defnitions beforehand */
  const sections = options.sections;
  const descriptor = new Descriptor(options.descriptorBody);
  const masksField = options.masksField || 'masks';

  /* Returning middleware itself */
  return function (req: any, res: any, next: Function) {

    /** If permissions can't be extracted
     * return no permissions for user
     */
    if (typeof (req.user) === 'undefined' ||
        typeof (req.user[masksField]) !== 'object'
    ) {
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
    const section = sections[req.baseUrl];

    /** Section is *required* to perform access control */
    if (typeof(section) === 'undefined') {
      return next(
        new Error(`Route ${req.originalUrl} isn't mapped to any section`)
      );  
    }
    
    const mask = req.user.masks[section]

    req.permissions = mask
      ? descriptor.extract(mask)
      : [];

    next();
  }

};

export default PBM;

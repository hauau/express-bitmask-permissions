import { Mask, Descriptor } from 'generic-bitmask';
import {
  PBMConfig,
  validatePBMOptions,
  sectionFromPath
} from './lib/utils';

const PBM = function (options: PBMConfig) {

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

    const path = sectionFromPath(req.path, options)
    const section = sections[path];

    /** Section is *required* to perform access control */
    if (typeof(section) === 'undefined') {
      return next(
        new Error(`Route ${path} isn't mapped to any section`)
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

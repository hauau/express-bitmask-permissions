interface PBMConfig {
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
  /** 
  * RegExp string to get base url
  * First group would be used to match against section definition
  * 
  * Defaults to `/^(\/[^\/]+)/`
  */
  baseRegexp?: string | RegExp
  /** Field in jwt to store masks array */
  masksField?: string,
  /** url prefix to ignore */
  urlPrefix?: string,
};

/** Runtime options checks */
const validatePBMOptions = function (options: PBMConfig) {

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

/** Drop common prefix from url path */
const dropPrefix = function (path: string, prefix?: string) {
  if (!prefix) { return path; }
  const prefixIndex = path.indexOf(prefix)
  return prefixIndex !== -1
    ? path.slice(prefixIndex + prefix.length, path.length)
    : path
}

/** Extract section matching string from url path */
const sectionFromPath = function (path: string, options: PBMConfig) {
  const match = dropPrefix(path, options.urlPrefix).match(options.baseRegexp as string)

  return match ? match[0] : ''
}

export {
  dropPrefix,
  sectionFromPath,
  validatePBMOptions,
  PBMConfig
}
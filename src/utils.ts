export const makeParams = (params: object): string => {
  return Object.entries(params)
    .map(([k, v]) => `${k}=${v}`)
    .join("&")
}

export const filterMap = <T, K>(elements: T[], f: (elem: T) => K): K[] => {
  return elements.reduce((acc, elem) => {
    const result = f(elem)
    if (!result) {
      return acc
    }
    return [...acc, result]
  }, [] as K[])
}

export const findMap = <T, K>(
  elements: T[],
  f: (elem: T) => K
): K | undefined => {
  const out = elements.find(f)
  if (out) {
    return f(out)
  }
}

/**
 * There's almost certainly a correct way to
 * type this properly using mapped types but
 * I can't be bothered
 */
export const transformKeyNames = <T>(
  toTransform: object,
  source: object
): T => {
  return Object.entries(toTransform).reduce((acc, [k, v]) => {
    acc[(source as any)[k]] = v
    return acc
  }, {} as any)
}

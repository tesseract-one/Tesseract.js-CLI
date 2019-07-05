import { isDate } from "util"

const isObject = (item: any) => (item && typeof item === 'object' && !Array.isArray(item) && !isDate(item))

export function mergeDeep<S1 extends { [key: string]: any }, S2 extends { [key: string]: any }>(
  s1: S1,
  s2: S2
): S1 & S2 {
  const target: { [key: string]: any } = Object.assign({}, s1)
  for (const key in s2) {
    if (isObject(s2[key])) {
      target[key] = (!target[key] || !isObject(target[key]))
        ? Object.assign({}, s2[key])
        : mergeDeep(target[key], s2[key])
    } else {
      target[key] = s2[key]
    }
  }
  return target as S1 & S2
}
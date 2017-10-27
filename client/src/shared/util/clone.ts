export const clone = function<T>(src:T): T {
  if (src === undefined) {
    return undefined;
  } else {
    return Object.assign({}, src);
  }
};

export const cloneAndExtend = function<T>(targetObject: T, ...sourceObjects:Array<any>): T {
  return Object.assign({}, targetObject, ...sourceObjects);
};

const clone = function<T>(src:T): T {
  if (src === undefined) {
    return undefined;
  } else {
    return Object.assign({}, src);
  }
};

export default clone;

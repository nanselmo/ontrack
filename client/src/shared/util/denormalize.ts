const denormalize = function<T>(id: string, records: T[], index: {[id: string]: number}): T {
  try {
    return records[index[id]];
  } catch(e) {
    return null;
  }
};

export default denormalize;

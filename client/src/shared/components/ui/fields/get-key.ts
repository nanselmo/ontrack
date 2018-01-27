import ListOption from "./list-option";
import isKeyedListOption from "./is-keyed-list-option";

const getKey = (opt: ListOption): string => {
  if (isKeyedListOption(opt)) {
    return opt.key;
  } else {
    return opt;
  }
};

export default getKey;

import ListOption from "./list-option";
import isKeyedListOption from "./is-keyed-list-option";

const getDisplayText = (opt: ListOption): string => {
  if (isKeyedListOption(opt)) {
    return opt.displayText;
  } else {
    return opt;
  }
};

export default getDisplayText;

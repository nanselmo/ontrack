import ListOption from "./list-option";
import KeyedListOption from "./keyed-list-option";

const isKeyedListOption = (opt: ListOption): opt is KeyedListOption => {
  return typeof opt !== "string";
}

export default isKeyedListOption;


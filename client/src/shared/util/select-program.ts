import { List, Map } from "immutable";
import CPSProgram from "shared/types/cps-program";

const selectProgram = (id: string, allPrograms: List<CPSProgram>, index: Map<string, number>): CPSProgram => {
  const i = index.get(id);
  return allPrograms.get(i);
}

export default selectProgram;

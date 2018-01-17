import CPSProgram from "shared/types/cps-program";

const isHSProgram = (program: CPSProgram): boolean => {
  if (program.Primary_Category === "HS") {
    // Academic Centers are ES (6th-8th) grade programs that are held
    // in high schools. So, (confusingly) they are labeled as "HS"
    // because their school is a high school even though the programs
    // are ES programs.
    if (program.Program_Type === "Academic Center") {
      return false;
    } else {
      return true;
    }
  } else {
    return false;
  }
};

export default isHSProgram;
